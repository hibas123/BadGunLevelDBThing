export const cjt = {};

for (let i = 0; i < 15; i++) {
   cjt["str" + i] = "I am some not so long string";
}

for (let i = 0; i < 5; i++) {
   cjt["str_long" + i] = "I am some actually quite long string".repeat(100);
}

// for (let i = 0; i < 15; i++) {
//    complicatedJSONThingy["array_nested_object" + i] = {
//       key1: "asdaad",
//       key2: "lajsbduj",
//       subarray: ["1", "s", 1, 5, false],
//    };
// }

let r = cjt;
for (let i = 0; i < 5; i++) {
   r["nested_level_" + i] = {
      level: i,
   };

   r = r["nested_level_" + i];
}

export async function bench(gun, name, itr = 1000) {
   let start = process.hrtime.bigint();

   for (let i = 0; i < itr; i++) {
      // console.log("put", i);
      await new Promise((yes) => {
         gun.get("root")
            .get("key-" + i)
            .put(cjt, (ack) => {
               yes();
            });
      });
   }

   for (let i = 0; i < itr; i++) {
      // console.log("get", i);
      await new Promise((yes) => {
         gun.get("root")
            .get("key-" + i)
            .on((val, key, msg, ev) => {
               // console.log(val);
               yes();
               ev.off();
            });
      });
   }

   let diff_v8 = process.hrtime.bigint() - start;
   console.log(
      name + " time per iter:",
      Number(diff_v8 / 1000n / 1000n) / itr + "ms"
   );
   process.exit();
}
