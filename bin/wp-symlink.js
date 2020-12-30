#! /usr/bin/env node
const program = require('commander')
const fs = require('fs')
const { src, symlink } = require('gulp')
const print = require('gulp-print').default

const symlinkOptions = {
  useJunctions: true
}

program
  .option('-c, --config <config>', 'the configuration file', 'wp-symlink.json')
  .option('-w, --wp <wp>', 'the path to the WordPress root directory', null)
  .option('-p, --plugins <plugins>', 'the path to the plugins to symlink', null)
  .option('-t, --themes <themes>', 'the path to the themes to symlink', null)
  .action(
    function () {
      if (program.wp === null) {
        console.log('Using configuration file %s', program.config)
        const config = loadConfiguration(program.config)
        if (config !== false) {
          symlinkBasedOnConfiguration(config)
        }

        // Warn for ignored parameters
        if (program.plugins !== null) {
          console.warn('Ignoring -p or --plugins option.')
        }
        if (program.themes !== null) {
          console.warn('Ignoring -t or --themes option.')
        }
      } else {
        // Use configuration via --wp --plugins --themes
        if (program.plugins === null && program.themes === null) {
          console.error('Missing --plugins and --themes, so there is nothing to do.')
          return
        }

        console.log('Creating symlinks for WordPress at %s.', program.wp)
        if (program.plugins !== null) {
          symlinkWordPress(program.wp, program.plugins, 'plugins')
        }
        if (program.themes !== null) {
          symlinkWordPress(program.wp, program.themes, 'themes')
        }
      }
    }
  )
  .parse(process.argv)

function symlinkWordPress (wpRootDirectory, sourceDirectory, type) {
  console.log(' %s', Array.isArray(sourceDirectory) ? sourceDirectory.join(', ') : sourceDirectory)
  return src(sourceDirectory)
    .pipe(symlink(wpRootDirectory + '/wp-content/' + type, symlinkOptions))
    .pipe(print(filepath => `  Linked ${filepath}.`))
}

function loadConfiguration (configFilePath) {
  if (!fs.existsSync(configFilePath)) {
    console.error('File %s does not exist.', configFilePath)
    return false
  }

  return JSON.parse(fs.readFileSync(configFilePath).toString())
}

function symlinkBasedOnConfiguration (config) {
  const wp = getArrayValue(config, 'wp')
  const plugins = getArrayValue(config, 'plugins')
  const themes = getArrayValue(config, 'themes')

  let hasErrors = false
  if (wp === false) {
    hasErrors = true
    console.error('Missing field "wp".')
  }

  if (plugins === false && themes === false) {
    hasErrors = true
    console.error('You must set at least one of the fields "plugins" or "themes".')
  }

  if (hasErrors) {
    return
  }

  for (const wpRootPath of wp) {
    console.log('Creating symlinks for WordPress at %s.', wpRootPath)
    if (plugins) {
      symlinkWordPress(wpRootPath, plugins, 'plugins')
    }
    if (themes) {
      symlinkWordPress(wpRootPath, themes, 'themes')
    }
  }
}

function getArrayValue (config, field) {
  if (field in config) {
    const value = config[field]

    if (typeof value === 'string') {
      const array = []
      array.push(value)
      return array
    }

    if (Symbol.iterator in Object(value)) {
      return value
    }

    console.error('Invalid value for %s - expecting array or string', field)
  }

  return false
}
