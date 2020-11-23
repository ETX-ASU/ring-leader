# ASU ETX Ring Leader

This is a monorepo that houses several packages that can be published and consumed independently to support the Ring Leader vision. That vision is to simplify the LTI 1.3 integration from LMSs into tools developed by the ETX team.

The `rl-server-lib` and `rl-client-lib` packages are published as public NPM packages that can be included within tools. These libraries will be used to expedite the integration with LTI 1.3 capable LMSs.

There are several additional repositories in asu-etx that illustrate the use of these libraries to stand up an lti compliant tool with minimal additional code.

## Example AWS Amplify aplication:
 https://github.com/ETX-ASU/boiler
## Example Express Application
 https://github.com/ETX-ASU/ring-leader-express
## Example Serverless Application
https://github.com/ETX-ASU/ring-leader-serverless

# Install Tools

## Install `Node.js`
## Install `Typescript`

```bash
npm install -g typescript
```

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

# TO Build
 ```bash
yarn build
```

# To Publish a library
If you have made changes and you want to publish the changes to the npm repositoy. You will go to the package that you have made changes in.
Bump the package version and then:

```bash
yarn build
npm publish --access=public
