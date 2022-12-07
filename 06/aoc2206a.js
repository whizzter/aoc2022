const fs = require("fs");

const packetStr = fs.readFileSync("aoc2206a.txt", "utf8");

const r1 = [...packetStr].reduce(
  (a, c, ci) => {
    let l4 = [...a.a, c];
    while (l4.length > 4) l4.shift();

    //console.log(c);

    if (a.fi !== undefined) return a;

    if (l4.length == 4) {
      for (let i = 0; i < 4; i++) {
        if (l4.slice(i + 1).indexOf(l4[i]) !== -1) break;
        if (i === 3) return { a: l4, fi: ci + 1 }; // 1 indexing
      }
      //console.log(t);
    }

    return { a: l4, fi: undefined };
  },
  { a: [], fi: undefined }
);

console.log(r1);

const pl = 14;

const r2n =
  pl +
  [...packetStr]
    .map((_, i, ar) => ({ i, ns: ar.slice(i, i + pl) }))
    .filter((pp) => new Set(pp.ns).size === pl)[0].i;

const r2 = [...packetStr].reduce(
  (a, c, ci) => {
    let l4 = [...a.a, c];
    while (l4.length > pl) l4.shift();

    //console.log(c);

    if (a.fi !== undefined) return a;

    if (l4.length == pl) {
      for (let i = 0; i < pl; i++) {
        if (l4.slice(i + 1).indexOf(l4[i]) !== -1) break;
        if (i === pl - 1) return { a: l4, fi: ci + 1 }; // 1 indexing
      }
      //console.log(t);
    }

    return { a: l4, fi: undefined };
  },
  { a: [], fi: undefined }
);

console.log(r2, r2n);
