# vim-skhd: Basic vim emulation in skhd

Have you ever wanted to run `v100dw` in your favorite non-vim word processor?Now you can with [skhd](https://github.com/koekeishiya/skhd/).

[Demo](https://streamable.com/swg0zx)

## Prerequisites

To run rapid sequential keypresses, you'll need to build `skhd` from source using my branch [here](https://github.com/patrickhpan/skhd). (There's an open pull request to koekishiya's repo [here](https://github.com/koekeishiya/skhd/pull/129)).

## How it works

skhd can run shell commands in response to certain keypresses. Thus, we run `runkey.sh` each time a vim key is pressed, which writes the key (not keycode) to a file called IN, which is being constantly read by `vim-skhd-proc.js`. `vim-skhd-proc.js` sits in the background, running `tail -f` on IN to read incoming keypresses and emulating corresponding vim commands through `skhd -k $KEYCODE`. 

## Building vim.skhdrc
`vim-skhd-proc.js` takes as input actual vim keys, not keycodes (i.e., `$`, not `shift - 4`). Thus, when we run `vim-skhd-proc.js` from our `skhdrc` file, we need to map skhd keycodes to vim keys. 

The `keys` file contains newline-delimited pairs of skhd keycodes on the left and vim keys on the right, separated by `:`. Most of these contain the same character on both sides, but these lines are necessary so we know to bind those keypresses in vim normal mode. 

After populating the `keys` file, run `node generate-skhd.js` to create `vim.skhdrc`, which will bind the given skhd keycodes to their matching vim keys in `vim_normal` mode, except for the given apps (currently Terminal, Finder, and Code - Insiders). 

You may need to restart `skhd` each time you update this file.

## Adding normal (vim) and insert modes to skhd

Add the following lines to your `skhdrc`:
```
:: vim_normal 

ctrl - 0x24 ; vim_normal
vim_normal < ctrl - 0x24 : ~/..v esc
vim_normal < i ; normal

.load "$PATH_TO_THIS_REPO/vim.skhdrc"
```
This uses `ctrl - enter` to enter vim normal mode and `i` to enter insert mode. (I dare not bind `esc`.)

## Run everything!

Run `node vim-skhd-proc.js`. Then run your custom build of skhd. Now you should be able to switch to a normal text editor and run some basic vim commands!

## About vim-skhd-proc.js...

It's a mess. I don't even know how it works anymore. It's time to sit down with vim documentation and draw a state diagram, I guess.
