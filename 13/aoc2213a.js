const fs = require("fs");

let lines = fs
  .readFileSync("aoc2213a.txt", "utf8")
  .split("\n")
  .map((l) => l.trimEnd());

let groupsSplitByEmpty = (a, c) => {
  a = a === undefined ? [[]] : a;
  let lastItem = a[a.length - 1];
  if (c.trim() !== "") {
    a[a.length - 1] = [...lastItem, c];
    return a;
  } else {
    return [...a, []];
  }
};

let pairs = lines
  .reduce(groupsSplitByEmpty, [[]])
  .map((p) => p.map((l) => JSON.parse(l)));

let pcmp = (a, b) => {
  switch (typeof a + typeof b) {
    case "numbernumber":
      return a - b;
    case "objectobject": {
      let ccount = Math.min(a.length, b.length);
      for (let i = 0; i < ccount; i++) {
        let d = pcmp(a[i], b[i]);
        if (d !== 0) return d;
      }
      return a.length - b.length;
    }
    case "numberobject":
      return pcmp([a], b);
    case "objectnumber":
      return pcmp(a, [b]);
    default:
      throw new Error("Unknown types");
  }
};

//let test = pairs.map((p, i) => [pcmp(p[0], p[1]), i]);
let r1 = pairs.reduce((a, p, i) => a + (pcmp(p[0], p[1]) < 0 ? i + 1 : 0), 0);

console.log(r1);

let allpackets = lines.filter((l) => l.length).map((l) => JSON.parse(l));
let d1 = [[2]],
  d2 = [[6]];

allpackets.push(d1);
allpackets.push(d2);

allpackets.sort((a, b) => pcmp(a, b));

let r2 = allpackets.reduce(
  (a, c, i) => a * (d1 == c || d2 == c ? i + 1 : 1),
  1
);
console.log(r2);
