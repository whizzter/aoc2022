const fs = require("fs");

let lines = fs
  .readFileSync("aoc2215a.txt", "utf8")
  .split("\n")
  .map((l) => l.trimEnd());

let manDist = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

// parse text into array of [[sensorX,sensorY],[beaconX,beaconY],manDist]
let senBeacons = lines
  .map((l) => /x=(-?\d+), y=(-?\d+).+x=(-?\d+), y=(-?\d+)/.exec(l))
  .map((li) => [
    li.slice(1, 3).map((e) => parseInt(e)),
    li.slice(3, 5).map((e) => parseInt(e)),
  ])
  .map((sb) => [...sb, manDist(sb[0], sb[1])]);

// vec-ops
let pairMap = (a, b, f) => a.map((av, ai) => f(av, b[ai], ai));
let vmin = (a, b) => pairMap(a, b, (a, b) => Math.min(a, b));
let vmax = (a, b) => pairMap(a, b, (a, b) => Math.max(a, b));

// find bounds of beacons and sensors (TODO: we might need to extend bounds if the nearest aren't always to the bound..)
let bounds = senBeacons.reduce(
  (a, c) => ({
    min: vmin(a.min, vmin(c[0], c[1])),
    max: vmax(a.max, vmax(c[0], c[1])),
  }),
  { min: senBeacons[0][0], max: senBeacons[0][0] }
);

let spansFor = (axis) => (coord) =>
  senBeacons
    .map((sb) => {
      let axisCoord = sb[0][axis];
      let otherCord = sb[0][axis ^ 1];
      let axisDist = Math.abs(axisCoord - coord);
      let rv = null;
      if (axisDist <= sb[2]) {
        let delta = sb[2] - axisDist;
        rv = [otherCord - delta, otherCord + delta];
      }
      return [...sb, rv];
    })
    .filter((sp) => sp[sp.length - 1] !== null)
    .map((sp) => sp[sp.length - 1]);

let spansForY = spansFor(1);

let spanIntersection = (a, b) => [Math.max(a[0], b[0]), Math.min(a[1], b[1])];
let spanIsValid = (a) => a[0] <= a[1];
let spanUnion = (a, b) => [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
let valueInSpan = (v, span) => span[0] <= v && v <= span[1];

let mergeSpans = (spans) => {
  spans.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < spans.length; i++) {
    while (i + 1 < spans.length) {
      //console.log(spans);
      if (spanIsValid(spanIntersection(spans[i], spans[i + 1]))) {
        spans.splice(i, 2, spanUnion(spans[i], spans[i + 1]));
        continue;
      } else break;
    }
  }
  return spans;
};

//console.log(senBeacons, bounds);
let y = 2000000;
let aSpans = mergeSpans(spansForY(y));

// let numObjectsInSpan = (span) =>
//   senBeacons.reduce(
//     (a, c) =>
//       a +
//       (c[0][1] == y && valueInSpan(c[0][0], span) ? 1 : 0) +
//       (c[1][1] == y && valueInSpan(c[1][0], span) ? 1 : 0),
//     0
//   );

let uniqueBeaconOnY = (y) => [
  ...senBeacons
    .reduce(
      (a, c) => (
        //        c[0][1] == y && a.set(c[0].join(","), c[0]),
        c[1][1] == y && a.set(c[1].join(","), c[1]), a
      ),
      new Map()
    )
    .values(),
];

let r1 =
  aSpans.reduce((a, c) => a + (c[1] - c[0] + 1), 0) - uniqueBeaconOnY(y).length;
console.log(r1, aSpans);

let r2row, r2span;
for (r2row = 0; r2row < 4000000; r2row++) {
  r2span = mergeSpans(spansForY(r2row));
  if (0 == r2row % 100000) {
    console.log(r2row); // slow enough to need a progress
  }
  // we (correctly?) assume that we are looking for a hole and not something on an edge
  if (r2span.length > 1) break;
}
// now calculate the result from the spot just after to the first span
let r2 = (r2span[0][1] + 1) * 4000000 + r2row;
console.log(r2row, r2span, r2);
