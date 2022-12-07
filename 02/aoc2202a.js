const fs = require("fs");

let lines = fs
  .readFileSync("aoc2202a.txt", "utf8")
  .split("\n")
  .map((l) => l.trim());

let strategyA = lines.map((l) => {
  let stp = /(?<O>.)\s(?<Y>.)/.exec(l);
  let om = { A: 0, B: 1, C: 2 }[stp[1]];
  let ym = { X: 0, Y: 1, Z: 2 }[stp[2]];
  let outcome = -(((7 + om - ym) % 3) - 1); // 1 you win, -1 loss, 0 draw

  let sum = 3 * (outcome + 1) + (ym + 1);
  //console.log(sum);
  return sum;
});

console.log(strategyA.reduce((a, c) => a + c, 0));

let strategyB = lines.map((l) => {
  let stp = /(?<O>.)\s(?<Y>.)/.exec(l);
  let om = { A: 0, B: 1, C: 2 }[stp[1]];
  let outcome = { X: -1, Y: 0, Z: 1 }[stp[2]];
  let ym = 0;
  while (true) {
    let routcome = -(((7 + om - ym) % 3) - 1); // 1 you win, -1 loss, 0 draw
    if (routcome === outcome) break;
    ym++;
  }
  //let outcome = -(((7 + om - ym) % 3) - 1); // 1 you win, -1 loss, 0 draw

  let sum = 3 * (outcome + 1) + (ym + 1);
  //console.log(sum);
  return sum;
});

console.log(strategyB.reduce((a, c) => a + c, 0));

//console.log(lines);
