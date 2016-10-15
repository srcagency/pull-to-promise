'use strict';

pullToPromise.Promise = require('bluebird');

module.exports = pullToPromise;

function pullToPromise( ps, expected ){
	var source = ps.source || ps;
	var any = expected === null;
	var expected = typeof expected === 'number' || any ? expected : 1;
	var count = 0;
	var data = expected > 1 || any ? [] : undefined;

	return new pullToPromise.Promise(function( rslv, rjct ){
		return read();

		function read(){
			return source(null, function( end, chunk ){
				if (end !== null) {
					if (end !== true)
						return rjct(end);

					if (!any && count < expected)
						return rjct(new Error('pull-to-promise ended after '+count+' values expecting '+expected));

					return rslv(data);
				}

				count++;

				if (!any && count > expected)
					return rjct(new Error('pull-to-promise received '+count+' values expecting '+expected));

				if (any || expected > 1) {
					data.push(chunk);
				} else {
					data = chunk;
				}

				return read();
			});
		}
	});
}
