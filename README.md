# Pull stream to promise

Convert a pull stream into a promise.

This library returns [Bluebird](https://github.com/petkaantonov/bluebird/)
promises which are Promises/A+ compliant.

```
toPromise(<pullStream>)				-> Promise(<value>);
toPromise(<pullStream>, 0)			-> Promise(null);
toPromise(<pullStream>, 1)			-> Promise(<value>);
toPromise(<pullStream>, <expected>)	-> Promise(Array <values>);
toPromise(<pullStream>, null)		-> Promise(Array <values>);
```

`expected` being the number of values you expect, defaulting to `1`. Any other
number will result in an error. Passing `null` disables the check and allows
any number of values.

```js
var pull = require('pull-stream');
var toPromise = require('pull-to-promise');

toPromise(pull(
	pull.values([ 'first', 'second' ]),
	pull.take(1)
))
	.then(console.log);	// "first"
```

```js
var pull = require('pull-stream');
var toPromise = require('pull-to-promise');

toPromise(pull(
	pull.values([ 'first', 'second', 'third' ]),
	pull.take(2)
), null)
	.then(console.log);	// [ "first", "second" ]
```

You may inject your own Promise library if you wish:

```js
var toPromise = require('pull-to-promise');

toPromise.Promise = require('pinkie-promise');
```
