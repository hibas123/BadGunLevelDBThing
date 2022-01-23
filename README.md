# LevelDB Adapter for [GunDB](https://gun.eco)

## Usage

First install gun-leveldb and gun

```bash
npm install gun gun-leveldb
```

Then import the gun-leveldb package before initialising a Gun instance. This will make the LevelDB adapter available for gun.

```javascript
var Gun = require("gun");
require("gun-leveldb");

const gun = Gun({
  // Options explained later
});
```

To initialise the Database there are several options.

1. Use mainly defaults: `{ levelDB: true }`
2. Specify a folder for the LevelDB: `{ levelDB: "./database-folder" }`
3. Give it a custom levelup instance `{ levelDB: yourLevelUpinstance }`

The adapter used the v8 serialisation and deserialisation since it is rather fast and can directly work with arraybuffers.

If there is no data already written to the database, this can be changed by setting: `{ levelDBJSON: true }` wich will force JSON encoding.
