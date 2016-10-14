'use strict'

var test = require('tape');
var pull = require('pull-stream');

var toPromise = require('./');

test('A single value', function( t ){
	t.plan(1);

	toPromise(pull.values([ 1 ]))
		.then(function( v ){
			t.equal(v, 1);
		});
});

test('No value', function( t ){
	t.plan(1);

	toPromise(pull.values([]), 0)
		.then(function( v ){
			t.equal(v, null);
		});
});

test('Any number of values', function( t ){
	t.plan(3);

	toPromise(pull.values([]), null)
		.then(function( v ){
			t.deepEqual(v, []);
		});

	toPromise(pull.values([ 1 ]), null)
		.then(function( v ){
			t.deepEqual(v, [ 1 ]);
		});

	toPromise(pull.values([ 1, 2 ]), null)
		.then(function( v ){
			t.deepEqual(v, [ 1, 2 ]);
		});
});

test('Specific number of values', function( t ){
	t.plan(3);

	toPromise(pull.values([]), 0)
		.then(function( v ){
			t.equal(v, null);
		});

	toPromise(pull.values([ 1 ]), 1)
		.then(function( v ){
			t.equal(v, 1);
		});

	toPromise(pull.values([ 1, 2 ]), 2)
		.then(function( v ){
			t.deepEqual(v, [ 1, 2 ]);
		});
});

test('Unexpected number of values', function( t ){
	t.plan(7);

	toPromise(pull.values([]))
		.catch(function( err ){
			t.equal(err.toString(), 'Error: pull-to-promise ended after 0 values expecting 1');
		});

	toPromise(pull.values([ 1, 2 ]))
		.catch(function( err ){
			t.equal(err.toString(), 'Error: pull-to-promise received 2 values expecting 1');
		});

	toPromise(pull.values([ 1 ]), 0)
		.catch(function( err ){
			t.equal(err.toString(), 'Error: pull-to-promise received 1 values expecting 0');
		});

	toPromise(pull.values([]), 1)
		.catch(function( err ){
			t.equal(err.toString(), 'Error: pull-to-promise ended after 0 values expecting 1');
		});

	toPromise(pull.values([ 1, 2 ]), 1)
		.catch(function( err ){
			t.equal(err.toString(), 'Error: pull-to-promise received 2 values expecting 1');
		});

	toPromise(pull.values([ 1 ]), 2)
		.catch(function( err ){
			t.equal(err.toString(), 'Error: pull-to-promise ended after 1 values expecting 2');
		});

	toPromise(pull.values([ 1, 2, 3 ]), 2)
		.catch(function( err ){
			t.equal(err.toString(), 'Error: pull-to-promise received 3 values expecting 2');
		});
});
