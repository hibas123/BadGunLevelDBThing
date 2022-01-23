var LevelDown = require("leveldown");
var LevelUp = require("levelup");
var fs = require("fs");
var v8 = require("v8");

var db = LevelUp(LevelDown("level"));

db.createReadStream({}).on("data", ({ key, value }) =>
	console.log(`${key}=${value}`)
);
