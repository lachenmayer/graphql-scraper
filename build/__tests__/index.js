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
const GraphQL = require("graphql");
const { graphql } = GraphQL;
const http_1 = require("http");
const _1 = require("../");
const schema = _1.default(GraphQL);
ava_1.default('es6 import works', t => {
    t.is(_1.default, _1.default['default']);
});
ava_1.default('no args throws errors', (t) => __awaiter(this, void 0, void 0, function* () {
    const query = `{ page { title } }`;
    const response = yield graphql(schema, query);
    t.is(response && response.errors && response.errors[0].message, 'You need to provide either a URL or a HTML source string.');
}));
ava_1.default('title', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body></body></html>`;
    const query = `{ page(source: "${html}") { title } }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.title, 'some title');
}));
ava_1.default('from url', (t) => __awaiter(this, void 0, void 0, function* () {
    const server = http_1.createServer((req, res) => {
        res.end(`<html><head><title>some title</title></head><body></body></html>`);
    });
    server.listen(13337);
    const query = `{ page(url: "http://localhost:13337/") { title } }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.title, 'some title');
    server.close();
}));
ava_1.default('content', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body>some body</body></html>`;
    const query = `{ page(source: "${html}") { content } }`;
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.content, null);
}));
ava_1.default('html', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body>some body</body></html>`;
    const query = `{ page(source: "${html}") { html } }`;
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
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
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.attr, 'selectme');
}));
ava_1.default('has', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      firstDiv: query(selector: "div") {
        isStrong: has(selector: "strong")
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.true(response.data && response.data.page.firstDiv.isStrong);
}));
ava_1.default('has not', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      firstDiv: query(selector: "div") {
        isWeak: has(selector: "weak")
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.true(response.data && !response.data.page.firstDiv.isWeak);
}));
ava_1.default('query', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      firstDiv: query(selector: "div") {
        text
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.deepEqual(response.data && response.data.page.firstDiv, { text: 'one' });
}));
ava_1.default('queryAll', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      divs: queryAll(selector: "div") {
        text
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.deepEqual(response.data && response.data.page.divs, [
        { text: 'one' },
        { text: 'two' },
    ]);
}));
ava_1.default('children', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong><strong>two</strong></div><div class=\\"two\\"><strong>two</strong><strong>three</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      kids: queryAll(selector: "div") {
        children {
          text
        }
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.deepEqual(response.data && response.data.page.kids, [
        {
            children: [{ text: 'one' }, { text: 'two' }],
        },
        {
            children: [{ text: 'two' }, { text: 'three' }],
        },
    ]);
}));
ava_1.default('parent', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        parent {
          attr(name: "class")
        }
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.query.parent.attr, 'selectme');
}));
ava_1.default('siblings', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        siblings {
          text
        }
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.deepEqual(response.data && response.data.page.query.siblings, [
        { text: 'bad' },
        { text: 'boom' },
        { text: 'bap' },
    ]);
}));
ava_1.default('siblings of root is only html', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<!doctype html><html><head></head><body>nothing to see here</body></html>`;
    const query = `{
    page(source: "${html}") {
      siblings {
        tag
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.deepEqual(response.data && response.data.page.siblings, [{ tag: 'HTML' }]);
}));
ava_1.default('next', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        next {
          text
        }
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.query.next.text, 'boom');
}));
ava_1.default('next - bare text', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        next {
          tag
          text
        }
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.query.next.tag, null);
    t.is(response.data && response.data.page.query.next.text, 'bare text');
}));
ava_1.default('nextAll', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        nextAll {
          tag
          text
        }
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.deepEqual(response.data && response.data.page.query.nextAll, [
        { tag: null, text: 'bare text' },
        { tag: 'SPAN', text: 'bap' },
    ]);
}));
ava_1.default('previous', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      query(selector: "span") {
        previous {
          text
        }
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.query.previous.text, 'boom');
}));
ava_1.default('previousAll', (t) => __awaiter(this, void 0, void 0, function* () {
    const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`;
    const query = `{
    page(source: "${html}") {
      query(selector: "span") {
        previousAll {
          tag
          text
        }
      }
    }
  }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.deepEqual(response.data && response.data.page.query.previousAll, [
        { tag: 'STRONG', text: 'bad' },
        { tag: null, text: 'bare text' },
    ]);
}));
ava_1.default('visit', (t) => __awaiter(this, void 0, void 0, function* () {
    const server = http_1.createServer((req, res) => {
        if (req.url === '/link') {
            res.end(`<html><body><strong>we managed to visit the link!</strong></body></html>`);
        }
        else {
            res.end(`<html><body><a href="/link">come on in</a></body></html>`);
        }
    });
    server.listen(13339);
    const query = `{
      page(url: "http://localhost:13339/") {
        link: query(selector: "a") {
          visit {
            text(selector: "strong")
          }
        }
      }
    }`;
    const response = yield graphql(schema, query);
    t.false('errors' in response);
    t.is(response.data && response.data.page.link.visit.text, 'we managed to visit the link!');
    server.close();
}));
//# sourceMappingURL=index.js.map