const Gun = require("gun");
const { bench } = require("./common");

Gun.on("create", function lg(root) {
	this.to.next(root);
	let opt = root.opt;
	let graph = root.graph;
	let disk;

	if (false === opt.inMemory) {
		return;
	}
	opt.prefix = opt.file || "gun/";
	disk = lg[opt.prefix] = {};

	root.on("get", function (msg) {
		this.to.next(msg);
		let lex = msg.get;
		let soul;
		let data;
		let tmp;
		let u;
		if (!lex || !(soul = lex["#"])) {
			return;
		}
		data = disk[soul] || u;
		if (data && (tmp = lex["."]) && !Object.plain(tmp)) {
			data = Gun.state.ify(
				{},
				tmp,
				Gun.state.is(data, tmp),
				data[tmp],
				soul
			);
		}
		Gun.on.get.ack(msg, data);
	});

	root.on("put", function (msg) {
		this.to.next(msg);
		var put = msg.put,
			soul = put["#"],
			key = put["."];
		disk[soul] = Gun.state.ify(disk[soul], key, put[">"], put[":"], soul); // merge into disk object
		if (!msg["@"]) {
			root.on("in", { "@": msg["#"], ok: 0 });
		}
	});
});

async function inMemory() {
	console.log("In-Memory");
	const gun = Gun({
		axe: false,
		radisk: false,
		axe: false,
		inMemory: true,
	});

	await bench(gun, "in-memory");
}

inMemory();
