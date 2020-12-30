# wp-symlink

wp-symlink is a [Node.js](https://nodejs.org/en/)
    based utility to creating symbolic links in the directories
    `wp-content/plugins` and `wp-content-themes`.

The intended purpose is the usage in development environments with multiple WordPress installations
    (e. g. for different WordPress or PHP versions):
Creating a symbolic link in the plugin/theme directory of the WordPress
    pointing to the development directory (e. g. a Git repository)
    makes it easy to use the same code simultaneously across all WordPress installations.


## How to use
wp-symlink must be started via command line. The syntax is:
    `wp-symlink --wp <wordpress-root-directory--path> --plugins <path-to-plugins> --themes <path-to-my-themes>`.

Example: If you have Git repositories for plugins at `git/plugins/plugin1` and `git/plugins/plugin2`
    and a WordPress running at `my-sites/wordpress`,
use `wp-symlink my-sites/wordpress --plugins git/plugins/*` to create symbolic links at 
    `my-sites/wordpress/wp-content/plugins/plugin1`, and `my-sites/wordpress/wp-content/plugins/plugin2`.

Alternatively you can use a configuration file using
    `wp-symlink --config path/to/my-wp-symlink-configuration.json`
    (without `--config` the file `wp-symlink.json` is used by default).

In the configuration file you can reference multiple paths to WordPress installations, plugins and themes:
```
{
  "wp": [
    "path/to/wordpress-stable",
    "path/to/wordpress-beta"
  ],
  "plugins": [
    "path/to/git/plugins/*"
  ],
  "themes": [
    "path/to/git/themes/*"
  ]
}
```

The paths to the plugins and themes may use [glob expressions](https://gulpjs.com/docs/en/getting-started/explaining-globs/).

Use `wp-symlink --help` for details.

## How to develop
- Install dependencies via `npm install` and execute `npm link`.
- Use `npm run cs` (`npm run csfix`) to check (fix) code style violations using [eslint](https://eslint.org/).
- Use `npm run test` to run the automatic tests with [Mocha](https://mochajs.org/).
