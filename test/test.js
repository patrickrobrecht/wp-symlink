const assert = require('assert')
const { execSync } = require('child_process')
const fs = require('fs')

const DirectoryOptionRecursive = { recursive: true }
const testDataPath = 'test/data/git'
const plugins = ['p1', 'p2']
const themes = ['t1', 't2']

function assertPlugins (path, expected) {
  plugins.forEach(
    function (name) {
      assert.strictEqual(fs.existsSync(path + '/wp-content/plugins/' + name + '/readme.txt'), expected)
    }
  )
}

function assertThemes (path, expected) {
  themes.forEach(
    function (name) {
      assert.strictEqual(fs.existsSync(path + '/wp-content/themes/' + name + '/style.css'), expected)
    }
  )
}

/* global after, before, describe, it */

describe('wp-symlink CLI', function () {
  before(function () {
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
  })

  describe('wp-symlink --plugins --themes', function () {
    before(function () {
      execSync('wp-symlink test/data/wp1 --plugins test/data/git/plugins --themes test/data/git/themes')
    })

    it('Plugins exist', function () {
      assertPlugins('test/data/wp1', true)
    })

    it('Themes exist', function () {
      assertThemes('test/data/wp1', true)
    })
  })

  describe('wp-symlink --plugins', function () {
    before(function () {
      execSync('wp-symlink test/data/wp2 --plugins test/data/git/plugins')
    })

    it('Plugins exist', function () {
      assertPlugins('test/data/wp2', true)
    })

    it('Themes do not exist', function () {
      assertThemes('test/data/wp2', false)
    })
  })

  describe('wp-symlink --themes', function () {
    before(function () {
      execSync('wp-symlink test/data/wp3 --themes test/data/git/themes')
    })

    it('Plugins do not', function () {
      assertPlugins('test/data/wp3', false)
    })

    it('Themes exist', function () {
      assertThemes('test/data/wp3', true)
    })
  })

  after(function () {
    fs.rmdirSync('test/data', DirectoryOptionRecursive)
  })
})
