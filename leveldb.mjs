import Gun from "../gun/index.js";
import { bench } from "./common.mjs";

import LevelUp from "levelup";
import LevelDown from "leveldown";

import * as Fs from "fs";
import * as v8 from "v8";

Fs.rmSync("level", { recursive: true, force: true });

Gun.on("create", function level(root) {
  this.to.next(root);
  let opt = root.opt;
  let graph = root.graph;

  if (false === opt.levelDB) {
    return;
  }
  opt.prefix = opt.file || "gun/"; //TODO: Folder or so

  Fs.mkdirSync("level", { recursive: true });

  const db = LevelUp(LevelDown("level"));

  async function getSoul(soul) {
    await db
      .get(soul, { asBuffer: true })
      .then((e) => v8.deserialize(e)) // JSON.parse(e)
      .catch((err) => null);
  }

  root.on("get", async function (msg) {
    this.to.next(msg);
    let lex = msg.get;
    let soul;
    let data;
    let tmp;
    if (!lex || !(soul = lex["#"])) {
      return;
    }
    data = await getSoul(soul);
    if (data && (tmp = lex["."]) && !Object.plain(tmp)) {
      data = Gun.state.ify({}, tmp, Gun.state.is(data, tmp), data[tmp], soul);
    }
    Gun.on.get.ack(msg, data);
  });

  root.on("put", async function (msg) {
    this.to.next(msg);
    var put = msg.put,
      soul = put["#"],
      key = put["."];

    let current = await getSoul(soul);

    db.put(
      soul,
      v8.serialize(Gun.state.ify(current, key, put[">"], put[":"], soul)),
      (err) => {
        if (err) {
          //TODO: Error
        } else {
          if (!msg["@"]) {
            root.on("in", { "@": msg["#"], ok: 0 });
          }
        }
      }
    );
  });
});

async function start() {
  console.log("LevelDB");
  const gun = Gun({
    axe: false,
    radisk: false,
    axe: false,
    levelDB: true,
  });

  await bench(gun, "LevelDB");
}

start();
