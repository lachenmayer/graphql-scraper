# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Objects](#objects)
    * [Document](#document)
    * [Element](#element)
  * [Scalars](#scalars)
    * [Boolean](#boolean)
    * [String](#string)
  * [Interfaces](#interfaces)
    * [Node](#node)

</details>

## Query 
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>page</strong></td>
<td valign="top"><a href="#document">Document</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">url</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A URL to fetch the HTML source from.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">source</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A string containing HTML to be used as the source document.

</td>
</tr>
</tbody>
</table>

## Objects

### Document

A DOM document.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>content</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The HTML content of the subnodes

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>html</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The HTML content of the selected DOM node

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>text</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The text content of the selected DOM node

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tag</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The tag name of the selected DOM node

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>attr</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

An attribute of the selected node (eg. `href`, `src`, etc.).

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The name of the attribute

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>has</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Returns true if an element with the given selector exists.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>query</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

Equivalent to [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). The selectors of any nested queries will be scoped to the resulting element.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>queryAll</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

Equivalent to [Element.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll). The selectors of any nested queries will be scoped to the resulting elements.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>children</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

An element's child elements.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>parent</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

An element's parent element.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>siblings</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

All elements which are at the same level in the tree as the current element, ie. the children of the current element's parent. Includes the current element.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>next</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

The current element's next sibling. Includes text nodes. Equivalent to [Node.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nextAll</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

All of the current element's next siblings

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

The current element's previous sibling. Includes text nodes. Equivalent to [Node.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previousAll</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

All of the current element's previous siblings

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>title</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The page title

</td>
</tr>
</tbody>
</table>

### Element

A DOM element.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>content</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The HTML content of the subnodes

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>html</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The HTML content of the selected DOM node

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>text</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The text content of the selected DOM node

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tag</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The tag name of the selected DOM node

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>attr</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

An attribute of the selected node (eg. `href`, `src`, etc.).

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The name of the attribute

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>has</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Returns true if an element with the given selector exists.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>query</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

Equivalent to [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). The selectors of any nested queries will be scoped to the resulting element.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>queryAll</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

Equivalent to [Element.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll). The selectors of any nested queries will be scoped to the resulting elements.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>children</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

An element's child elements.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>parent</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

An element's parent element.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>siblings</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

All elements which are at the same level in the tree as the current element, ie. the children of the current element's parent. Includes the current element.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>next</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

The current element's next sibling. Includes text nodes. Equivalent to [Node.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nextAll</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

All of the current element's next siblings

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

The current element's previous sibling. Includes text nodes. Equivalent to [Node.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previousAll</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

All of the current element's previous siblings

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>visit</strong></td>
<td valign="top"><a href="#document">Document</a></td>
<td>

If the element is a link, visit the page linked to in the href attribute.

</td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.


## Interfaces


### Node

A DOM node (either an Element or a Document).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>content</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The HTML content of the subnodes

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>html</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The HTML content of the selected DOM node

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>text</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The text content of the selected DOM node

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>tag</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

The tag name of the selected DOM node

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>attr</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

An attribute of the selected node (eg. `href`, `src`, etc.).

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

The name of the attribute

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>has</strong></td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td>

Returns true if an element with the given selector exists.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>query</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

Equivalent to [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). The selectors of any nested queries will be scoped to the resulting element.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>queryAll</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

Equivalent to [Element.querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll). The selectors of any nested queries will be scoped to the resulting elements.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">selector</td>
<td valign="top"><a href="#string">String</a></td>
<td>

A [CSS selector](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Selectors).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>children</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

An element's child elements.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>parent</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

An element's parent element.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>siblings</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

All elements which are at the same level in the tree as the current element, ie. the children of the current element's parent. Includes the current element.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>next</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

The current element's next sibling. Includes text nodes. Equivalent to [Node.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>nextAll</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

All of the current element's next siblings

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previous</strong></td>
<td valign="top"><a href="#element">Element</a></td>
<td>

The current element's previous sibling. Includes text nodes. Equivalent to [Node.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>previousAll</strong></td>
<td valign="top">[<a href="#element">Element</a>]</td>
<td>

All of the current element's previous siblings

</td>
</tr>
</tbody>
</table>
