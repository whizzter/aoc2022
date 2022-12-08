const input = require("fs").readFileSync("aoc2208a.txt", "utf8");
const testInput = `30373
25512
65332
33549
35390`;
const lines = input.split("\n").map((l) => l.trimEnd());
const grid = lines.map((l) => [...l].map((e) => parseInt(e)));

//console.log(grid);

const isVis = (x, y) => {
  const height = grid[y][x];
  // check column
  let vis = [true, true, true, true];
  for (let i = 0; i < grid.length; i++) {
    if (i == y) continue;
    if (grid[i][x] >= height)
      if (i < y) vis[0] = false;
      else vis[1] = false;
  }
  // row
  for (let i = 0; i < grid[0].length; i++) {
    if (i == x) continue;
    if (grid[y][i] >= height)
      if (i < x) vis[2] = false;
      else vis[3] = false;
  }
  return vis.reduce((a, c) => a || c, false);
};

let arraySum = (a, c) => (a === undefined ? 0 : a) + c;

let r1 = grid
  .map((l, y) => l.map((e, x) => isVis(x, y) | 0).reduce(arraySum))
  .reduce(arraySum);

console.log(r1);

const scs = (x, y) => {
  const height = grid[y][x];
  let msteps = Math.max(grid.length, grid[0].length);
  let score = 1;
  // we calculate the direction from i, we want 4 directions so we step that many times.
  for (let i = 0; i < 4; i++) {
    // use the 2nd bit as a sign bit (the first one will be useful as a direction mask below)
    let sign = i & 2 ? 1 : -1;
    for (let j = 1; j < msteps; j++) {
      // i&1 will be true for i==1(left) or i==3(right), otherwise xp is fixed to x
      let xp = x + (i & 1) * sign * j;
      // (i+1)&1 will be true for i==0 (up) and i==2(down), otherwise yp is fixed to y
      let yp = y + ((i + 1) & 1) * sign * j;
      // if we are outside the grid we terminate the loop. (msteps is the maximum possible amount of steps so we will overshoot most of the time)
      if (xp < 0 || yp < 0 || xp >= grid[0].length || yp >= grid.length) {
        score *= j - 1;
        break;
      }
      const sh = grid[yp][xp];
      // if a tree blocks we count it in and terminate this direction.
      if (sh >= height) {
        score *= j;
        break;
      }
    }
  }
  return score;
};

let r2 = grid
  .map((l, y) =>
    l.map((e, x) => scs(x, y) | 0).reduce((a, b) => Math.max(a, b))
  )
  .reduce((a, b) => Math.max(a, b));

console.log(r2);
