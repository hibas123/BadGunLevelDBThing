const v8 = require("v8");
const { cjt } = require("./common");

console.log(`Data is ${JSON.stringify(cjt).length} characters large as JSON`);
console.log(
	`Data is ${v8.serialize(cjt).byteLength} bytes large as v8 serialized`
);

const itr = 100000;

// ************
// * JSON
// ************

// Warmup
for (let i = 0; i < itr / 10; i++) {
	JSON.stringify(cjt);
}

let start = process.hrtime.bigint();
for (let i = 0; i < itr; i++) {
	JSON.stringify(cjt);
}
let diff_json = process.hrtime.bigint() - start;
console.log("JSON time:", diff_json / 1000n / 1000n + "ms");

// ************
// * V8
// ************

// Warmup
for (let i = 0; i < itr / 10; i++) {
	v8.serialize(cjt);
}
start = process.hrtime.bigint();
for (let i = 0; i < itr; i++) {
	v8.serialize(cjt);
}
let diff_v8 = process.hrtime.bigint() - start;
console.log("V8 time:", diff_v8 / 1000n / 1000n + "ms");
