import {
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLFieldConfigMap,
  GraphQLObjectTypeConfig,
  GraphQLInterfaceTypeConfig,
} from 'graphql'
import { JSDOM } from 'jsdom'
import { resolve } from 'url'

function sharedFields(): GraphQLFieldConfigMap<Element, any> {
  const selector = {
    type: GraphQLString,
    description:
      'A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).',
  }
  return {
    content: {
      type: GraphQLString,
      description: 'The HTML content of the subnodes',
      args: { selector },
      resolve(element, { selector }) {
        element = selector ? element.querySelector(selector) : element
        return element && element.innerHTML
      },
    },
    html: {
      type: GraphQLString,
      description: 'The HTML content of the selected DOM node',
      args: { selector },
      resolve(element, { selector }) {
        element = selector ? element.querySelector(selector) : element
        return element && element.outerHTML
      },
    },
    text: {
      type: GraphQLString,
      description: 'The text content of the selected DOM node',
      args: { selector },
      resolve(element, { selector }) {
        element = selector ? element.querySelector(selector) : element
        return element && element.textContent
      },
    },
    tag: {
      type: GraphQLString,
      description: 'The tag name of the selected DOM node',
      args: { selector },
      resolve(element, { selector }) {
        element = selector ? element.querySelector(selector) : element
        return element && element.tagName
      },
    },
    attr: {
      type: GraphQLString,
      description:
        'An attribute of the selected node (eg. `href`, `src`, etc.).',
      args: {
        selector,
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The name of the attribute',
        },
      },
      resolve(element, { selector, name }) {
        element = selector ? element.querySelector(selector) : element
        if (element == null) return null
        const attribute = element.attributes[name]
        if (attribute == null) return null
        return attribute.value
      },
    },
    has: {
      type: GraphQLBoolean,
      description: 'Returns true if an element with the given selector exists.',
      args: { selector },
      resolve(element, { selector }) {
        return !!element.querySelector(selector)
      },
    },
    query: {
      type: ElementType,
      description:
        'Equivalent to [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). The selectors of any nested queries will be scoped to the resulting element.',
      args: { selector },
      resolve(element, { selector }) {
        return element.querySelector(selector)
      },
    },
    queryAll: {
      type: new GraphQLList(ElementType),
      description:
        'Equivalent to [Element.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll). The selectors of any nested queries will be scoped to the resulting elements.',
      args: { selector },
      resolve(element, { selector }) {
        return Array.from(element.querySelectorAll(selector))
      },
    },
    children: {
      type: new GraphQLList(ElementType),
      description: "An element's child elements.",
      resolve(element) {
        return Array.from(element.children)
      },
    },
    childNodes: {
      type: new GraphQLList(ElementType),
      description: "An element's child nodes. Includes text nodes.",
      resolve(element) {
        return Array.from(element.childNodes)
      }
    },
    parent: {
      type: ElementType,
      description: "An element's parent element.",
      resolve(element) {
        return element.parentElement
      },
    },
    siblings: {
      type: new GraphQLList(ElementType),
      description:
        "All elements which are at the same level in the tree as the current element, ie. the children of the current element's parent. Includes the current element.",
      resolve(element) {
        const parent = element.parentElement
        if (parent == null) return [element]
        return Array.from(parent.children)
      },
    },
    next: {
      type: ElementType,
      description:
        "The current element's next sibling. Includes text nodes. Equivalent to [Node.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).",
      resolve(element) {
        return element.nextSibling
      },
    },
    nextAll: {
      type: new GraphQLList(ElementType),
      description: "All of the current element's next siblings",
      resolve(element, { selector }) {
        const siblings = []
        for (
          let next = element.nextSibling;
          next != null;
          next = next.nextSibling
        ) {
          siblings.push(next)
        }
        return siblings
      },
    },
    previous: {
      type: ElementType,
      description:
        "The current element's previous sibling. Includes text nodes. Equivalent to [Node.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).",
      resolve(element) {
        return element.previousSibling
      },
    },
    previousAll: {
      type: new GraphQLList(ElementType),
      description: "All of the current element's previous siblings",
      resolve(element, { selector }) {
        const siblings = []
        for (
          let previous = element.previousSibling;
          previous != null;
          previous = previous.previousSibling
        ) {
          siblings.push(previous)
        }
        siblings.reverse()
        return siblings
      },
    },
  }
}

const NodeType = new GraphQLInterfaceType(<GraphQLInterfaceTypeConfig<
  Element,
  any
>>{
  name: 'Node',
  description: 'A DOM node (either an Element or a Document).',
  fields: sharedFields,
})

const DocumentType = new GraphQLObjectType(<GraphQLObjectTypeConfig<
  Element,
  any
>>{
  name: 'Document',
  description: 'A DOM document.',
  interfaces: [NodeType],
  fields: () => ({
    ...sharedFields(),
    title: {
      type: GraphQLString,
      description: 'The page title',
      resolve(element) {
        return element.ownerDocument.title
      },
    },
  }),
})

const ElementType = new GraphQLObjectType(<GraphQLObjectTypeConfig<
  Element,
  any
>>{
  name: 'Element',
  description: 'A DOM element.',
  interfaces: [NodeType],
  fields: () => ({
    ...sharedFields(),
    visit: {
      type: DocumentType,
      description:
        'If the element is a link, visit the page linked to in the href attribute.',
      async resolve(element) {
        const href = element.attributes['href']
        if (href == null) {
          return null
        }
        const url = resolve(element.ownerDocument.location.href, href.value) // handle relative links.
        const dom = await JSDOM.fromURL(url)
        return dom.window.document.documentElement
      },
    },
  }),
})

const schema = new GraphQLSchema({
  query: new GraphQLObjectType(<GraphQLObjectTypeConfig<{}, {}>>{
    name: 'Query',
    fields: () => ({
      page: {
        type: DocumentType,
        args: {
          url: {
            type: GraphQLString,
            description: 'A URL to fetch the HTML source from.',
          },
          source: {
            type: GraphQLString,
            description:
              'A string containing HTML to be used as the source document.',
          },
        },
        async resolve(_, { url, source }) {
          if (url == null && source == null) {
            throw new Error(
              'You need to provide either a URL or a HTML source string.'
            )
          }
          const dom = url != null ? await JSDOM.fromURL(url) : new JSDOM(source)
          return dom.window.document.documentElement
        },
      },
    }),
  }),
})

// Make this importable with ES6
schema['default'] = schema
export = schema
