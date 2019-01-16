const {src, parallel, symlink} = require('gulp');
const merge = require('merge-stream');

// The configuration.
const config = require('./config.json');

// The options for symlink.
const options = {
    useJunctions: true
};

/**
 * Creates symbolic links in wp-content/plugins or wp-content/themes (depending on the type)
 * for all subdirectories of the source directory.
 *
 * @param sourceDirectory the source directory
 * @param type either plugins or themes
 * @returns stream
 */
function createLinks(sourceDirectory, type) {
    let results = [];
    config.wordPressRoots.forEach(
        (wpRootDirectory) => results.push(
            src(sourceDirectory + '/*')
                .pipe(symlink(wpRootDirectory + '/wp-content/' + type, options))
        )
    );
    return merge(results);
}

/**
 * Creates symbolic links in wp-content/plugins.
 *
 * @returns {stream}
 */
function linkPlugins() {
    return createLinks(config.pluginDirectory, 'plugins')
}

/**
 * Creates symbolic links in wp-content/themes.
 *
 * @returns {stream}
 */
function linkThemes() {
    return createLinks(config.themeDirectory, 'themes');
}

exports.default = parallel(linkPlugins, linkThemes);
exports.plugins = linkPlugins;
exports.themes = linkThemes;
