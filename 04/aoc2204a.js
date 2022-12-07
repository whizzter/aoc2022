const fs = require("fs");

let lines = fs
  .readFileSync("aoc2204a.txt", "utf8")
  .split("\n")
  .map((l) => l.trim());

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

let r1 = lines
  .map((l) => {
    let rangeNumbers = [.../(\d+)-(\d+),(\d+)-(\d+)/.exec(l)]
      .slice(1)
      .map((t) => parseInt(t));

    let r1 = rangeNumbers.slice(0, 2);
    let r2 = rangeNumbers.slice(2);

    let succ = containsRange(r1, r2) || containsRange(r2, r1) ? 1 : 0;

    return succ;
    //return [succ, r1, r2];
  })
  .reduce(arraySum);

console.log(r1);

let nInRange = (num, major) => major[0] <= num && num <= major[1];

let r2 = lines
  .map((l) => {
    let rangeNumbers = [.../(\d+)-(\d+),(\d+)-(\d+)/.exec(l)]
      .slice(1)
      .map((t) => parseInt(t));

    let r1 = rangeNumbers.slice(0, 2);
    let r2 = rangeNumbers.slice(2);

    let succ =
      nInRange(r1[0], r2) ||
      nInRange(r1[1], r2) ||
      nInRange(r2[0], r1) ||
      nInRange(r2[1], r1)
        ? 1
        : 0;

    return succ;
    //return [succ, r1, r2];
  })
  .reduce(arraySum);

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
