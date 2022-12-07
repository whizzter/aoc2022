const fs = require("fs");

Array.prototype.groupBy = function (keyFn, dataFn, groupMap) {
  let origKeyFn = keyFn;
  if ("string" === typeof keyFn) keyFn = (obj) => obj[origKeyFn];
  if ("undefined" === typeof dataFn) dataFn = (id) => id;
  let groupByReducer = (coll, item) => {
    let v = keyFn(item);
    if (coll.has(v)) coll.get(v).push(dataFn(item));
    else coll.set(v, [dataFn(item)]);
    return coll;
  };
  if ("undefined" !== typeof groupMap)
    return [...this.reduce(groupByReducer, new Map())].map((item, idx) =>
      groupMap(item[0], item[1], idx)
    );
  return [...this.reduce(groupByReducer, new Map())];
};

let txt = fs.readFileSync("aoc2201a.txt", "utf8");

//console.log(fs.readFileSync("aoc2201a.txt", "utf8").split("\n").map(l=>l.trim()));

let elves = txt.split("\n").reduce(
  (a, l) => {
    l = l.trim();
    let lc = a[a.length - 1];
    if (l.length === 0 && lc[0] !== false) return [...a, [0]];
    else {
      lc[0] += parseInt(l);
      return a;
    }
  },
  [[false]]
);

console.log(
  "A:",
  elves.reduce((mv, elv) =>
    Math.max(
      mv,
      elv.reduce((a, c) => a + c, 0)
    )
  )
);

console.log(
  "B:",
  elves
    .map((elv) => elv.reduce((a, c) => a + c, 0))
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, c) => a + c, 0)
);
