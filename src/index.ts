import {
  GraphQLFieldConfigMap,
  GraphQLObjectTypeConfig,
  GraphQLInterfaceTypeConfig,
} from 'graphql'
import { JSDOM } from 'jsdom'
import { resolve } from 'url'

function makeSchema(graphql: any) {
  const {
    GraphQLSchema,
    GraphQLString,
    GraphQLBoolean,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInterfaceType,
    GraphQLList,
  } = graphql
  function sharedFields(): GraphQLFieldConfigMap<Element, any> {
    return {
      content: {
        type: GraphQLString,
        description: 'The HTML content of the subnodes',
        args: {
          selector: { type: GraphQLString },
        },
        resolve(element, { selector }) {
          element = selector ? element.querySelector(selector) : element
          return element && element.innerHTML
        },
      },
      html: {
        type: GraphQLString,
        description: 'The HTML content of the selected DOM node',
        args: {
          selector: { type: GraphQLString },
        },
        resolve(element, { selector }) {
          element = selector ? element.querySelector(selector) : element
          return element && element.outerHTML
        },
      },
      text: {
        type: GraphQLString,
        description: 'The text content of the selected DOM node',
        args: {
          selector: { type: GraphQLString },
        },
        resolve(element, { selector }) {
          element = selector ? element.querySelector(selector) : element
          return element && element.textContent
        },
      },
      tag: {
        type: GraphQLString,
        description: 'The tag name of the selected DOM node',
        args: {
          selector: { type: GraphQLString },
        },
        resolve(element, { selector }) {
          element = selector ? element.querySelector(selector) : element
          return element && element.tagName
        },
      },
      attr: {
        type: GraphQLString,
        description: 'The attribute with the given name of the node',
        args: {
          selector: { type: GraphQLString },
          name: { type: new GraphQLNonNull(GraphQLString) },
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
        args: {
          selector: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(element, { selector }) {
          return !!element.querySelector(selector)
        },
      },
      query: {
        type: ElementType,
        args: {
          selector: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(element, { selector }) {
          return element.querySelector(selector)
        },
      },
      queryAll: {
        type: new GraphQLList(ElementType),
        args: {
          selector: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve(element, { selector }) {
          return Array.from(element.querySelectorAll(selector))
        },
      },
      children: {
        type: new GraphQLList(ElementType),
        resolve(element) {
          return Array.from(element.children)
        },
      },
      parent: {
        type: ElementType,
        resolve(element) {
          return element.parentElement
        },
      },
      siblings: {
        type: new GraphQLList(ElementType),
        resolve(element) {
          const parent = element.parentElement
          if (parent == null) return [element]
          return Array.from(parent.children)
        },
      },
      next: {
        type: ElementType,
        resolve(element) {
          return element.nextSibling
        },
      },
      nextAll: {
        type: new GraphQLList(ElementType),
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
        resolve(element) {
          return element.previousSibling
        },
      },
      previousAll: {
        type: new GraphQLList(ElementType),
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
    fields: sharedFields,
  })

  const DocumentType = new GraphQLObjectType(<GraphQLObjectTypeConfig<
    Element,
    any
  >>{
    name: 'Document',
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
            url: { type: GraphQLString },
            source: { type: GraphQLString },
          },
          async resolve(_, { url, source }) {
            if (url == null && source == null) {
              throw new Error(
                'You need to provide either a URL or a HTML source string.'
              )
            }
            const dom =
              url != null ? await JSDOM.fromURL(url) : new JSDOM(source)
            return dom.window.document.documentElement
          },
        },
      }),
    }),
  })

  return schema
}

// Make this importable with ES6
makeSchema['default'] = makeSchema
export = makeSchema
