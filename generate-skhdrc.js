const { readFileSync, writeFileSync } = require('fs')
const keysText = readFileSync('keys', 'utf8')
const keysLines = keysText.split('\n')
const outLines = keysLines.map(line => line.trim()).filter(line => line.length).map(line => {
  try { 
  const [_, from, to] = line.match(/(.+):(.+)/);
    return `vim_normal < ${from} [
      * : ${__dirname}/runkey.sh ${to}
      "Terminal" ~
      "Finder" ~
      "Code - Insiders" ~
    ]` 
  } catch (e) {
    console.error('Invalid line:', line)
  }
})
writeFileSync('vim.skhdrc', outLines.join("\n"))

