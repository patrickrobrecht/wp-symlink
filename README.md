# Symlink WordPress

_Symlink WordPress_ is a [Node.js](https://nodejs.org/en/)
    based utility for creating symbolic links in the directories 
    `wp-content/plugins` and `wp-content-themes`.

## How to use
1. Install dependencies via `npm install`
2. Create a `config.json` similar to `config.sample.json`
    containing the paths to the root directories of the WordPress installations,
    the directory containing the plugins and the directory containing the themes.
3. Execute `npm run symlink` to create symbolic links for all plugins and themes.
    `npm run symlink-plugins` and `npm run symlink-themes` are available to create symbolic links for just one of them.
