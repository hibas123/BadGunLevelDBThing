var Gun = require("gun");
require("../src/leveldb");

const fs = require("fs");

const { bench } = require("./common");

fs.rmSync("level", { recursive: true, force: true });

async function start() {
	console.log("LevelDB");
	const gun = Gun({
		axe: false,
		radisk: false,
		axe: false,
		levelDB: true,
		levelDBJSON: true,
	});

	await bench(gun, "LevelDB");
}

start();
