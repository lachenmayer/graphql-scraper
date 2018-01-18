import test from 'ava'
import { graphql } from 'graphql'
import { createServer } from 'http'

import schema from '../'

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

test.cb('from url', t => {
  createServer((req, res) => {
    res.end(`<html><head><title>some title</title></head><body></body></html>`)
  }).listen(13337, async () => {
    const query = `{ page(url: "http://localhost:13337/") { title } }`
    const response = await graphql(schema, query)
    t.false('errors' in response)
    t.is(response.data && response.data.page.title, 'some title')
    t.end()
  })
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

test('query', async t => {
  const html = `<html><head><title>some title</title></head><body><div class=\\"one\\"><strong>one</strong></div><div class=\\"two\\"><strong>two</strong></div></body></html>`
  const query = `{
    page(source: "${html}") {
      query(selector: "div") {
        text
      }
    }
  }`
  const response = await graphql(schema, query)
  t.false('errors' in response)
  t.deepEqual(response.data && response.data.page.query, [
    { text: 'one' },
    { text: 'two' },
  ])
})
