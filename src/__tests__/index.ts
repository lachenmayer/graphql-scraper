import test from 'ava'
import * as GraphQL from 'graphql'
const { graphql } = GraphQL
import { createServer } from 'http'

import makeSchema from '../'

const schema = makeSchema(GraphQL)

test('no args throws errors', async t => {
  const query = `{ page { title } }`
  const response = await graphql(schema, query)
  t.is(
    response && response.errors && response.errors[0].message,
    'You need to provide either a URL or a HTML source string.'
  )
})

test('title', async t => {
  const html = `<html><head><title>some title</title></head><body></body></html>`
  const query = `{ page(source: "${html}") { title } }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.title, 'some title')
})

test('from url', async t => {
  const server = createServer((req, res) => {
    res.end(`<html><head><title>some title</title></head><body></body></html>`)
  })
  server.listen(13337)
  const query = `{ page(url: "http://localhost:13337/") { title } }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.title, 'some title')
  server.close()
})

test('content', async t => {
  const html = `<html><head><title>some title</title></head><body>some body</body></html>`
  const query = `{ page(source: "${html}") { content } }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(
    response.data && response.data.page.content,
    '<head><title>some title</title></head><body>some body</body>'
  )
})

test('content with selector', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      content(selector: ".selectme")
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.content, '<strong>bad</strong>')
})

test('not existing selector', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      content(selector: ".selectmenot")
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.content, null)
})

test('html', async t => {
  const html = `<html><head><title>some title</title></head><body>some body</body></html>`
  const query = `{ page(source: "${html}") { html } }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.html, html)
})

test('html with selector', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      html(selector: ".selectme")
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(
    response.data && response.data.page.html,
    '<div class="selectme"><strong>bad</strong></div>'
  )
})

test('text', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      text
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.text, 'some titlebad')
})

test('text with selector', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      text(selector: ".selectme")
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.text, 'bad')
})

test('tag', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      tag
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.tag, 'HTML')
})

test('tag with selector', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      tag(selector: ".selectme")
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.tag, 'DIV')
})

test('attr', async t => {
  const html = `<html style=\\"background: red;\\"><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      attr(name: "style")
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.attr, 'background: red;')
})

test('wacky attr', async t => {
  const html = `<html style=\\"background: red;\\"><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      attr(name: "asdf")
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.attr, null)
})

test('attr with selector', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      attr(selector: ".selectme", name: "class")
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.attr, 'selectme')
})

test('has', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      firstDiv: query(selector: "div") {
        isStrong: has(selector: "strong")
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.true(response.data && response.data.page.firstDiv.isStrong)
})

test('has not', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      firstDiv: query(selector: "div") {
        isWeak: has(selector: "weak")
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.true(response.data && !response.data.page.firstDiv.isWeak)
})

test('query', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      firstDiv: query(selector: "div") {
        text
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.deepEqual(response.data && response.data.page.firstDiv, { text: 'one' })
})

test('queryAll', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      divs: queryAll(selector: "div") {
        text
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.deepEqual(response.data && response.data.page.divs, [
    { text: 'one' },
    { text: 'two' },
  ])
})

test('children', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong><strong>two</strong></div><div class=\\"two\\"><strong>two</strong><strong>three</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      kids: queryAll(selector: "div") {
        children {
          text
        }
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.deepEqual(response.data && response.data.page.kids, [
    {
      children: [{ text: 'one' }, { text: 'two' }],
    },
    {
      children: [{ text: 'two' }, { text: 'three' }],
    },
  ])
})

test('parent', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        parent {
          attr(name: "class")
        }
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.query.parent.attr, 'selectme')
})

test('siblings', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`
  const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        siblings {
          text
        }
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.deepEqual(response.data && response.data.page.query.siblings, [
    { text: 'bad' },
    { text: 'boom' },
    { text: 'bap' },
  ])
})

test('siblings of root is only html', async t => {
  const html = `<!doctype html><html><head></head><body>nothing to see here</body></html>`
  const query = `{
    page(source: "${html}") {
      siblings {
        tag
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.deepEqual(response.data && response.data.page.siblings, [{ tag: 'HTML' }])
})

test('next', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`
  const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        next {
          text
        }
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.query.next.text, 'boom')
})

test('next - bare text', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`
  const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        next {
          tag
          text
        }
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.query.next.tag, null)
  t.is(response.data && response.data.page.query.next.text, 'bare text')
})

test('nextAll', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`
  const query = `{
    page(source: "${html}") {
      query(selector: "strong") {
        nextAll {
          tag
          text
        }
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.deepEqual(response.data && response.data.page.query.nextAll, [
    { tag: null, text: 'bare text' },
    { tag: 'SPAN', text: 'bap' },
  ])
})

test('previous', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong><p>boom</p><span>bap</span></div></body></html>`
  const query = `{
    page(source: "${html}") {
      query(selector: "span") {
        previous {
          text
        }
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(response.data && response.data.page.query.previous.text, 'boom')
})

test('previousAll', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"selectme\\"><strong>bad</strong>bare text<span>bap</span></div></body></html>`
  const query = `{
    page(source: "${html}") {
      query(selector: "span") {
        previousAll {
          tag
          text
        }
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.deepEqual(response.data && response.data.page.query.previousAll, [
    { tag: 'STRONG', text: 'bad' },
    { tag: null, text: 'bare text' },
  ])
})

test('visit', async t => {
  const server = createServer((req, res) => {
    if (req.url === '/link') {
      res.end(
        `<html><body><strong>we managed to visit the link!</strong></body></html>`
      )
    } else {
      res.end(`<html><body><a href="/link">come on in</a></body></html>`)
    }
  })
  server.listen(13339)

  const query = `{
      page(url: "http://localhost:13339/") {
        link: query(selector: "a") {
          visit {
            text(selector: "strong")
          }
        }
      }
    }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.is(
    response.data && response.data.page.link.visit.text,
    'we managed to visit the link!'
  )
  server.close()
})
