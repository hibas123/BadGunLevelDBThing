const Gun = require("gun");
const { bench } = require("./common");
const fs = require("fs");

fs.rmSync("radata", {
	recursive: true,
	force: true,
});

const Name = "default storage engine";

async function start() {
	console.log(Name);
	const gun = Gun({ axe: false, radisk: true });

	await bench(gun, Name, 100); // Reduce to 100 iterations, since it tajes a lot of time with 1000
}

start();
