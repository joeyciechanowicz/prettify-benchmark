const benchmarks = {};

benchmarks.regexp = () => {
	const result = /o/.test('Hello World!');
};

// benchmarks.indexOf = () => {
// 	const result = 'Hello World!'.indexOf('o') > -1;
// };

benchmarks.async = (deferred) => {
	setTimeout(() => {
		deferred.resolve();
	}, 1);
};

module.exports = benchmarks;
