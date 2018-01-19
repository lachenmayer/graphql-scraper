"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const scalars_1 = require("graphql/type/scalars");
const graphql_1 = require("graphql");
const schema_1 = require("graphql/type/schema");
const jsdom_1 = require("jsdom");
function sharedFields() {
    return {
        content: {
            type: scalars_1.GraphQLString,
            description: 'The HTML content of the subnodes',
            args: {
                selector: { type: scalars_1.GraphQLString },
            },
            resolve({ self }, { selector }) {
                const element = selector ? self.querySelector(selector) : self;
                return element && element.innerHTML;
            },
        },
        html: {
            type: scalars_1.GraphQLString,
            description: 'The HTML content of the selected DOM node',
            args: {
                selector: { type: scalars_1.GraphQLString },
            },
            resolve({ self }, { selector }) {
                const element = selector ? self.querySelector(selector) : self;
                return element && element.outerHTML;
            },
        },
        text: {
            type: scalars_1.GraphQLString,
            description: 'The text content of the selected DOM node',
            args: {
                selector: { type: scalars_1.GraphQLString },
            },
            resolve({ self }, { selector }) {
                const element = selector ? self.querySelector(selector) : self;
                return element && element.textContent;
            },
        },
        tag: {
            type: scalars_1.GraphQLString,
            description: 'The tag name of the selected DOM node',
            args: {
                selector: { type: scalars_1.GraphQLString },
            },
            resolve({ self }, { selector }) {
                const element = selector ? self.querySelector(selector) : self;
                return element && element.tagName;
            },
        },
        attr: {
            type: scalars_1.GraphQLString,
            description: 'The attribute with the given name of the node',
            args: {
                selector: { type: scalars_1.GraphQLString },
                name: { type: new graphql_1.GraphQLNonNull(scalars_1.GraphQLString) },
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
            type: scalars_1.GraphQLBoolean,
            args: {
                selector: { type: new graphql_1.GraphQLNonNull(scalars_1.GraphQLString) },
            },
            resolve({ self }, { selector }) {
                return !!self.querySelector(selector);
            },
        },
        query: {
            type: ElementType,
            args: {
                selector: { type: new graphql_1.GraphQLNonNull(scalars_1.GraphQLString) },
            },
            resolve({ self }, { selector }) {
                const newSelf = self.querySelector(selector);
                return newSelf ? { self: newSelf } : null;
            },
        },
        queryAll: {
            type: new graphql_1.GraphQLList(ElementType),
            args: {
                selector: { type: new graphql_1.GraphQLNonNull(scalars_1.GraphQLString) },
            },
            resolve({ self }, { selector }) {
                return toElements(self.querySelectorAll(selector));
            },
        },
        children: {
            type: new graphql_1.GraphQLList(ElementType),
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
            type: new graphql_1.GraphQLList(ElementType),
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
            type: new graphql_1.GraphQLList(ElementType),
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
            type: new graphql_1.GraphQLList(ElementType),
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
const NodeType = new graphql_1.GraphQLInterfaceType({
    name: 'Node',
    fields: sharedFields,
});
const DocumentType = new graphql_1.GraphQLObjectType({
    name: 'Document',
    interfaces: [NodeType],
    fields: () => (Object.assign({}, sharedFields(), { title: {
            type: scalars_1.GraphQLString,
            description: 'The page title',
            resolve({ window }) {
                return window.document.title;
            },
        } })),
});
const ElementType = new graphql_1.GraphQLObjectType({
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
exports.default = new schema_1.GraphQLSchema({
    query: new graphql_1.GraphQLObjectType({
        name: 'Query',
        fields: () => ({
            page: {
                type: DocumentType,
                args: {
                    url: { type: scalars_1.GraphQLString },
                    source: { type: scalars_1.GraphQLString },
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
//# sourceMappingURL=index.js.map