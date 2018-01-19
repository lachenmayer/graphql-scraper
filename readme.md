### differences from gdom

- `query(selector: String!)` now only returns a single `Element`, rather than a list (like `document.querySelector`). Added a new `queryAll(selector: String!): [Element]` field, which behaves like `document.querySelectorAll`.
- `is(selector: String!)` renamed to `has(selector: String!)`
- `children`, `parent`, `siblings`, `next` etc. no longer take a selector. If you need to select children with a specific selector, use [child selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Child_selectors) (`.foo > .bar`).
- `parents` removed.
- `prev[All]` renamed to `previous[All]`.