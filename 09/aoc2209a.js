let input = require("fs").readFileSync("aoc2209a.txt", "utf8");
// input = `R 5
// U 8
// L 8
// D 3
// R 17
// D 10
// L 25
// U 20`;

const lines = input.split("\n").map((l) => l.trimEnd());

const cmds = lines.map((l) => /(?<dir>.) (?<count>\d+)/.exec(l).groups);

const dirs = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
};

let simStep = (a, dir) => {
  let or = a.r;
  let nr = a.r.map((x) => x);

  //let nhp = [a.h[0] + dirs[dir][0], a.h[1] + dirs[dir][1]];
  //   const dragging =
  //     Math.abs(nhp[0] - a.t[0]) > 1 || Math.abs(nhp[1] - a.t[1]) > 1;
  //   let ntp = dragging ? a.h : a.t;
  //   let tplaces = a.tplaces; //new Map(a.tplaces);
  //   tplaces.set(ntp.join(","), true);
  //   return { ...a, h: nhp, t: ntp, tplaces };

  nr[0] = [or[0][0] + dirs[dir][0], or[0][1] + dirs[dir][1]];

  for (let i = 1; i < nr.length; i++) {
    const xDiff = nr[i - 1][0] - or[i][0];
    const yDiff = nr[i - 1][1] - or[i][1];
    const dragging = Math.abs(xDiff) > 1 || Math.abs(yDiff) > 1;
    nr[i] = !dragging
      ? or[i]
      : [or[i][0] + Math.sign(xDiff), or[i][1] + Math.sign(yDiff)]; //or[i - 1] : or[i];
  }
  let last = nr[nr.length - 1];
  //   console.log(or);
  //   console.log(nr);
  //   console.log(last);
  a.tplaces.set(last.join(","), true);

  return { ...a, r: nr };
  //console.log(nhp);
};

let simRes = (len) =>
  cmds.reduce(
    (a, c) => {
      let count = parseInt(c.count);
      for (let i = 0; i < count; i++) a = simStep(a, c.dir);

      return a;
    },
    {
      r: [...new Int32Array(len)].map((x) => [0, 0]),
      tplaces: new Map(),
    }
  );

console.log(simRes(2).tplaces.size);
console.log(simRes(10).tplaces.size);
// Map(5735) A
