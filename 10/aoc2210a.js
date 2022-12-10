let input = require("fs").readFileSync("aoc2210a.txt", "utf8");

const lines = input.split("\n").map((l) => l.trimEnd());

const cmds = lines.map(
  (l) => /^(?<op>\S+) ?(?<count>[-+]?\d+)?/.exec(l).groups
);

const samplings = new Set([20, 60, 100, 140, 180, 220]);

//console.log(lines);

let screen = "";

let tick = (state) => {
  let sstr = state.sstr;
  if (samplings.has(state.cycle)) {
    //console.log(state.x * state.cycle);
    sstr = sstr + state.x * state.cycle;
  }

  let hpos = (state.cycle - 1) % 40;

  screen =
    screen +
    (Math.abs(hpos - state.x) < 2 ? "#" : ".") +
    (hpos === 39 ? "\n" : "");

  return { ...state, cycle: state.cycle + 1, sstr };
};

const sim = cmds.reduce(
  (a, c) => {
    //console.log(c);
    switch (c.op) {
      case "noop": {
        return tick(a);
      }
      case "addx": {
        //console.log(a.count);
        const ps = tick(tick(a));
        return { ...ps, x: ps.x + parseInt(c.count) };
      }
      default:
        throw new Error();
    }
  },
  { cycle: 1, x: 1, sstr: 0 }
);

const r1 = sim.sstr;

console.log(r1);
console.log(screen);
