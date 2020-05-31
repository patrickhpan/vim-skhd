const CMD_FILE = 'IN';
const SKHD = '/Users/patrick/Code/skhd/bin/skhd'
require('fs').writeFileSync(CMD_FILE, '')

const spawn = require('child_process').spawn;

const INITIAL_MODIFIERS = {
  shift: false
}
let MODIFIERS = {...INITIAL_MODIFIERS}

let MODE = null;

let numRepeat = 0;
const repeat = (val, count) => Array(count).fill(val)

let pre = null;
let post = null;

const execKeystrokes = (keystrokes, reset = false) => {
  if (!Array.isArray(keystrokes)) {
    keystrokes = repeat(keystrokes, numRepeat || 1)
  } else {
    keystrokes = repeat(keystrokes, numRepeat || 1).reduce((val, next) => [...val, ...next], []);
  }
  const modifiers = Object.entries(MODIFIERS).filter(x => x[1]).map(x => x[0])
  if (pre) {
    if (!Array.isArray(pre)) {
      pre = [pre]
    }
    keystrokes.unshift(...pre)
  }
  if (post) {
    if (!Array.isArray(post)) {
      post = [post]
    }
    keystrokes.push(...post);
  }
  console.log(modifiers)
  const withArg = keystrokes.map(k => (k[0] === '@' ? [...modifiers, k.slice(1)] : [k]).join(" + ").trim()).map(k => ['-k', k]).reduce((val, next) => [...val, ...next], [])

  console.log(SKHD, withArg)
  spawn(SKHD, withArg)

  numRepeat = 0;
  if (reset) {
    MODIFIERS = {...INITIAL_MODIFIERS}
    pre = null;
    post = null;
  }
}

const tail = spawn('tail', ['-f', CMD_FILE]);



const handleKey = (str) => {
  console.log('STR: ', str)
  str = str.trim();

  const numberMatch = str.match(/^(\d)$/)
  if (numberMatch) {
    numRepeat *= 10;
    numRepeat += Number(str);
  }

  if (str === 'v') {
    MODIFIERS.shift = true;
  }

  if (str === 'b') {
    execKeystrokes('@alt - left')
  }
  if (str === 'w') {
    execKeystrokes('@alt - right')
  }
  if (str === 'h') {
    execKeystrokes('@left')
  }
  if (str === 'j') {
    execKeystrokes('@down')
  }
  if (str === 'k') {
    execKeystrokes('@up')
  }
  if (str === 'l') {
    execKeystrokes('@down')
  }
  if (str === 'x') {
    execKeystrokes('cmd - x', true)
  }
  if (str === 'd') {
    if (MODIFIERS.shift) {
      execKeystrokes('cmd - x', true);
    } else if (MODE === 'd') {
      execKeystrokes(['@shift - down'], true);
      MODE = null;
    } else {
      MODE = 'd'
      pre = 'cmd - left'
      post = 'cmd - x'
    }
  }
  if (str === 'y') {
    if (MODIFIERS.shift) {
      execKeystrokes('cmd - c', true);
    } else if (MODE === 'y') {
      execKeystrokes(['@shift - down'], true);
      MODE = null;
    } else {
      MODE = 'y'
      pre = 'cmd - left'
      post = 'cmd - c'
    }
  }
  if (str === 'p') {
    execKeystrokes('cmd - v')
  }
  if (str === 's') {
    post = ['cmd - x', 'i']
    execKeystrokes(['shift - right'], true);
  }
  if (str === 'o') {
    execKeystrokes(['cmd - right', '@0x24', 'i'], true);
  }
  if (str === 'O') {
    execKeystrokes(['up', 'cmd - right', '@0x24', 'i'], true);
  }
  if (str === 'G') {
    execKeystrokes(['@cmd - down']);
  }
  if (str === 'g') {
    execKeystrokes(['@cmd - up']);
  }
  if (str === '$') {
    execKeystrokes(['cmd - right']);
  }
  if (str === '^') {
    execKeystrokes(['cmd - left']);
  }
  if (str === '/') {
    execKeystrokes(['cmd - f']);
  }
  if (str === 'u') {
    execKeystrokes(['cmd - z']);
  }
  if (str === 'esc') {
    MODIFIERS.shift = false;
    MODE = null;
  }
  if(str === 'I') {
    execKeystrokes(['cmd - left', 'i']);
  }
  if(str === 'A') {
    execKeystrokes(['cmd - right', 'i']);
  }
  if (str === 'cr') {
    execKeystrokes(['cmd + shift - z', 'i']);
  }
}


tail.stdout.on('data', data => data.toString().split('\n').forEach(handleKey))
process.stdin.resume();