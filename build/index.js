"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jsdom_1 = require("jsdom");
function makeSchema(graphql) {
    const { GraphQLSchema, GraphQLString, GraphQLBoolean, GraphQLObjectType, GraphQLNonNull, GraphQLInterfaceType, GraphQLList, } = graphql;
    function sharedFields() {
        return {
            content: {
                type: GraphQLString,
                description: 'The HTML content of the subnodes',
                args: {
                    selector: { type: GraphQLString },
                },
                resolve({ self }, { selector }) {
                    const element = selector ? self.querySelector(selector) : self;
                    return element && element.innerHTML;
                },
            },
            html: {
                type: GraphQLString,
                description: 'The HTML content of the selected DOM node',
                args: {
                    selector: { type: GraphQLString },
                },
                resolve({ self }, { selector }) {
                    const element = selector ? self.querySelector(selector) : self;
                    return element && element.outerHTML;
                },
            },
            text: {
                type: GraphQLString,
                description: 'The text content of the selected DOM node',
                args: {
                    selector: { type: GraphQLString },
                },
                resolve({ self }, { selector }) {
                    const element = selector ? self.querySelector(selector) : self;
                    return element && element.textContent;
                },
            },
            tag: {
                type: GraphQLString,
                description: 'The tag name of the selected DOM node',
                args: {
                    selector: { type: GraphQLString },
                },
                resolve({ self }, { selector }) {
                    const element = selector ? self.querySelector(selector) : self;
                    return element && element.tagName;
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
                    const element = selector ? self.querySelector(selector) : self;
                    if (element == null)
                        return null;
                    const attribute = element.attributes[name];
                    if (attribute == null)
                        return null;
                    return attribute.value;
                },
            },
            has: {
                type: GraphQLBoolean,
                args: {
                    selector: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve({ self }, { selector }) {
                    return !!self.querySelector(selector);
                },
            },
            query: {
                type: ElementType,
                args: {
                    selector: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve({ self }, { selector }) {
                    const newSelf = self.querySelector(selector);
                    return newSelf ? { self: newSelf } : null;
                },
            },
            queryAll: {
                type: new GraphQLList(ElementType),
                args: {
                    selector: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve({ self }, { selector }) {
                    return toElements(self.querySelectorAll(selector));
                },
            },
            children: {
                type: new GraphQLList(ElementType),
                resolve({ self }) {
                    return toElements(self.children);
                },
            },
            parent: {
                type: ElementType,
                resolve({ self }) {
                    return self.parentElement ? { self: self.parentElement } : null;
                },
            },
            siblings: {
                type: new GraphQLList(ElementType),
                resolve({ self }) {
                    const parent = self.parentElement;
                    if (parent == null)
                        return [{ self }];
                    return toElements(parent.children);
                },
            },
            next: {
                type: ElementType,
                resolve({ self }) {
                    return self.nextSibling ? { self: self.nextSibling } : null;
                },
            },
            nextAll: {
                type: new GraphQLList(ElementType),
                resolve({ self }, { selector }) {
                    const siblings = [];
                    for (let next = self.nextSibling; next != null; next = next.nextSibling) {
                        siblings.push({ self: next });
                    }
                    return siblings;
                },
            },
            previous: {
                type: ElementType,
                resolve({ self }) {
                    return self.previousSibling ? { self: self.previousSibling } : null;
                },
            },
            previousAll: {
                type: new GraphQLList(ElementType),
                resolve({ self }, { selector }) {
                    const siblings = [];
                    for (let previous = self.previousSibling; previous != null; previous = previous.previousSibling) {
                        siblings.push({ self: previous });
                    }
                    siblings.reverse();
                    return siblings;
                },
            },
        };
    }
    function toElements(nodeListOrCollection) {
        return Array.from(nodeListOrCollection).map(self => ({
            self,
        }));
    }
    const NodeType = new GraphQLInterfaceType({
        name: 'Node',
        fields: sharedFields,
    });
    const DocumentType = new GraphQLObjectType({
        name: 'Document',
        interfaces: [NodeType],
        fields: () => (Object.assign({}, sharedFields(), { title: {
                type: GraphQLString,
                description: 'The page title',
                resolve({ window }) {
                    return window.document.title;
                },
            } })),
    });
    const ElementType = new GraphQLObjectType({
        name: 'Element',
        interfaces: [NodeType],
        fields: () => (Object.assign({}, sharedFields(), { visit: {
                type: DocumentType,
                description: 'If the element is a link, visit the page linked to in the href attribute.',
                resolve() {
                    throw new Error('TODO');
                },
            } })),
    });
    const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
            name: 'Query',
            fields: () => ({
                page: {
                    type: DocumentType,
                    args: {
                        url: { type: GraphQLString },
                        source: { type: GraphQLString },
                    },
                    resolve(_, { url, source }) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (url == null && source == null) {
                                throw new Error('You need to provide either a URL or a HTML source string.');
                            }
                            const dom = url != null ? yield jsdom_1.JSDOM.fromURL(url) : new jsdom_1.JSDOM(source);
                            return {
                                window: dom.window,
                                self: dom.window.document.documentElement,
                            };
                        });
                    },
                },
            }),
        }),
    });
    return schema;
}
// Make this importable with ES6
makeSchema.default = makeSchema;
module.exports = makeSchema;
//# sourceMappingURL=index.js.map