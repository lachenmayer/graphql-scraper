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
const ava_1 = require("ava");
const graphql_1 = require("graphql");
const http_1 = require("http");
const _1 = require("../");
ava_1.default('no args throws errors', (t) => __awaiter(this, void 0, void 0, function* () {
    const query = `{ page { title } }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.is(response && response.errors && response.errors[0].message, 'You need to provide either a URL or a HTML source string.');
}));
ava_1.default('title', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body></body></html>`;
    const query = `{ page(source: "${html}") { title } }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.title, 'some title');
}));
ava_1.default.cb('from url', t => {
    http_1.createServer((req, res) => {
        res.end(`<html><head><title>some title</title></head><body></body></html>`);
    }).listen(13337, () => __awaiter(this, void 0, void 0, function* () {
        const query = `{ page(url: "http://localhost:13337/") { title } }`;
        const response = yield graphql_1.graphql(_1.default, query);
        t.false('errors' in response);
        t.is(response.data && response.data.page.title, 'some title');
        t.end();
    }));
});
ava_1.default('content', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body>some body</body></html>`;
    const query = `{ page(source: "${html}") { content } }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.content, '<head><title>some title</title></head><body>some body</body>');
}));
ava_1.default('content with selector', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      content(selector: ".selectme")
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.content, '<strong>bad</strong>');
}));
ava_1.default('not existing selector', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      content(selector: ".selectmenot")
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.content, null);
}));
ava_1.default('html', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body>some body</body></html>`;
    const query = `{ page(source: "${html}") { html } }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.html, html);
}));
ava_1.default('html with selector', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      html(selector: ".selectme")
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.html, '<div class="selectme"><strong>bad</strong></div>');
}));
ava_1.default('text', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      text
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.text, 'some titlebad');
}));
ava_1.default('text with selector', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      text(selector: ".selectme")
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.text, 'bad');
}));
ava_1.default('tag', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      tag
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.tag, 'HTML');
}));
ava_1.default('tag with selector', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      tag(selector: ".selectme")
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.tag, 'DIV');
}));
ava_1.default('attr', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html style=\\"background: red;\\"><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      attr(name: "style")
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.attr, 'background: red;');
}));
ava_1.default('wacky attr', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html style=\\"background: red;\\"><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      attr(name: "asdf")
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.attr, null);
}));
ava_1.default('attr with selector', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      attr(selector: ".selectme", name: "class")
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.attr, 'selectme');
}));
ava_1.default('query', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      query(selector: "div") {
        text
      }
    }
  }`;
    const response = yield graphql_1.graphql(_1.default, query);
    t.false('errors' in response);
    t.deepEqual(response.data && response.data.page.query, [
        { text: 'one' },
        { text: 'two' },
    ]);
}));
//# sourceMappingURL=index.js.map