const fs = require('fs')
const R = require('ramda')
const chalk = require('chalk')

const dir = process.argv[2] + '/'

const renameFile = renameFileIn.bind(this, dir)

const prefZeroes = R.compose(
  R.tap(a => console.log(chalk.green(`${a.length} files renamed.`))),
  R.forEach(renameFile),
  R.map(generatePadding),
  R.filter(a => a[1] > 0),
  zipWithPadding,
  R.reduce(processFiles, {files: [], digits: []}),
  readFileNamesFromDir,
  R.tap(a => console.log(chalk.blue('Reading directory contents..')))
)

prefZeroes(dir)

function renameFileIn (dir, names) {
  const [oldName, newName] = names

  fs.rename(dir + oldName, dir + newName, (err) => {
    if (err) throw err
    console.log(`File ${chalk.yellow(oldName)} renamed to ${chalk.yellow(newName)}`)
  })
}

function readFileNamesFromDir (dir) {
  return fs.readdirSync(dir)
}

function processFiles (output, file) {
  output.files.push(file),
  output.digits.push(getInitialDigitLength(file)),
  output.padding = Math.max(...output.digits)

  return output
}

function getInitialDigitLength (file) {
  let match = file.match(/^\d+/)
  if (match) {
    let length = match[0].length
    return length
  } else {
    return 0
  }
}

function zipWithPadding ({files, digits, padding}) {
  let pads = digits.map(d => padding - d)

  return files.map((f, idx) => {
    return [f, pads[idx]]
  })
}

function checkPadding () {
}

function generatePadding (arr) {
  return [arr[0], '0'.repeat(arr[1]) + arr[0]]
}
