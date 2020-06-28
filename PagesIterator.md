# NAME

PagesIterator - Pages Iterator for Advanced API

# SYNOPSIS

```js
const tasklists = new PagesIterator(
  token => token ? Tasks.Tasklists.list({pageToken: token}) : Tasks.Tasklists.list()
);
for ( const tasklist of tasklists ) {
  console.log(`- ${tasklist.title} (${tasklist.id})`);
}
```

# DESCRIPTION

Advanced Google Services API (e.g. [Tasks API](https://developers.google.com/apps-script/advanced/tasks)) has paging system as following description.

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


# METHODS

## new PagesIterator(callback)

Constructor.

This constructor has [the iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
In other words, It is treated iterator such as Array.

For example, following syntaxes expect iterator:

- `for ( ... of iterable)`
- Spread operator, such as `[1, 2, 3, ...iterable]`
- Destructuring assignment, such as `[a, b, c] = iterable`
- `Array.from(iterable)`

1st argument `callback` is required as following behavior:

- `callback` is given page token as 1st arguemnt
    - if 1st argument is not found, `callback` has to fetch the first page `list` object.
    - if 1st argument is string which is page token, `callback` has to fetch the next page `list` object of the page token.
- `callback` returns some ruled `list` object:
    - `list` has `list.items` property as Array. it contains interested contents / elements.
    - if `list`'s next page is exist, `list` has `list.nextPageToken` property as string.

```js
const tasklist_id = "xxxxxxxxxx";
const option = {maxResults: 100};
const tasks  = new PagesIterator(
  token => Tasks.Tasks.list(tasklist_id, (token ? {...option, pageToken: token} : option))
);
for ( const task of tasks ) {
  console.log(`- ${task.title} (${task.id})`);
}
```

Enjoy!

## retrieve

Almost internal method.

It is used by `@@iterator` method.

## `@@iterator`

For the iterable protocol.

See `new PagesIterator(callback)` description in above.

# PROPERTIES

## PagesIterator.DATE_VERSION

```js
console.log(PagesIterator.DATE_VERSION); // => e.g. "2020-06-28"
```

Return date version string. This method is class method.

## PagesIterator.SAFE_LIMIT

```js
console.log(PagesIteraotor.SAFE_LIMIT); // => 20
```

In default, maximum PagesIterator retrieve times is restricted.
this max times is `SAFE_LIMIT` variable number: 20.

This restriction is for safe which avoid infinite loop.
If you get huge items, you can assing new value to `SAFE_LIMIT`

```js
PagesIterator.SAFE_LIMIT = 200;
const tasklist_id = "xxxxxxxxxxxxxxxxxxxx";
const option = {maxResults: 100};
const tasks = new PagesIterator(
  token => Tasks.Tasks.list(tasklist_id, (token ? {pageToken: token, ...option} : option))
);
for ( const task of tasks ) {
  // ....
}
```

Of course, you have to think API calling quotas
and limit of execution time (6 mintes).

# AUTHOR

OGATA Tetsuji <tetsuji.ogata@gmail.com>

https://github.com/xtetsuji/gas-xtutils

# LICENSE

MIT Licenses.
