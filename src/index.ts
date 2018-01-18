import { GraphQLString } from 'graphql/type/scalars'
import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInterfaceType,
  GraphQLFieldConfigMap,
  GraphQLObjectTypeConfig,
  GraphQLInterfaceTypeConfig,
  GraphQLList,
} from 'graphql'
import { GraphQLSchema } from 'graphql/type/schema'
import { JSDOM } from 'jsdom'

function sharedFields(): GraphQLFieldConfigMap<{ self: Element }, any> {
  return {
    content: {
      type: GraphQLString,
      description: 'The HTML content of the subnodes',
      args: {
        selector: { type: GraphQLString },
      },
      resolve({ self }, { selector }) {
        const element = selector ? self.querySelector(selector) : self
        return element && element.innerHTML
      },
    },
    html: {
      type: GraphQLString,
      description: 'The HTML content of the selected DOM node',
      args: {
        selector: { type: GraphQLString },
      },
      resolve({ self }, { selector }) {
        const element = selector ? self.querySelector(selector) : self
        return element && element.outerHTML
      },
    },
    text: {
      type: GraphQLString,
      description: 'The text content of the selected DOM node',
      args: {
        selector: { type: GraphQLString },
      },
      resolve({ self }, { selector }) {
        const element = selector ? self.querySelector(selector) : self
        return element && element.textContent
      },
    },
    tag: {
      type: GraphQLString,
      description: 'The tag name of the selected DOM node',
      args: {
        selector: { type: GraphQLString },
      },
      resolve({ self }, { selector }) {
        const element = selector ? self.querySelector(selector) : self
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
      resolve({ self }, { selector, name }) {
        const element = selector ? self.querySelector(selector) : self
        if (element == null) return null
        const attribute = element.attributes[name]
        if (attribute == null) return null
        return attribute.value
      },
    },
    query: {
      type: new GraphQLList(ElementType),
      args: {
        selector: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve({ self }, { selector }) {
        return Array.from(self.querySelectorAll(selector)).map(self => ({
          self,
        }))
      },
    },
  }
}

const NodeType = new GraphQLInterfaceType(<GraphQLInterfaceTypeConfig<
  { self: Element },
  any
>>{
  name: 'Node',
  fields: sharedFields,
})

const DocumentType = new GraphQLObjectType(<GraphQLObjectTypeConfig<
  { window: Window; self: Element },
  any
>>{
  name: 'Document',
  interfaces: [NodeType],
  fields: () => ({
    ...sharedFields(),
    title: {
      type: GraphQLString,
      description: 'The page title',
      resolve({ window }) {
        return window.document.title
      },
    },
  }),
})

const ElementType = new GraphQLObjectType({
  name: 'Element',
  interfaces: [NodeType],
  fields: () => ({
    ...sharedFields(),
    visit: {
      type: DocumentType,
      description:
        'If the element is a link, visit the page linked to in the href attribute.',
      resolve() {
        throw new Error('TODO')
      },
    },
  }),
})

export default new GraphQLSchema({
  query: new GraphQLObjectType({
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
          const dom = url != null ? await JSDOM.fromURL(url) : new JSDOM(source)
          return {
            window: dom.window,
            self: dom.window.document.documentElement,
          }
        },
      },
    }),
  }),
})
