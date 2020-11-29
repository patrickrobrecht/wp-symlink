#! /usr/bin/env node
const program = require('commander')
const { src, symlink } = require('gulp')
const print = require('gulp-print').default

const symlinkOptions = {
  useJunctions: true
}

program
  .arguments('<wpRootDirectory>')
  .option('-p, --plugins <plugins>', 'The directory containing the plugins to symlink.')
  .option('-t, --themes <themes>', 'The directory containing the themes to symlink.')
  .action(
    function (wpRootDirectory) {
      console.log('Creating symlinks for WordPress at %s.', wpRootDirectory)
      symlinkWordPress(wpRootDirectory, program.plugins, 'plugins')
      symlinkWordPress(wpRootDirectory, program.themes, 'themes')
    }
  )
  .parse(process.argv)

function symlinkWordPress (wpRootDirectory, sourceDirectory, type) {
  if (sourceDirectory) {
    console.log('Symlink the %s at %s.', type, program.plugins)
    src(sourceDirectory + '/*')
      .pipe(symlink(wpRootDirectory + '/wp-content/' + type, symlinkOptions))
      .pipe(print(filepath => `Linked ${filepath}.`))
  } else {
    console.log('No %s defined.', type)
  }
}
