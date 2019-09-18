const Benchmark = require('benchmark');
const prettifyBenchmark = require('./index');

const suite = new Benchmark.Suite();

suite
	.add('Deffered', function(deferred) {
		setTimeout(() => {
			deferred.resolve();
		}, 1);
	}, {
		defer: true,
		setup: function() {
			console.log(this);
		}
	})
	.add('RegExp#test', function () {
		const result = /o/.test('Hello World!');
	})

	.add('String#indexOf', function () {
		const result = 'Hello World!'.indexOf('o') > -1;
	})
	// .add('String#indexOf2', function () {
	// 	const result = 'Hello World!'.indexOf('o') > -1;
	// })
	// .add('String#indexOf3', function () {
	// 	const result = 'Hello World!'.indexOf('o') > -1;
	// })
;

// prettifyBenchmark(suite);

suite.run({
	maxTime: 0.5
});
