import test from 'ava'
import { createServer } from 'http'
const execa = require('execa')

test('it runs a query from stdin', async t => {
  const server = createServer((req, res) =>
    res.end(`
<html>
<head>
<title>some test site</title>
</head>
<body>
<main>looking good</main>
</body>
</html>
`)
  )
  server.listen(13338)

  const query = `
{
  page(url: "http://localhost:13338") {
    title: text(selector: "title")
    main: text(selector: "main")
  }
}
  `

  const output = await execa.stdout('./bin.js', ['--json'], { input: query })
  t.snapshot(output)

  server.close()
})

test('it runs a query from a file', async t => {
  const output = await execa.stdout('./bin.js', [
    'examples/source.graphql',
    '--json',
  ])
  t.snapshot(output)
})

test('it formats output nicely', async t => {
  const output = await execa.stdout('./bin.js', ['examples/source.graphql'])
  t.snapshot(output)
})

test('it formats errors nicely', async t => {
  const output = await execa.stdout('./bin.js', { input: 'garbage' })
  t.snapshot(output)
})
