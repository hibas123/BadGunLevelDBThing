import Gun from "../gun/index.js";
import { bench } from "./common.mjs";

import * as Fs from "fs";

Fs.rmSync("radata", {
   recursive: true,
   force: true,
});

const Name = "default storage engine";

async function start() {
   console.log(Name);
   const gun = Gun({ axe: false, radisk: true });

   await bench(gun, Name, 100);
}

start();
