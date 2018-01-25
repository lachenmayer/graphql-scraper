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
const url_1 = require("url");
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
                resolve(element, { selector }) {
                    element = selector ? element.querySelector(selector) : element;
                    return element && element.innerHTML;
                },
            },
            html: {
                type: GraphQLString,
                description: 'The HTML content of the selected DOM node',
                args: {
                    selector: { type: GraphQLString },
                },
                resolve(element, { selector }) {
                    element = selector ? element.querySelector(selector) : element;
                    return element && element.outerHTML;
                },
            },
            text: {
                type: GraphQLString,
                description: 'The text content of the selected DOM node',
                args: {
                    selector: { type: GraphQLString },
                },
                resolve(element, { selector }) {
                    element = selector ? element.querySelector(selector) : element;
                    return element && element.textContent;
                },
            },
            tag: {
                type: GraphQLString,
                description: 'The tag name of the selected DOM node',
                args: {
                    selector: { type: GraphQLString },
                },
                resolve(element, { selector }) {
                    element = selector ? element.querySelector(selector) : element;
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
                resolve(element, { selector, name }) {
                    element = selector ? element.querySelector(selector) : element;
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
                resolve(element, { selector }) {
                    return !!element.querySelector(selector);
                },
            },
            query: {
                type: ElementType,
                args: {
                    selector: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve(element, { selector }) {
                    return element.querySelector(selector);
                },
            },
            queryAll: {
                type: new GraphQLList(ElementType),
                args: {
                    selector: { type: new GraphQLNonNull(GraphQLString) },
                },
                resolve(element, { selector }) {
                    return Array.from(element.querySelectorAll(selector));
                },
            },
            children: {
                type: new GraphQLList(ElementType),
                resolve(element) {
                    return Array.from(element.children);
                },
            },
            parent: {
                type: ElementType,
                resolve(element) {
                    return element.parentElement;
                },
            },
            siblings: {
                type: new GraphQLList(ElementType),
                resolve(element) {
                    const parent = element.parentElement;
                    if (parent == null)
                        return [element];
                    return Array.from(parent.children);
                },
            },
            next: {
                type: ElementType,
                resolve(element) {
                    return element.nextSibling;
                },
            },
            nextAll: {
                type: new GraphQLList(ElementType),
                resolve(element, { selector }) {
                    const siblings = [];
                    for (let next = element.nextSibling; next != null; next = next.nextSibling) {
                        siblings.push(next);
                    }
                    return siblings;
                },
            },
            previous: {
                type: ElementType,
                resolve(element) {
                    return element.previousSibling;
                },
            },
            previousAll: {
                type: new GraphQLList(ElementType),
                resolve(element, { selector }) {
                    const siblings = [];
                    for (let previous = element.previousSibling; previous != null; previous = previous.previousSibling) {
                        siblings.push(previous);
                    }
                    siblings.reverse();
                    return siblings;
                },
            },
        };
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
                resolve(element) {
                    return element.ownerDocument.title;
                },
            } })),
    });
    const ElementType = new GraphQLObjectType({
        name: 'Element',
        interfaces: [NodeType],
        fields: () => (Object.assign({}, sharedFields(), { visit: {
                type: DocumentType,
                description: 'If the element is a link, visit the page linked to in the href attribute.',
                resolve(element) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const href = element.attributes['href'];
                        if (href == null) {
                            return null;
                        }
                        const url = url_1.resolve(element.ownerDocument.location.href, href.value); // handle relative links.
                        const dom = yield jsdom_1.JSDOM.fromURL(url);
                        return dom.window.document.documentElement;
                    });
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
                            return dom.window.document.documentElement;
                        });
                    },
                },
            }),
        }),
    });
    return schema;
}
// Make this importable with ES6
makeSchema['default'] = makeSchema;
module.exports = makeSchema;
//# sourceMappingURL=index.js.map