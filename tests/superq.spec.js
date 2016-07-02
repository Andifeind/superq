'use strict';

let inspect = require('inspect.js');
let SuperQ = require('../superq');

describe('SuperQ', function() {
  let queue;

  describe('instance', function() {
    it('Should create a queue instance', function() {
      queue = new SuperQ();

      inspect(queue).isObject();
      inspect(queue.items).isArray();
      inspect(queue.items).hasLength(0);
    });
  });

  describe('push()', function() {
    it('Should add items to the queue', function() {
      queue.push('one');
      queue.push('two');
      queue.push('three');
      queue.push('four');

      inspect(queue.items).hasLength(4);
      inspect(queue.items).isEql(['one', 'two', 'three', 'four']);
    });
  });

  describe('unshift()', function() {
    it('Should add an item at the begin of the queue', function() {
      queue.unshift('zero');

      inspect(queue.items).hasLength(5);
      inspect(queue.items).isEql(['zero', 'one', 'two', 'three', 'four']);
    });
  });

  describe('shift()', function() {
    it('Should remove the first item of the queue', function() {
      let first = queue.shift();

      inspect(queue.items).hasLength(4);
      inspect(queue.items).isEql(['one', 'two', 'three', 'four']);
      inspect(first).isEql('zero');
    });
  });

  describe('pop()', function() {
    it('Should remove the first item of the queue', function() {
      let last = queue.pop();

      inspect(queue.items).hasLength(3);
      inspect(queue.items).isEql(['one', 'two', 'three']);
      inspect(last).isEql('four');
    });
  });

  describe('clear()', function() {
    it('Should clear the queue', function() {
      let items = queue.clear();

      inspect(queue.items).hasLength(0);
      inspect(items).isEql(['one', 'two', 'three']);
    });
  });

  describe('run()', function() {
    it('Should run through a queue, using next()', function() {
      queue.items = ['one', 'two', 'three'];
      let out = [];

      inspect(queue.items).hasLength(3);

      let promise = queue.run((item, next) => {
        out.push(item);
        next();
      });

      inspect(promise).isPromise();

      return promise.then(() => {
        inspect(out).isEql(['one', 'two', 'three']);
      });
    });

    it('Should run through a queue, using promises', function() {
      queue.items = ['one', 'two', 'three'];
      let out = [];

      inspect(queue.items).hasLength(3);

      let promise = queue.run(item => {
        out.push(item);
        return Promise.resolve();
      });

      inspect(promise).isPromise();

      return promise.then(() => {
        inspect(out).isEql(['one', 'two', 'three']);
      });
    });

    it('Should cancle the queue if one callback throws an error', function() {
      queue.items = ['one', 'two', 'three'];
      let out = [];

      inspect(queue.items).hasLength(3);

      let promise = queue.run((item, next) => {
        if (item === 'three') {
          throw new Error('Stop queue');
        }

        out.push(item);
        next();
      });

      inspect(promise).isPromise();

      return promise.then(() => {
        inspect.fail('Should not call this');
      }).catch(err => {
        return err;
      }).then(res => {
        inspect(res).isInstanceOf(Error);
        inspect(out).isEql(['one', 'two']);
      });
    });

    it('Should cancle the queue if one function promise rejects', function() {
      queue.items = ['one', 'two', 'three'];
      let out = [];

      inspect(queue.items).hasLength(3);

      let promise = queue.run(item => {
        if (item === 'three') {
          return Promise.reject(new Error('Stop queue'));
        }

        out.push(item);
        return Promise.resolve();
      });

      inspect(promise).isPromise();

      return promise.then(() => {
        inspect.fail('Should not call this');
      }).catch(err => {
        return err;
      }).then(res => {
        inspect(res).isInstanceOf(Error);
        inspect(out).isEql(['one', 'two']);
      });
    });
  });
});
