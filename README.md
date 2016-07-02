superq
======

Queuing system

## Install via [npm](https://npmjs.com)

```sh
$ npm install superq
```

## Usage

```js
let SuperQ = require('superq');
let queue = new SuperQ();

// add items
queue.push('two');
queue.push('three');
queue.unshift('one');

// queue has three items ['one', 'two', three']

queue.run((item, next) => {
  console.log(item);
  next();
});

// prints
"one",
"two",
"three"
```

## Methods

### push(item)

Adds an item on the end of the queue

### unshift(item)

Adds an item on the begin of the queue


### pop()

Removes the last item and returns it

```js
let last = queue.pop();
console.log(last); // prints "three"
```


### shift()

Removes the first item and returns it

```js
let first = queue.shift();
console.log(first); // prints "one"
```


### len()

Returns the length of the queue


### clear()

Clears the queue, returns all removed items


### run(fn)

Runns through the queue and evaluates a function on each item.
Runs the next item as soon the `next()` method was called or
if the function returns a promise, it waits until the promise is resolved.


#### Using `next()`

```js
queue.run((item, next) => {
  setTimeout(() => {
    console.log(item);
    next();
  }, 100);
});
```


#### Using a promise

```js
queue.run(item => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(item);
      resolve();
    }, 100);
  });
});
```
