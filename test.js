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

	toPromise(pull.values([]), false)
		.then(function( v ){
			t.equal(v, undefined);
		});
});

test('Any number of values', function( t ){
	t.plan(3);

	toPromise(pull.values([]), true)
		.then(function( v ){
			t.deepEqual(v, []);
		});

	toPromise(pull.values([ 1 ]), true)
		.then(function( v ){
			t.deepEqual(v, [ 1 ]);
		});

	toPromise(pull.values([ 1, 2 ]), true)
		.then(function( v ){
			t.deepEqual(v, [ 1, 2 ]);
		});
});

test('Specific number of values', function( t ){
	t.plan(3);

	toPromise(pull.values([]), 0)
		.then(function( v ){
			t.deepEqual(v, []);
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
	t.plan(8);

	toPromise(pull.values([ 1 ]), false)
		.catch(function( err ){
			t.equal(err.toString(), 'Error: pull-to-promise received 1 values expecting 0');
		});

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

test('One or no values (binary mode)', function( t ){
	t.plan(3);

	var binary = toPromise.binary;

	binary(pull.values([ 1 ]))
		.then(function( v ){
			t.equal(v, 1);
		});

	binary(pull.values([]))
		.then(function( v ){
			t.equal(v, undefined);
		});

	binary(pull.values([ 1, 2 ]))
		.catch(function( err ){
			t.equal(err.toString(), 'Error: pull-to-promise received 2 values expecting one or zero');
		});
});

test('Shortcuts', function( t ){
	t.plan(3);

	pull(
		pull.values([ 1 ]),
		toPromise
	).then(function( v ){
		t.equal(v, 1);
	});

	pull(
		pull.values([ 1, 2, 3 ]),
		toPromise.any
	).then(function( v ){
		t.deepEqual(v, [ 1, 2, 3 ]);
	});

	pull(
		pull.values([]),
		toPromise.none
	).then(function( v ){
		t.equal(v, undefined);
	});
});

test('Pull-stream conformance', function( t ){
	t.plan(4);

	var a = false;
	toPromise(function(end, cb){
		if (a)
			return cb(true);
		a = true;
		return cb(undefined, 'a');
	})
		.then(function( v ){
			t.equal(v, 'a');
		});

	var b = false;
	toPromise(function(end, cb){
		if (b)
			return cb(true);
		b = true;
		return cb(null, 'b');
	})
		.then(function( v ){
			t.equal(v, 'b');
		});

	var c = false;
	toPromise(function(end, cb){
		if (c)
			return cb(true);
		c = true;
		return cb(null, 'c');
	})
		.then(function( v ){
			t.equal(v, 'c');
		});

	var error = new Error('Test');

	pull(
		pull.error(error),
		toPromise
	).catch(function( e ){
		t.equal(e, error);
	});
});
