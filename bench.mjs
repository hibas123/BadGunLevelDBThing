import { fork } from "child_process";

let execs = ["default.mjs", "inMemory.mjs", "serialize.mjs"];

if (process.argv.length > 2) {
  let set = new Set(process.argv.slice(2).map((e) => e.toLowerCase()));
  execs = execs.filter((e) => set.has(e.split(".")[0].toLowerCase()));
}

async function run() {
  for (let file of execs) {
    console.log("Running:", file);
    await new Promise((yes, no) => {
      fork(file).on("exit", yes).on("error", no);
    });
    console.log("-----------------------------------------");
  }
}

run();
