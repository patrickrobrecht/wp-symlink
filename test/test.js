const assert = require('assert')
const { execSync } = require('child_process')
const fs = require('fs')

const DirectoryOptionRecursive = { recursive: true }
const testDataPath = 'test/data/git'
const plugins = ['p1', 'p2']
const themes = ['t1', 't2']

function mockPluginsAndThemes () {
  // Create sample plugins.
  plugins.forEach(function (name) {
    fs.mkdirSync(testDataPath + '/plugins/' + name, DirectoryOptionRecursive)
    fs.writeFileSync(testDataPath + '/plugins/' + name + '/readme.txt', name)
  })

  // Create sample themes.
  themes.forEach(function (name) {
    fs.mkdirSync(testDataPath + '/themes/' + name, DirectoryOptionRecursive)
    fs.writeFileSync(testDataPath + '/themes/' + name + '/style.css', name)
  })
}

function mockConfiguration (path, config) {
  fs.writeFileSync(path, JSON.stringify(config))
}

function assertPlugins (path, expected) {
  plugins.forEach(
    function (name) {
      assertFile(path + '/wp-content/plugins/' + name + '/readme.txt', expected)
    }
  )
}

function assertThemes (path, expected) {
  themes.forEach(
    function (name) {
      assertFile(path + '/wp-content/themes/' + name + '/style.css', expected)
    }
  )
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
      assertPlugins('test/data/wp1a', true)
      assertThemes('test/data/wp1a', true)
    })

    it('Plugins exist and themes do not exist after wp-symlink --wp --plugins', function () {
      execSync('wp-symlink --wp test/data/wp1b --plugins test/data/git/plugins/*')
      assertPlugins('test/data/wp1b', true)
      assertThemes('test/data/wp1b', false)
    })

    it('Plugins do not exist and themes exist after wp-symlink --wp --themes', function () {
      execSync('wp-symlink --wp test/data/wp1c --themes test/data/git/themes/*')
      assertPlugins('test/data/wp1c', false)
      assertThemes('test/data/wp1c', true)
    })

    it('Neither plugins nor and themes exist after wp-symlink --wp', function () {
      execSync('wp-symlink --wp test/data/wp1d')
      assertPlugins('test/data/wp1d', false)
      assertThemes('test/data/wp1d', false)
    })
  })

  describe('CLI with short parameters', function () {
    it('Plugins and themes exist after -w -p -t', function () {
      execSync('wp-symlink -w test/data/wp2a -p test/data/git/plugins/* -t test/data/git/themes/*')
      assertPlugins('test/data/wp2a', true)
      assertThemes('test/data/wp2a', true)
    })

    it('Plugins exist and themes do not exist after wp-symlink -w -p', function () {
      execSync('wp-symlink -w test/data/wp2b -p test/data/git/plugins/*')
      assertPlugins('test/data/wp2b', true)
      assertThemes('test/data/wp2b', false)
    })

    it('Plugins do not exist and themes exist after wp-symlink -w -t', function () {
      execSync('wp-symlink -w test/data/wp2c -t test/data/git/themes/*')
      assertPlugins('test/data/wp2c', false)
      assertThemes('test/data/wp2c', true)
    })

    it('Neither plugins nor and themes exist after wp-symlink -w', function () {
      execSync('wp-symlink -w test/data/wp2d')
      assertPlugins('test/data/wp2d', false)
      assertThemes('test/data/wp2d', false)
    })
  })

  describe('CLI with configuration file', function () {
    before(function () {
      mockConfiguration(
        'wp-symlink.json',
        {
          wp: ['test/data/wp3a1', 'test/data/wp3a2'],
          plugins: ['test/data/git/plugins/*'],
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
        assertPlugins('test/data/wp3a1', true)
        assertPlugins('test/data/wp3a2', true)
        assertThemes('test/data/wp3a1', true)
        assertThemes('test/data/wp3a2', true)
      })
    })

    it('Plugins and themes exist after wp-symlink --config', function () {
      execSync('wp-symlink --config test/data/config.json')
      sleep(1).then(() => {
        assertPlugins('test/data/wp4a1', true)
        assertPlugins('test/data/wp4a2', true)
        assertThemes('test/data/wp4a1', true)
        assertThemes('test/data/wp4a2', true)
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
