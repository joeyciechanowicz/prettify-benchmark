#!/usr/bin/env node
const path = require('path');
const Benchmark = require('benchmark');
const prettifyBenchmark = require('./index');

if (process.argv.length !== 3) {
	console.error('No file passed. Usage: prettify-benchmark some-file.js');
	process.exit(1);
}

const filename = process.argv[2];
const filePath = path.resolve(path.join(__dirname, filename));

const benchmarks = require(filePath);
console.log(benchmarks);

if (Object.keys(benchmarks).length === 0) {
	console.error(`No benchmarks exported from ${filename}`);
	process.exit(1);
}

const suite = new Benchmark.Suite();
Object.entries(benchmarks).forEach(([name, func]) => {
	if (typeof func !== 'function') {
		console.error(`Export "${name}" is not a function`);
		process.exit(1);
	}

	if (func.length > 0) {
		suite.add(name, func, {
			defer: true
		});

	}
});

prettifyBenchmark(suite);

suite.run();
