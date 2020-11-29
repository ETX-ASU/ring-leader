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
```

# Library Useage

## Client Lib:
1. Add package rl-client-lib and rl-shared to package.json
2. Select one of the 3 services:
  a. When using amplify API use servicesAWS
  b. When required to use a caching mechanism for session state use servicesRedirect. Typically, when using a serverless setup, other than amplify API.
  c. When working with a simple express backend use services found under Services.

## Server Lib
1. Add package rl-server-lib and rl-shared lit to package.json.
2. Create an Express app then use either apps.cacheApp or apps.expressApp to activate the backend.

### For straight express applications an example:

```
//USER_INTERFACE_ROOT is the physical location of the frontend index.js example: 
//path.join( __dirname,"/../../rl-tool-example-client/build");

import express from "express";
import { PORT, USER_INTERFACE_ROOT } from "./environment";
import { expressApp } from "@asu-etx/rl-server-lib";

expressApp(app, USER_INTERFACE_ROOT, null);
endpointsToSupportToolAPI(app);

async function start(): Promise<any> {
  await dbInit(null);
  app.listen(PORT, "0.0.0.0", () => {
    logger.debug("App is running at", `0.0.0.0:${PORT}`);
  });
}

start()
```

See  https://github.com/ETX-ASU/ring-leader-express for a complete example

The other types of applications follow a similar pattern:
  1. create an express application.
  2. pass it to an application that populates the endpoints and functionality to support the lti 1.3 and advantage services. The set of endpoints can be found in shared_lib/util/environment.ts and can be adjusted if necessary by setting in .env.

### For an example of a Amplify Application:
See https://github.com/ETX-ASU/boiler

### For an example of a Serverless Express Application
See https://github.com/ETX-ASU/ring-leader-serverless

# How to add an application to a Consumer  (Canvas, Blackboard etc.)

To add an appplication you will need administrative persmissions and you will add the following information about the 
## Tool to the Consumer:
   1. A name for your tool: Boiler Maker that will show up in admin screens.
   2. A title for your tool: that instructors and potentially students will see.
   3. Redirect uris (these are defaults as part of the built in lti support):
      https://www.yourtool.com/lti-advantage-launch (launches the main application)
      https://www.yourtool.com/assignment           (launches the assignment)
      https://www.yourtool.com/deeplink             (used to attach the Tool assignment to the Consumer assignment)
   4. Target link: https://www.yourtool.com/lti-advantage-launch
   5. OIDC links (post and get for this library they are the same:) https://www.yourtool.com/init-oidc
   6. A public key  (Consumer may want in PEM format or as a JWK) can be generated from scripts.
   7. Then activate the following services:
      a. Can create and view assignment data in the gradebook associated with the tool.
      b. Can view assignment data in the gradebook associated with the tool.
      c. Can view submission data for assignments associated with the tool.
      d. Can create and update submission results for assignments associated with the tool.
      e. Can retrieve user data associated with the context the tool is installed in.

## Consumer Info To Tool:
  You will need the following information about the consumer to create a valid TOOL_CONSUMER for the tool.
  to see examples look for .tool_consumers.jim.json in the service of interest:
  1. iss (issurer: typically the url of the service)
  2. client_id: Will be generated by Consumer when adding tool to the consumer, see above.
  3. deployment_id: Again, this is generated by the consumer when adding the tool to the consumer.
  4. "platformOIDCAuthEndPoint": "https://ltiadvantagevalidator.imsglobal.org/ltitool/oidcauthurl.html",
  5. "platformAccessTokenEndpoint": "https://ltiadvantagevalidator.imsglobal.org/ltitool/authcodejwt.html"
  6. uuid (generated by tool and added WITHOUT the -'s)
  7. keyid: generated by the tool, can be anything.
  8. alg: RS256
  
  
# Additional Resources for Registration of Tools:

## Sample Tool Registration with Canvas

[Follow these steps to integrate the example tool with Canvas](./documentation/SampleToolCanvasRegistration.md)


## LTI Advantage Documentation

[Read more about integrating LTI Advantage tools with Canvas](./documentation/CanvasRegistration.md)





