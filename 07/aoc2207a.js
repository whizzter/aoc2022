const fs = require("fs");

let arraySum = (a, c) => (a === undefined ? 0 : a) + c;

const lines = fs
  .readFileSync("aoc2207a.txt", "utf8")
  .split("\n")
  .map((l) => l.trimEnd());

const lRE = /\$ ls.*|\$ cd (?<cd>.*)|dir (?:.*)|(?<flen>\d+) (?<fn>\S+)/;
const fInfo = lines.reduce(
  (a, c) => {
    let li = lRE.exec(c);
    //    console.log(li);

    let cd = li.groups.cd;
    let flen = li.groups.flen;

    if (cd === "/") {
      return { ...a, p: "/" };
    } else if (cd === "..") {
      return { ...a, p: /^(?<head>.*\/)(?:[^/]+)\/$/.exec(a.p).groups.head };
    } else if (cd !== undefined) {
      let nd = a.p + cd + "/";
      a.dn.add(nd);
      return { ...a, p: nd };
    } else if (flen !== undefined) {
      return {
        ...a,
        f: [...a.f, { l: parseInt(flen), p: a.p + li.groups.fn }],
      };
    }

    return a;
  },
  { p: "/", f: [], dn: new Set(["/"]) }
);

fInfo.dirs = [...fInfo.dn].map((dn) => ({
  p: dn,
  tsz: fInfo.f.reduce((a, c) => a + (!c.p.startsWith(dn) ? 0 : c.l), 0),
}));

let r1 = fInfo.dirs.reduce((a, c) => a + (c.tsz > 100000 ? 0 : c.tsz), 0);

let us = fInfo.dirs.find((d) => d.p === "/").tsz;
console.log("UsedSpace:" + us);

let r2 = fInfo.dirs
  .filter((d) => 70000000 - us + d.tsz >= 30000000)
  .sort((a, b) => a.tsz - b.tsz)[0].tsz;

console.log(r1, r2);
