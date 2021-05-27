const assert = require('assert')
const { execSync } = require('child_process')
const fs = require('fs')

const DirectoryOptionRecursive = { recursive: true }
const testDataPath = 'test/data/git'
const allPlugins = ['p1', 'p2', 'p3']
const allThemes = ['t1', 't2', 't3']

function mockPluginsAndThemes () {
  // Create sample plugins.
  allPlugins.forEach(function (name) {
    fs.mkdirSync(testDataPath + '/plugins/' + name, DirectoryOptionRecursive)
    fs.writeFileSync(testDataPath + '/plugins/' + name + '/readme.txt', name)
  })

  // Create sample themes.
  allThemes.forEach(function (name) {
    fs.mkdirSync(testDataPath + '/themes/' + name, DirectoryOptionRecursive)
    fs.writeFileSync(testDataPath + '/themes/' + name + '/style.css', name)
  })
}

function mockConfiguration (path, config) {
  fs.writeFileSync(path, JSON.stringify(config))
}

function assertPlugins (plugins, path, expected) {
  plugins.forEach(
    function (name) {
      assertFile(path + '/wp-content/plugins/' + name + '/readme.txt', expected)
    }
  )
}

function assertThemes (themes, path, expected) {
  themes.forEach(
    function (name) {
      assertFile(path + '/wp-content/themes/' + name + '/style.css', expected)
    }
  )
}

function arrayDiff (array, excludeArray) {
  return array.filter(x => !excludeArray.includes(x))
}

function assertFile (path, expected) {
  const linked = fs.existsSync(path)
  const message = expected
    ? `Expected file ${path} to exist, but could not find it.`
    : `File ${path} exists, although it should not.`
  assert.strictEqual(linked, expected, message)
}

/* global after, before, describe, it */

describe('CLI', function () {
  before(function () {
    mockPluginsAndThemes()
  })

  describe('CLI with long parameters', function () {
    it('Plugins and themes exist after wp-symlink --wp --plugins --themes', function () {
      execSync('wp-symlink --wp test/data/wp1a --plugins test/data/git/plugins/* --themes test/data/git/themes/*')
      sleep(1).then(() => {
        assertPlugins(allPlugins, 'test/data/wp1a', true)
        assertThemes(allThemes, 'test/data/wp1a', true)
      })
    })

    it('Plugins exist and themes do not exist after wp-symlink --wp --plugins', function () {
      execSync('wp-symlink --wp test/data/wp1b --plugins test/data/git/plugins/p1')
      sleep(1).then(() => {
        const expectedPlugins = ['p1']
        assertPlugins(expectedPlugins, 'test/data/wp1b', true)
        assertPlugins(arrayDiff(allPlugins, expectedPlugins), 'test/data/wp1b', false)
        assertThemes(allThemes, 'test/data/wp1b', false)
      })
    })

    it('Plugins do not exist and themes exist after wp-symlink --wp --themes', function () {
      execSync('wp-symlink --wp test/data/wp1c --themes test/data/git/themes/*')
      sleep(1).then(() => {
        assertPlugins(allPlugins, 'test/data/wp1c', false)
        assertThemes(allThemes, 'test/data/wp1c', true)
      })
    })

    it('Neither plugins nor and themes exist after wp-symlink --wp', function () {
      execSync('wp-symlink --wp test/data/wp1d')
      sleep(1).then(() => {
        assertPlugins(allPlugins, 'test/data/wp1d', false)
        assertThemes(allThemes, 'test/data/wp1d', false)
      })
    })
  })

  describe('CLI with short parameters', function () {
    it('Plugins and themes exist after -w -p -t', function () {
      execSync('wp-symlink -w test/data/wp2a -p test/data/git/plugins/* -t test/data/git/themes/*')
      sleep(1).then(() => {
        assertPlugins(allPlugins, 'test/data/wp2a', true)
        assertThemes(allThemes, 'test/data/wp2a', true)
      })
    })

    it('Plugins exist and themes do not exist after wp-symlink -w -p', function () {
      execSync('wp-symlink -w test/data/wp2b -p test/data/git/plugins/*')
      sleep(1).then(() => {
        assertPlugins(allPlugins, 'test/data/wp2b', true)
        assertThemes(allThemes, 'test/data/wp2b', false)
      })
    })

    it('Plugins do not exist and themes exist after wp-symlink -w -t', function () {
      execSync('wp-symlink -w test/data/wp2c -t test/data/git/themes/*')
      sleep(1).then(() => {
        assertPlugins(allPlugins, 'test/data/wp2c', false)
        assertThemes(allThemes, 'test/data/wp2c', true)
      })
    })

    it('Neither plugins nor and themes exist after wp-symlink -w', function () {
      execSync('wp-symlink -w test/data/wp2d')
      sleep(1).then(() => {
        assertPlugins(allPlugins, 'test/data/wp2d', false)
        assertThemes(allThemes, 'test/data/wp2d', false)
      })
    })
  })

  describe('CLI with configuration file', function () {
    before(function () {
      mockConfiguration(
        'wp-symlink.json',
        {
          wp: ['test/data/wp3a1', 'test/data/wp3a2'],
          plugins: ['test/data/git/plugins/p1', 'test/data/git/plugins/p2'],
          themes: ['test/data/git/themes/*']
        }
      )
      mockConfiguration(
        'test/data/config.json',
        {
          wp: ['test/data/wp4a1', 'test/data/wp4a2'],
          plugins: ['test/data/git/plugins/*'],
          themes: ['test/data/git/themes/*']
        }
      )
    })

    it('Plugins and themes exist after wp-symlink', function () {
      execSync('wp-symlink')
      sleep(1).then(() => {
        const expectedPlugins = ['p1', 'p2']
        const otherPlugins = arrayDiff(allPlugins, expectedPlugins)
        assertPlugins(expectedPlugins, 'test/data/wp3a1', true)
        assertPlugins(otherPlugins, 'test/data/wp3a1', false)
        assertPlugins(expectedPlugins, 'test/data/wp3a2', true)
        assertPlugins(otherPlugins, 'test/data/wp3a2', false)
        assertThemes(allThemes, 'test/data/wp3a1', true)
        assertThemes(allThemes, 'test/data/wp3a2', true)
      })
    })

    it('Plugins and themes exist after wp-symlink --config', function () {
      execSync('wp-symlink --config test/data/config.json')
      sleep(1).then(() => {
        assertPlugins(allPlugins, 'test/data/wp4a1', true)
        assertPlugins(allPlugins, 'test/data/wp4a2', true)
        assertThemes(allThemes, 'test/data/wp4a1', true)
        assertThemes(allThemes, 'test/data/wp4a2', true)
      })
    })
  })

  after(function () {
    // Cleanup
    fs.rmdirSync('test/data', DirectoryOptionRecursive)
    fs.rmSync('wp-symlink.json')
  })
})

function sleep (seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}
