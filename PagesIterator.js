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
    this.collection = []; // for debug
    const res = this.callback();
    this.collection.push(res); // for debug
    this.current_response = res;
    this.safe_counter = 0;
    console.log("PagesIterator: first response count is" + res.length);
    console.log("safe limit is " + PagesIterator.SAFE_LIMIT);
  }
  /**
   * Retrieve next page if it is exist
   * This method is almost internal for @@iterator method.
   * @return {bool} retrieve success or fail
   */
  retrieve() {
    if ( !this.current_response.nextPageToken ) {
      console.log("retrieve end");
      return false;
    }
    console.log("retrieve start as token: " + this.current_response.nextPageToken);
    const res = this.callback(this.current_response.nextPageToken);
    this.collection.push(res); // for debug
    this.current_response = res;
    console.log("retrieved response have items.length: " + res.items.length );
    return res.items.length > 0 ? true : false;
  }
  /**
   * Iterator for this class and instance
   * This class'es instance can puts iterable context, e.g. for ( const item of THIS ) { ... }
   */
  * [Symbol.iterator]() {
    console.log("iterator start");
    while(true) {
      this.safe_counter++;
      console.log("loop top: " + this.safe_counter);
      for ( const obj of this.current_response.items ) {
        yield obj;
      }
      if ( !this.retrieve() ) break;
      console.log("new retrieve items are exist");
      if ( this.safe_counter > PagesIterator.SAFE_LIMIT ) {
        console.log("safe counter over: break");
        break;
      }
    }
    console.log("iterator end");
  }
}
PagesIterator.SAFE_LIMIT = 10;
