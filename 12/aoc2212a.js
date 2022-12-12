const fs = require("fs");

let lines = fs
  .readFileSync("aoc2212a.txt", "utf8")
  .split("\n")
  .map((l) => l.trimEnd());

let start, end;
let map = lines.map((l, y) =>
  [...l].map((c, x) =>
    c === "S"
      ? ((start = [x, y]), 0)
      : c === "E"
      ? ((end = [x, y]), 26)
      : c.charCodeAt(0) - "a".charCodeAt(0)
  )
);

let sim = (start, sstep) => {
  let sc = map.map((l) => l.map((e) => -1));
  // mark start-pos
  sc[start[1]][start[0]] = 0;

  while (sc[end[1]][end[0]] === -1) {
    // clone step-count
    let nsc = sc.map((l) => l.slice(0));
    for (let x = 0; x < sc[0].length; x++) {
      for (let y = 0; y < sc.length; y++) {
        if (sc[y][x] === -1) {
          for (let i = 0; i < 4; i++) {
            let sgn = i & 2 ? -1 : 1;
            let dir = i & 1;
            let sx = x + dir * sgn;
            let sy = y + (dir ^ 1) * sgn;
            if (sx < 0 || sy < 0 || sx >= sc[0].length || sy >= sc.length)
              continue;
            if (sc[sy][sx] === -1) continue;
            let ce = map[y][x];
            let pe = map[sy][sx];
            if (ce - pe < 2) {
              nsc[y][x] = sc[sy][sx] + 1;
              break;
            }
          }
        }
      }
    }
    sc = nsc;
    //  console.log("--------------------------------\n", sc);
    //break;
    sstep--;
    if (sstep < 0) return 10000;
  }
  return sc[end[1]][end[0]];
};

let r1 = sim(start, 100000000);

//console.log(start, end, map, sc);
console.log(r1);

let r2 = r1;

for (let i = 0; i < map[0].length; i++) {
  for (let j = 0; j < map.length; j++) {
    if (map[j][i] !== 0) continue;

    r2 = Math.min(r2, sim([i, j], r1));
    //    console.log(sim([i, j]));
  }
}

console.log(r2);
