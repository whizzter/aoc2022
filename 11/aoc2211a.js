const fs = require("fs");

let lines = fs
  .readFileSync("aoc2211a.txt", "utf8")
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

let monkeys = lines.reduce(groupsSplitByEmpty, [[]]).map((ml) => {
  let mIdx = parseInt(/\d+/.exec(ml[1])[0]);
  let wop = /new = old (.)\s*(\S+)/.exec(ml[2]);
  let warg = /\d+/.exec(wop[2]) ? (old) => parseInt(wop[2]) : (old) => old;
  let testNum = parseInt(/\d+/.exec(ml[3])[0]);
  let testTrue = parseInt(/\d+/.exec(ml[4])[0]);
  let testFalse = parseInt(/\d+/.exec(ml[5])[0]);
  console.log(ml[2]);
  return {
    mIdx,
    icount: 0,
    items: /(\d+(?:\s*,\s*\d+)*)/
      .exec(ml[1])[0]
      .split(",")
      .map((it) => parseInt(it.trim())),
    wop: wop[1],
    warg: warg,
    wargt: wop[2],
    testNum,
    testTrue,
    testFalse,
  };
});

let msimRound = (manage) => (monkeys) => {
  monkeys = monkeys.map((m) => ({ ...m, items: m.items.slice(0) }));

  for (let i = 0; i < monkeys.length; i++) {
    const m = monkeys[i];
    while (m.items.length) {
      m.icount++;
      const it = m.items.shift();
      let wl =
        m.wop === "+"
          ? it + m.warg(it)
          : m.wop === "*"
          ? it * m.warg(it)
          : (() => {
              throw new Error();
            })();
      wl = manage(wl);

      if (0 === wl % m.testNum) {
        monkeys[m.testTrue].items.push(wl);
      } else {
        monkeys[m.testFalse].items.push(wl);
      }
    }
  }
  return monkeys;
};

let r1sim = msimRound((wl) => Math.floor(wl / 3));

let mbcalc = (sim, itCount) => {
  let nms = monkeys;
  for (let i = 0; i < itCount; i++) {
    nms = sim(nms);
  }
  console.log(nms);
  nms = nms.sort((a, b) => a.icount - b.icount).reverse();

  return nms[0].icount * nms[1].icount;
};
let r1 = mbcalc(r1sim, 20);

console.log(r1);

let group = monkeys.reduce((a, c) => a * c.testNum, 1);
let r2 = mbcalc(
  msimRound((wl) => wl % group),
  10000
);
console.log(r2);
