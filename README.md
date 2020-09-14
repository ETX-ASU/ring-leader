# ASU ETX Ring Leader

This is a monorepo that houses several packages that can be published and consumed independently to support the Ring Leader vision. That vision is to simplify the LTI 1.3 integration from LMSs into tools developed by the ETX team.

The `rl-server-lib` and `rl-client-lib` packages are published as private NPM packages that can be included within tools. These libraries will be used to expedite the integration with LTI 1.3 capable LMSs.

The `rl-tool-example-client` and `rl-tool-example-server` packages are used to stand up an example usage of the `rl-server-lib` and `rl-client-lib` libraries.

# Install Tools

## Install `Node.js`

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

# Creating and Configuring a `.env.local` File for Heroku

In order to fully test the Ring Leader libraries using the test server, you will need to setup a Heroku app as well as public and private keys for the LTI 1.3 launch.

All of the configurations for the LTI 1.3 launch and Heroku app will be stored in a `.env.local` file. Follow these steps:

1. Find the `packages/rl-tool-example-server/.env` file.
2. Make a copy of that file and name it `packages/rl-tool-example-server/.env.local`
3. Substitute `<replace me>` in the value of the `HEROKU_APP_NAME` field with your name. Example:

```bash
# before
HEROKU_APP_NAME=ring-leader-<replace me>
# after
HEROKU_APP_NAME=ring-leader-john-martin
```

4. Save your updated `.env.local` file.

# Local Development

From the root of the project run the following:

```bash
yarn run develop
```

This will install all dependencies, build each of the packages and being watching each package for changes.

Note that the utilization of `Yarn Workspaces` allows packages do list other packages within this monorepo as dependencies. The watches that run should allow a change in a dependent package to be picked up automatically.

# Building and Deploying the Test Server

The test server is best used as an https service publicly available on the web. Standing up a simple NodeJS Heroku app is a fast way to achieve this.

## Creating a Free Heroku Account

You will need to [setup a free Heroku account](https://signup.heroku.com/signup/dc) first.

## Installing the Heroku CLI

You will need to install the Heroku cli and create an account.

https://devcenter.heroku.com/articles/heroku-cli

## Login to Heroku

```bash
heroku login
```

## Initializing your App

The app will need a unique name within Heroku and within your Heroku account. Be sure you have already completed the step above to set your `.env.local` key for the Heroku app name.

Once you have configured your Heroku app name, then run the following:

```bash
yarn run heroku-create
```

Run the following command to verify that Heroku is now listed as a `git` remote:

```bash
git remote -v
# heroku	https://git.heroku.com/ring-leader-john-martin.git (fetch)
# heroku	https://git.heroku.com/ring-leader-john-martin.git (push)
# origin	https://github.com/ETX-ASU/ring-leader.git (fetch)
# origin	https://github.com/ETX-ASU/ring-leader.git (push)
```

### Generating Public/Private Keys and a JWK

Canvas will require a Public Key embedded in a JWK to create a `developer key` to be used to add the LTI Tool ( example server ) as an application.

#### Setup Public & Private Keys

A public and private key pair need to be generated. The public key will be provided through a JWK to Canvas. The private key will be configured to load within the Heroku app for verification of requests coming from Canvas.

```bash
yarn run setup-tool-keys
```

This script does the following:

1. Generates the required `.pem` files that represent the public and private RAS keys
2. Converts the public key into the `JWK` format
3. Configures your Heroku app with the private Key

## Staring or Updating your App

When you want to start your app or push a change, run the following command from the root of the project:

```bash
git push heroku <your current branch>:master
```

## Debugging the Heroku App

Tailing the Heroku App Logs

```bash
heroku logs --tail
```

SH into the Heroku server:
```bash
heroku run bash
```

# Running Tests

// todo

# SemVer

Because there could be many tools relying on the Ring Leader libraries, it is critical to follow [`SemVer`](https://semver.org/) as a convention.

// TODO outline Git Commit and testing conventions

# Publishing Ring Leader Packages

The `rl-client-lib` and `rl-server-lib` packages can be pulled down by anyone who has access to the "@asu-etx" scoped private NPM repositories. They are pulled by many tools.

Publishing should only take place after extensive review of the all `Git` commits, successful completion of all tests, and manual testing using the test server.

Making an update means first determining the next [`SemVer`](https://semver.org/) version number to use to ensure there is no disruption for tools that already have dependencies on these libraries.

// todo utilize git conventions
// make note of tests

```
// TODO
```

# LTI Advantage Documentation

[Read more about integrating LTI Advantage tools with Canvas](./documentation/CanvasRegistration.md)