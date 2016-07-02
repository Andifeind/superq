'use strict';

class Queue {
  constructor() {
    this.items = [];
  }

  /**
   * Return queue length
   * @return {Number} Returns queue length
   */
  len() {
    return this.items.length
  }

  /**
   * Adds an item on the end of a queue
   *
   * @param  {Any} data Queued data
   *
   * @chainable
   * @return {Object}      Returns this value
   */
  push(data) {
    this.items.push(data);
    return this;
  }


  /**
   * Adds an item on the begin of a queue
   *
   * @param  {Any} data Queued data
   *
   * @chainable
   * @return {Object}      Returns this value
   */
  unshift(data) {
    this.items.unshift(data);
    return this;
  }

  /**
   * Removes an item on the begin of a queue
   *
   * @return {Object}      Returns this value
   */
  shift() {
    if (this.len() === 0) {
      return null;
    }

    return this.items.shift();
  }

  /**
   * Removes an item on the end of a queue
   *
   * @return {Object}      Returns this value
   */
  pop() {
    if (this.len() === 0) {
      return null;
    }

    return this.items.pop();
  }

  run(fn) {
    return new Promise((resolve, reject) => {
      let next = () => {
        let item = this.shift();
        if (!item) {
          return resolve();
        }

        let promise = fn(item, next);
        if (promise && typeof promise.then === 'function' && typeof promise.catch === 'function') {
          promise.then(next).catch(err => {
            reject(err);
          });
        }
      };

      next();
    });
  }
}

module.exports = Queue;
