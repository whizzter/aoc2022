const fs = require("fs");

let lines = fs
  .readFileSync("aoc2205a.txt", "utf8")
  .split("\n")
  .map((l) => l.trimEnd());
//.map((l) => l.trim());

let arraySum = (a, c) => (a === undefined ? 0 : a) + c;
let groupsOfNum = (n) => (a, c) => {
  a = a === undefined ? [[]] : a;
  let lastItem = a[a.length - 1];
  if (lastItem.length < n) {
    a[a.length - 1] = [...lastItem, c];
    return a;
  } else {
    return [...a, [c]];
  }
};

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

let reSegment = (str, re) => {
  let r;
  let out = [];
  while ((r = re.exec(str))) {
    if (r.length > 1) {
      let m = "";
      for (let i = 1; i < r.length; i++) {
        if (r[i].length > m.length) m = r[i];
      }
      out.push(m);
    } else {
      out.push(r[0]);
    }
  }
  return out;
};

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

let cca = "a".charCodeAt(0);
let ccz = "z".charCodeAt(0);
let ccA = "A".charCodeAt(0);

let cval = (c) => {
  let cc = c.charCodeAt(0);
  if (cc >= cca && cc <= ccz) {
    return 1 + (cc - cca);
  } else {
    return 27 + (cc - ccA);
  }
};

let containsRange = (major, minor) =>
  major[0] <= minor[0] && minor[1] <= major[1];

let parts = lines.reduce(groupsSplitByEmpty, [[]]);
let crateData = transposeArray(
  parts[0].map((cdl) => reSegment(cdl + "  ", /.(.)../g))
).map((stack) =>
  stack
    .reverse()
    .filter((i) => i !== " ")
    .slice(1)
);

let reMove = /move (\d+) from (.) to (.)/;
let moves = parts[1].map((l) => {
  let cmd = reMove.exec(l);
  return cmd.slice(1).map((v) => parseInt(v));
});

for (let move of moves) {
  for (let i = 0; i < move[0]; i++) {
    //console.log(move, crateData);
    let crate = crateData[move[1] - 1].pop();
    crateData[move[2] - 1].push(crate);
  }
  //break;
}

let r1 = crateData.map((l) => l[l.length - 1]).join("");

console.log(r1);

crateData = transposeArray(
  parts[0].map((cdl) => reSegment(cdl + "  ", /.(.)../g))
).map((stack) =>
  stack
    .reverse()
    .filter((i) => i !== " ")
    .slice(1)
);

for (let move of moves) {
  let count = move[0];
  let stack = crateData[move[1] - 1];
  let crates = stack.splice(stack.length - count);
  let dstack = crateData[move[2] - 1];

  crateData[move[2] - 1] = dstack.concat(crates);
}

let r2 = crateData.map((l) => l[l.length - 1]).join("");

console.log(r2);

// let strategyA = lines.map((l) => {
//   let stp = /(?<O>.)\s(?<Y>.)/.exec(l);
//   let om = { A: 0, B: 1, C: 2 }[stp[1]];
//   let ym = { X: 0, Y: 1, Z: 2 }[stp[2]];
//   let outcome = -(((7 + om - ym) % 3) - 1); // 1 you win, -1 loss, 0 draw

//   let sum = 3 * (outcome + 1) + (ym + 1);
//   //console.log(sum);
//   return sum;
// });

// console.log(strategyA.reduce((a, c) => a + c, 0));

// let strategyB = lines.map((l) => {
//   let stp = /(?<O>.)\s(?<Y>.)/.exec(l);
//   let om = { A: 0, B: 1, C: 2 }[stp[1]];
//   let outcome = { X: -1, Y: 0, Z: 1 }[stp[2]];
//   let ym = 0;
//   while (true) {
//     let routcome = -(((7 + om - ym) % 3) - 1); // 1 you win, -1 loss, 0 draw
//     if (routcome === outcome) break;
//     ym++;
//   }
//   //let outcome = -(((7 + om - ym) % 3) - 1); // 1 you win, -1 loss, 0 draw

//   let sum = 3 * (outcome + 1) + (ym + 1);
//   //console.log(sum);
//   return sum;
// });

// console.log(strategyB.reduce((a, c) => a + c, 0));

//console.log(lines);
