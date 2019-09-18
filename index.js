const {table} = require('table');
const chalk = require('chalk');
const ansiEscapes = require('ansi-escapes');
const {Benchmark} = require('benchmark');

function prettifyBenchmark(suite) {
	const results = [
		[
			'Name', 'Ops/sec', 'Average', 'Error', 'Samples'
		]
	];

	let currentBenchmark = 0;
	let currentSamples = -1;

	const cloned = suite.map(benchmark => {
		let clone;

		if (benchmark.hasOwnProperty('setup')) {
			clone = benchmark.clone({
				setup: function () {
					this.originalBenchmark.setup();
					this.printCurrentUsage(this);
				}
			});
			clone.originalBenchmark = benchmark;
		} else {
			clone = benchmark.clone({
				setup: function () {
					this.printCurrentUsage(this);
				}
			});
		}

		clone.printCurrentUsage = function (bench) {
			try {
				let average = bench.stats.mean * 1000;
				let unit = ' ms';
				if (average < 1) {
					average *= 1000;
					unit = ' micros';
				}
				if (average < 1) {
					average *= 1000;
					unit = ' ns';
				}

				const current = results[currentBenchmark + 1];
				current[1] = Benchmark.formatNumber(bench.hz.toFixed(bench.hz < 100 ? 2 : 0));
				current[2] = average.toFixed(2) + unit;
				current[3] = `±${bench.stats.rme.toFixed(2)}%`;
				current[4] = bench.stats.sample.length;

				if (currentSamples === -1 || currentSamples < bench.stats.sample.leprintCurrentUsagength) {
					const output = table(results);
					process.stdout.write(ansiEscapes.eraseLines((results.length * 2) + 2) + output);
					currentSamples++;
				}
			} catch (e) {
				console.log(e);
			}
		};

		results.push([
			clone.name, '', '', '', ''
		]);

		return clone;
	});

	// There is no .clear method and we have to maintain the suite
	while (suite.pop()) ;
	cloned.forEach(clone => suite.add(clone.name, clone.fn, clone));

	suite.on('cycle', function (event) {
		currentBenchmark++;
		currentSamples = -1;
	});

	suite.on('complete', function () {
		results[0].push(' ');

		const fastest = this.filter('fastest')[0];

		for (let i = 0; i < this.length; i++) {
			const difference = (this[i].hz / fastest.hz) * 100;
			if (difference < 100) {
				results[i + 1].push(chalk.red(difference.toFixed(2) + '%'));
			} else {
				results[i + 1].push(chalk.green(difference.toFixed(2) + '%'));
			}
		}

		const output = table(results);
		process.stdout.write(ansiEscapes.eraseLines((results.length * 2) + 2) + output);
	});

	suite.on('start', () => {
		const output = table(results);
		process.stdout.write(output);
	})
}

module.exports = prettifyBenchmark;
