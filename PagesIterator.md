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

# METHODS

## new PagesIterator(callback)

Constructor.

This constructor has [the iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
In other words, It is treated iterator such as Array.

For example, following syntaxes expect iterator.

- `for ( ... of iterable)`
- Spread operator, such as `[1, 2, 3, ...iterable]`
- Destructuring assignment, such as `[a, b, c] = iterable`
- `Array.from(iterable)`

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
console.log(PagesIterator.DATE_VERSION); // => "2020-06-28"
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
const items = new PagesIterator(
  token => Tasks.Tasks.list(tasklist_id, (token ? {pageToken: token, ...option} : option))
);
for ( const item of items ) {
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
