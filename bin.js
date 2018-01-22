#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2))

const colors = require('chalk')
const fs = require('fs')
const getStdin = require('get-stdin')
const { graphql } = require('graphql')
const util = require('util')

const schema = require('./build')
const package = require('./package.json')
const usage = `graphql-scraper v${package.version}

Usage: graphql-scraper [query-file] [--json] [--<variable-name>=value]

Reads a GraphQL query from query-file, and prints the result.

If query-file is not given, reads a query from stdin.

Options:
\t--json\tSerialize the result as parseable JSON.

Example:
> graphql-scraper query.graphql --json --url="https://news.ycombinator.com/" --page=2
`

const formatters = {
  json: function(result) {
    console.log(JSON.stringify(result))
  },
  pretty: function(result) {
    if (result.data) {
      console.log(colors.green('Data:'))
      printObject(result.data)
    }
    if (Array.isArray(result.errors)) {
      console.log(colors.red('Errors:'))
      result.errors.forEach(error => {
        printObject(error)
      })
      console.log(colors.red('Your query has errors, see above.'))
    }
    function printObject(obj) {
      console.log(util.inspect(obj, { depth: null, colors: true }))
    }
  },
}

async function main() {
  if (argv.help) {
    console.log(usage)
    return
  }

  const formatter = argv.json ? 'json' : 'pretty'
  delete argv.json

  let query
  if (argv._.length === 0) {
    query = await getStdin()
  } else if (argv._.length === 1) {
    query = fs.readFileSync(argv._[0], { encoding: 'utf8' })
  } else {
    console.log(usage)
    process.exit(1)
  }
  delete argv._

  const result = await graphql(schema, query, {}, {}, argv)
  formatters[formatter](result)
}
main()
