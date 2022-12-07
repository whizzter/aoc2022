const fs = require("fs");

let lines = fs
  .readFileSync("aoc2203a.txt", "utf8")
  .split("\n")
  .map((l) => l.trim());

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

let lr1 = lines
  .map((l) => {
    let lef = l.substring(0, l.length / 2);
    let rig = l.substring(lef.length);

    let rchars = rig.split(/(?:)/);

    let colch = lef.split(/(?:)/).find((cc) => -1 !== rchars.indexOf(cc));

    return cval(colch);
  })
  .reduce(arraySum);

console.log(lr1);

let lr2 = lines
  .reduce(groupsOfNum(3), [[]])
  .map((grp) => {
    let gchrs = grp.map((e) => e.split(/(?:)/));

    let common = gchrs[0].find((e0c) =>
      gchrs[1].find((e1c) => e1c === e0c)
        ? gchrs[2].find((e2c) => e2c === e0c)
        : false
    );

    return cval(common);
  })
  .reduce(arraySum);

console.log(lr2);

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
