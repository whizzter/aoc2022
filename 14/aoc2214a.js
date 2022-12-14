const fs = require("fs");

let lines = fs
  .readFileSync("aoc2214a.txt", "utf8")
  .split("\n")
  .map((l) => l.trimEnd());

let transposeArray = (a) => {
  let oa = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a[i].length; j++) {
      while (oa.length < j + 1) oa.push([]);
      oa[j][i] = a[i][j];
    }
  }
  return oa;
};

const walls = lines.map((l) =>
  l.split("->").map((p) =>
    p
      .trim()
      .split(",")
      .map((c) => parseInt(c))
  )
);

// 0 empty
// 1 wall
// 2 sand

// offset-growing-map
const mkMap = (efn) => {
  let offX = 0;
  let offY = 0;
  let maxY = -10000000000;
  let map = []; // [x][y] indexed
  return {
    maxY: () => maxY,
    display: () => {
      let ty = [".", "#", "o"];
      return transposeArray(map)
        .map((l) => l.map((e) => ty[e]).join(""))
        .join("\n");
    },
    mapData: () => ({
      offX,
      offY,
      map,
    }),
    get: (x, y) => {
      let mlx = x - offX;
      let mly = y - offY;
      if (mlx < 0 || mly < 0 || mlx >= map.length || mly >= map[0].length)
        return undefined;
      return map[mlx][mly];
    },
    set: (x, y, v) => {
      maxY = Math.max(y, maxY);
      if (map.length === 0) {
        offX = x;
        offY = y;
        map.push([v]);
        return;
      }
      while (y < offY) {
        for (let xm of map) {
          xm.unshift(efn());
        }
        offY--;
      }
      while (y - offY >= map[0].length) {
        for (let xm of map) xm.push(efn());
      }
      while (x < offX) {
        map.unshift(map[0].map((v) => efn()));
        offX--;
      }
      while (x - offX >= map.length) {
        map.push(map[map.length - 1].map((v) => efn()));
      }
      //console.log(x, y, map.length, map[0].length);
      map[x - offX][y - offY] = v;
    },
  };
};

// build a map from the walls descriptions
const buildMap = () => {
  let map = mkMap((_) => 0);
  map.set(500, 0, 0);
  for (let wall of walls) {
    for (let i = 0; i + 1 < wall.length; i++) {
      let a = wall[i];
      let b = wall[i + 1];
      let s = Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
      for (let j = 0; j <= s; j++) {
        let x = a[0] + j * Math.sign(b[0] - a[0]);
        let y = a[1] + j * Math.sign(b[1] - a[1]);
        map.set(x, y, 1);
      }
    }
  }
  return map;
};

// simulate grains from the spawn-pos.
let sim = (map, maxY) => {
  let scount = 0;
  let yo = [0, -1, 1];
  top: while (true) {
    let sx = 500,
      sy = 0;
    grainLoop: while (true) {
      if (maxY !== undefined && sy >= maxY) break;
      for (let i = 0; i < 3; i++) {
        let tx = sx + yo[i];
        let ty = sy + 1;
        let info = map.get(tx, ty);
        if (info === undefined && maxY !== undefined)
          // if we have a maxY and go out of bounds we set an 0(empty) to expand the play-area
          info = 0;
        //if (scount >= 24) console.log(scount, info, tx, ty);
        if (info === 0) {
          sx = tx;
          sy = ty;
          continue grainLoop; // we can move here
        } else if (info === undefined) {
          break top; // we've gone out of bounds!
        }
      }
      break; // no passable square
    }
    map.set(sx, sy, 2);
    scount++;
    if (sx === 500 && sy === 0) break;
  }
  return scount;
};

let map1 = buildMap();
let r1 = sim(map1, undefined);

console.log(map1.display(), r1);

let map2 = buildMap();
let maxY = map2.maxY();
//console.log(maxY);
let r2 = sim(map2, maxY + 1);

console.log(map2.display(), r2);
