# Symlink WordPress

wp-symlink is a [Node.js](https://nodejs.org/en/)
    based utility to creating symbolic links in the directories
    `wp-content/plugins` and `wp-content-themes`.

The intended purpose is the usage in development environments with multiple WordPress installs
    (e. g. for different WordPress or PHP versions):
Creating a symbolic link in the plugin/theme directory of the WordPress
    pointing to the development directory (e. g. a Git repository)
    makes the same code used in all WordPress installs.


## How to use
wp-symlink must be started via command line. The syntax is:
    `wp-symlink <wordpress-root-directory--path> --plugins <path-to-plugins> --themes <path-to-my-themes>`

Example: If you have Git repositories for plugins at `git/plugins/plugin1` and `git/plugins/plugin2`
    and a WordPress running at `my-sites/wordpress`,
use `wp-symlink my-sites/wordpress --plugins git/plugins` to create symbolic links at 
    `my-sites/wordpress/wp-content/plugins/plugin1`, and `my-sites/wordpress/wp-content/plugins/plugin2`.

Use `wp-symlink --help` for details.

## How to develop
- Install dependencies via `npm install` and execute `npm link`.
- Use `npm run cs` [`npm run csfix`] to check [fix] code style violations.
