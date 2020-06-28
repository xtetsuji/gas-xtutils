class PagesIterator {
  /**
   * constructor
   * 1st argument is callback. It is given only 1 argument as page token.
   * It must return object that have items property (required as Array) and nextPageToken property (optional, if next page is exist).
   * @param {function} token => token ? NEXT_PAGE_RETRIEVE_CODE : FIRST_PAGE_RETRIEVE_CODE
   * @return {PagesIterator}
   */
  constructor(callback) {
    this.callback = callback;
    //this.collection = []; // for debug
    const res = this.callback();
    //this.collection.push(res); // for debug
    this.current_response = res;
    this.safe_counter = 0;
    //console.log("PagesIterator: first response count is" + res.length);
    //console.log("safe limit is " + PagesIterator.SAFE_LIMIT);
  }
  /**
   * Retrieve next page if it is exist
   * This method is almost internal for @@iterator method.
   * @return {bool} retrieve success or fail
   */
  retrieve() {
    if ( !this.current_response.nextPageToken ) {
      //console.log("retrieve end");
      return false;
    }
    //console.log("retrieve start as token: " + this.current_response.nextPageToken);
    const res = this.callback(this.current_response.nextPageToken);
    //this.collection.push(res); // for debug
    this.current_response = res;
    //console.log("retrieved response have items.length: " + res.items.length );
    return res.items.length > 0 ? true : false;
  }
  /**
   * Iterator for this class and instance
   * This class'es instance can puts iterable context, e.g. for ( const item of THIS ) { ... }
   */
  * [Symbol.iterator]() {
    //console.log("iterator start");
    while(true) {
      this.safe_counter++;
      //console.log("loop top: " + this.safe_counter);
      for ( const obj of this.current_response.items ) {
        yield obj;
      }
      if ( !this.retrieve() ) break;
      //console.log("new retrieve items are exist");
      if ( this.safe_counter > PagesIterator.SAFE_LIMIT ) {
        console.error("safe counter over: break");
        break;
      }
    }
    //console.log("iterator end");
  }
}
PagesIterator.SAFE_LIMIT = 20;
PagesIterator.DATE_VERSION = "2020-06-28";

/* DOCUMENT:

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

# LICENSE

MIT Licenses.

*/
