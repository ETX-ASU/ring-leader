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

## IMS Certification
   See the folder documentation/certification-support for for an explanation of how to start the IMS certification process.

# Tool Registration With Canvas specifically but is in general true for all LMS platforms that support LTI 1.3

This outlines the steps required to register an existing LTI 1.3 enabled tool with the Canvas LMS.
Note: using the setup-tool-keys.ts script will generate an initial json object with a set of values which will need to be updated after the tool has been registered with the Canvas instance. In addition, the outline steps will be similar for all LMS platforms

## Canvas LTI Tool Setup

1. [Canvas LTI Advantage documentation](https://community.canvaslms.com/t5/Canvas-Releases-Board/Canvas-Release-LTI-1-3-and-LTI-Advantage-2019-06-22/m-p/246652)
2. [How do I configure an LTI Key for an account](https://community.canvaslms.com/t5/Admin-Guide/How-do-I-configure-an-LTI-key-for-an-account/ta-p/140)
3. [VitalSource Tool Example](https://success.vitalsource.com/hc/en-gb/articles/360052315753-LTI-1-3-Tool-Setup-Instructions-for-Canvas)

## Tool Provider Code Examples

1. [IMS Global LTI 1.3 Reference Implementation](https://lti-ri.imsglobal.org/)
2. [Java Implementation](https://github.com/UOC/java-lti-1.3-provider-example)
3. [PHP Implementation](https://github.com/IMSGlobal/lti-1-3-php-library)
4. [NodeJS + Express Implementation](https://cvmcosta.me/ltijs/#/)

## Tool Registration Setup Summary

The documentation links above address different aspects of using LTI 1.3 Advantage. Before integration can happen, the following steps must take place:

### LTI 1.3 Tool Development

An LTI 1.3 enabled tool must provide the following:

1. Mechanism to register platforms
2. Two endpoints for LTI 1.3 launch OIDC workflow
3. Mechanism to manage the LTI 1.3 token provided by the platform either by attaching it to the user's session or sending it to the client
4. Mechanism(s) to use the token to callback to the LTI Advantage endpoints

#### Mechanism to register platforms

The tool must have a way to persist a list of platforms. It could be a protected database that holds rows for each platform, or a JSON file in S3 that is also protected as it will hold very sensitive `private _key` data.

Each entry in the database should hold:

1. **Platform Name** ( human readable id )
2. **Client ID** - the `client_id` the platform will provide upon registration of the tool
3. **Private Key** - the `private_key` data needed to verify requests from the platform
4. **Public Key (optional)** - the `public_key` the date that is to be provided to Canvas used to sign the requests ( optional because it could be a one time event )

In order to get the `client_id`, you must first register a `public_key` with Canvas. This means the mechanism should have the ability to CREATE and entry and then UPDATE it later with the `client_id`.

Note: Using the  setup-tool-keys.ts will generate the necessary public and private keys and create a json object that lists all the endpoints and ids that will need to be added from the Canvas registration.

### Creation of a `public_key` and `private_key`

1. An RSA `public_key` and `private_key` key must be generated for the Canvas platform

### Creation of the Developer Key and Client Id in Canvas

#### You must use the public key to create a new Developer Key in Canvas
- You need to configure the appropriate places the tool can launch from
  - Navigation
  - Assignments
- You need to ensure the LTI Advantage features are enabled
  - Rosters
  - Deep Linking
  - Assignments
  - Grades

#### This process generates a `client_id` which will be used later

### Registration of the Platform Client Within the Tool

1. After the `client_id` is generated in Canvas, it must be tracked in the LTI tool along with the associated private key. This generally means that the tool has mechanisms in place to store and retrieve these associations during launches.

### Use the Tool in Canvas

1. Now the tool can be added to a course so that it can be launched
2. The launch will depend on the location of the launch
  - Navigation Launch
  - Assignment Launch
3. The launch role will also be context sensitive

## IMS Global Process Summary

IMS Global has provided a reference implementation and steps to complete the LTI Advantage Tool setup with a platform:

[IMS Global LTI Advantage Tool Setup](https://lti-ri.imsglobal.org/)



