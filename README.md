# gax-xtutils

gas-xtutils is **GAS (Google Apps Script) xtetsuji's utility** .

It has some useful classes powered by ES2015 syntax.
You can use it on V8 runtime.

## libraries

### PagesIterator

Advanced Google Services API (e.g. Tasks API) has paging system as following description.

- call `XXX.list()` and get first page object `first`, first page contents include `first.items` array.
- if `first.nextPageToken` property is exist, then call `XXX.list({pageToken: first.nextPageToken})`  and get second page object `second`, second page contents include `second.items` array.
- if `second.nextPageToken` property ...(ditto)...

In this situation, you can write easy iteration by PagesIterator.

```js
const pages = new PagesIterator(
    token => token ? XXX.list() : XXX.list({pageToken: token})
);
for ( const item of pages ) {
    console.log(`- ${item.title}`);
}
```

PagesIterator constructor has [the iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
You can use PagesIterator on following contexts.

- `Array.from(iterable)`
- `...iterable`
- `[a, b, c] = iterable`
