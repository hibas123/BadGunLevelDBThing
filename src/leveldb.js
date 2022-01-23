var Gun = require("gun");

function serializeJSON(data) {
	return Buffer.from(JSON.stringify(data));
}
function deserializeJSON(data) {
	return data ? JSON.parse(Buffer.from(data).toString("utf-8")) : data;
}

Gun.on("create", function (root) {
	this.to.next(root);
	var opt = root.opt;

	if (!opt.levelDB) {
		return;
	}

	var LevelDown = require("leveldown");
	var LevelUp = require("levelup");
	var fs = require("fs");
	var v8 = require("v8");

	var db;
	if (typeof opt.levelDB == "string" || typeof opt.levelDB == "boolean") {
		db = LevelUp(LevelDown("level"));
	} else if (typeof opt.levelDB == "object") {
		db = db;
		//TODO: Maybe some verification?
	} else {
		//TODO: Error
		console.warn("ERROR:", "Invalid levelDB argument passed to gun!");
		return;
	}

	var ser = opt.levelDBJSON ? serializeJSON : v8.serialize;
	var deser = opt.levelDBJSON ? deserializeJSON : v8.deserialize;

	fs.mkdirSync("level", { recursive: true });

	root.on("get", (msg) => {
		this.to.next(msg);

		var lex = msg.get;
		if (!lex) return;

		var soul = lex ? lex["#"] : null;
		if (!soul) return;

		db.get(soul, { asBuffer: true }, (err, value) => {
			if (err && err.type !== "NotFoundError") {
				return Gun.log(err, err.stack);
			}
			if (value) value = deser(value);

			var key = lex ? lex["."] : null;
			if (value && key && !Object.plain(key)) {
				value = Gun.state.ify(
					{},
					key,
					Gun.state.is(value, key),
					value[key],
					soul
				);
			}

			Gun.on.get.ack(msg, value);
		});
	});

	root.on("put", (msg) => {
		// TODO: It might be possible to increase write speed by using batched writes,
		// but the performance is really good, so I don't know if it makes a noticable difference.
		// This will also increase compexity and maybe memory usage.
		this.to.next(msg);

		var put = msg.put;
		var soul = put["#"];
		var key = put["."];

		db.get(soul, { asBuffer: true }, (err, value) => {
			if (err && err.type !== "NotFoundError") {
				if (!msg["@"]) {
					root.on("in", { "@": msg["#"], ok: 0, err });
				}
				return;
			}

			if (value) value = deser(value);

			db.put(
				soul,
				ser(Gun.state.ify(value, key, put[">"], put[":"], soul)),
				(err) => {
					if (!msg["@"]) {
						root.on("in", { "@": msg["#"], ok: err ? 0 : 1, err });
					}
				}
			);
		});
	});
});
