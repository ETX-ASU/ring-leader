# ASU ETX Ring Leader

# Usage

## Install Tools

### Install `Node.js`

This project requires `Node.js`. All code is written in `TypeScript` which compiles into executable `Node.js` scripts that are run as a CLI. This means we will need to install a compatible version of `Node.js` if you don't already have one.

`Node.js` also ships with `npm` which is a package manager that is required to download all the dependencies needed to run this CLI.

First let's see if you need to install `Node.js` first. Open up a terminal and execute the following command:

```bash
node -v
```

If you don't see an error and you see something like `v10.16.0`, then you have `Node.js` installed already. This project requires a version of `>=8.0.0`.

If you don't have the right version or don't have `Node.js` installed at all, then you will need to install it:

- [Install Node.js](https://nodejs.org/en/download/)

# Setup `yarn` and `yarn workspaces`

This project uses `yarn` for dependency management as well as for managing the monorepo via `yarn workspaces`. This requires `yarn` with version > 1.

Verify you have yarn installed and the version is > 1.

```bash
yarn -v
1.15.2
```

If you don't have `yarn` installed or need a greater version, see the [yarn installation docs](https://yarnpkg.com/lang/en/docs/install).


Now it's time to install all `yarn workspaces`. From the root of the repository run:

```bash
yarn install
```

# Setup VS Code

The recommended editor is VS Code. When you open VS Code at the root of this repository, VS Code, **should** prompt you to open this project as a `workspace`. Say **YES**!

Loading the project as a `workspace` is IMPORTANT. It has configurations that will help make CloudFormation editing better among other things.

VS Code will then prompt you to install recommended extensions. Be sure to add these at a minimum:

- GitHub Markdown Style: bierner.markdown-preview-github-styles
- ESLint: dbaeumer.vscode-eslint
- Package.json syntax highlighting: eg2.vscode-npm-script

# Local Development

After doing a `yarn install`, run the following:

```bash
yarn run develop
```

This will build each of the three packages and start watchers.

# Running Tests

// todo

# Running the Test Server

// todo

# Publishing Packages

```
// TODO
```

