> **_This project is no longer actively maintained. We do not currently accept contributions._**

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

See https://github.com/ETX-ASU/ring-leader-express for a complete example

The other types of applications follow a similar pattern:

1. create an express application.
2. pass it to an application that populates the endpoints and functionality to support the lti 1.3 and advantage services. The set of endpoints can be found in shared_lib/util/environment.ts and can be adjusted if necessary by setting in .env.

### For an example of a Amplify Application:

See https://github.com/ETX-ASU/boiler

### For an example of a Serverless Express Application

See https://github.com/ETX-ASU/ring-leader-serverless

# How to add an application to a Consumer (Canvas, Blackboard etc.)

To add an appplication you will need administrative persmissions and you will add the following information about the

## Tool to the Consumer:

1.  A name for your tool: Boiler Maker that will show up in admin screens.
2.  A title for your tool: that instructors and potentially students will see.
3.  Redirect uris (these are defaults as part of the built in lti support):
    https://www.yourtool.com/lti-advantage-launch (launches the main application)
    https://www.yourtool.com/assignment (launches the assignment)
    https://www.yourtool.com/deeplink (used to attach the Tool assignment to the Consumer assignment)
4.  Target link: https://www.yourtool.com/lti-advantage-launch
5.  OIDC links (post and get for this library they are the same:) https://www.yourtool.com/init-oidc
6.  A public key (Consumer may want in PEM format or as a JWK) can be generated from scripts.
7.  Then activate the following services:
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

## LTI Advantage Documentation

[Read more about integrating LTI Advantage tools with Canvas](./documentation/CanvasRegistration.md)

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

Note: Using the setup-tool-keys.ts will generate the necessary public and private keys and create a json object that lists all the endpoints and ids that will need to be added from the Canvas registration.

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

## 5. More detail on how to add a new Consumer:

- Make sure that the .env file has been created and is accurate
- When a new consumer (Canvas, Moodle etc) is to be added to the tool, a new tool configuration will need to be created in the tool_consumer.json for that environment and data will need to be inserted from the Consumer and added to the configuration.
- Starting at the project root do the following:

```
   cd /amplify/backend/function/ltilambda/src in a terminal
   yarn setup-tool-keys --name=my-new-consumer
```

    Note: you may need to adjust the script to properly find your tool_consumers.${environment}.json, (make sure you have updated .env with the name of you environment)

- Find the tool_consumers.\${environment}.json file open it you should see an object with the name (my-new-consumer):

  ```
         {
    "name": "my-new-consumer",
    "uuid": "44D20B6A3D8F417C99BAE8F53864DF58",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDkVZaSELGXHOnd\nqpL/087VT3qkO0x4DpngwVB3l0UW/vhoIRGsnobJ3d1nTGbHuxNiv1IQtLsbg7FI\npNaUkuDZJdCY4IBUcT52pi2VEv9TbNKoD2tz9EA1VkC8aEWvCYNwktB6F/OXL4T4\noM1RUabD44UK9SF4lsP6FIRYj/OfqobPYrG05F97ojl9Z3rjcCOeKCSaRzdR9UYh\nxtnnJBHUeTcBt8m1uREgtxs0ncThWdKJtvJEA8jjGe2AtBrwDJ9BFarQl3Nqtf7x\nk8H0Z0+uYwZ8yMhhHHPGNt+759yYevogRndqTSZXWqs4EXW7Lskx50TDn44MnqX7\n6NNyCg6fAgMBAAECggEBAN+9Ji+2f+5M/LSioixghfnrSYeIO6Qg2pOrmYe2CJNC\nAHM4hDMbm4RPDNZdvRDVtWc7hdSs4/NQFfXS4Bjx27WsIjzLL7SOyuBEccHzvZEn\nvzvC8E3M9uXMwN5dZnrf3ZX/pp0cvypT+/4Mw2N9mOW2GfXkwYmCYkK4u/50AAtg\nmY8qk63lYywFzP76G4p/8d1EkV13SQiPF9m1dQGQ0eQI7+kUbises19qILw7IQuj\n9kYVBLSjgtrhRBar7DPABJ60sZxm3ZrdEz70d6IZIDTZA0RfAR9no4W8ihJwUvKA\nxhcGDljlh0+0ZpJ8VPySAHa+QCAf9nIr8VUWFKueyLECgYEA9wOJ+NNXmvqAwYJX\nokebS3oTS0YDlmSgZjs51+j1Gv9w3sJ67E5GfnEkBHcXq+0QKkDcVvDWMtidDIdk\nO9xaKHQs1wThNoeVLNmdHZn6ln2bIy7JLKzpx+qqzo9R4ZaGuEWgO1rzUaKXCgX/\ncS38V5bf0lLJraXERQWIPEFtNhsCgYEA7KQV4OUV53nElsbV24pRL/Lxbllzr9pU\n7cUnxAozACgvoItw2c1aW4Vys9oLED6tpSatW5NPjWu3VPJ0jxYzINmtPrkgEb9L\nqIfzfYoHC2YM7J6SKLfKaCF8Ewcm24L4xoXjtS35nyvpVxGLqVrF2XsUPW+RQpAY\nUl41wOOY4c0CgYEAz0D85vYMr1A38CU4+kQynKWUwrfAEtPjcWOIKQyhe0GQppdv\nJA6ZP0YW/lgeWHbT9V/ugFQapRbyzqxbAY7lZsPzS4YgoOwp0jPUjB3CD7rcDC0Z\nRo7eqIrRPfcqsKjn6H0i8Cpjtb9CE3rs1T3MWIGS0pn79eL8Rx1ZLZWH2LkCgYA3\nS7hZDu7pYgjP+rJqVI3YGHrWAE0KIIiL7u/13TRBqyJF7491NYkRrcM5x4+iQiMt\nXjZQGcITF8KFNQqLjPJxkKvs5jFaNEsnnG0HPsOapEQM3pjkrt27K2fkwl0QGjCr\nowmsgou75/TkhZMPBckJorr+CB33YdhtFtqUsho9WQKBgQCm3gudrfSi6MFuAyHQ\nyFoNINo4Zn/7j/Cf90DjJjswB/D1nFZFaXGZSMDsnJge4MYfqvqjvZeFFOTx4M7Z\nLQCOZCSylOGSj5x65v5qU7YawrFZtX9fnnb0d2DDioYwxCVEKcBDJDKPKkPaYW9H\nhkbr1aZ3BxDEV4BDHQfQC8AvHw==\n-----END PRIVATE KEY-----\n",
    "public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5FWWkhCxlxzp3aqS/9PO\n1U96pDtMeA6Z4MFQd5dFFv74aCERrJ6Gyd3dZ0xmx7sTYr9SELS7G4OxSKTWlJLg\n2SXQmOCAVHE+dqYtlRL/U2zSqA9rc/RANVZAvGhFrwmDcJLQehfzly+E+KDNUVGm\nw+OFCvUheJbD+hSEWI/zn6qGz2KxtORfe6I5fWd643Ajnigkmkc3UfVGIcbZ5yQR\n1Hk3AbfJtbkRILcbNJ3E4VnSibbyRAPI4xntgLQa8AyfQRWq0JdzarX+8ZPB9GdP\nrmMGfMjIYRxzxjbfu+fcmHr6IEZ3ak0mV1qrOBF1uy7JMedEw5+ODJ6l++jTcgoO\nnwIDAQAB\n-----END PUBLIC KEY-----\n",
    "public_key_jwk": {
         "kty": "RSA",
         "n": "5FWWkhCxlxzp3aqS_9PO1U96pDtMeA6Z4MFQd5dFFv74aCERrJ6Gyd3dZ0xmx7sTYr9SELS7G4OxSKTWlJLg2SXQmOCAVHE-dqYtlRL_U2zSqA9rc_RANVZAvGhFrwmDcJLQehfzly-E-KDNUVGmw-OFCvUheJbD-hSEWI_zn6qGz2KxtORfe6I5fWd643Ajnigkmkc3UfVGIcbZ5yQR1Hk3AbfJtbkRILcbNJ3E4VnSibbyRAPI4xntgLQa8AyfQRWq0JdzarX-8ZPB9GdPrmMGfMjIYRxzxjbfu-fcmHr6IEZ3ak0mV1qrOBF1uy7JMedEw5-ODJ6l--jTcgoOnw",
         "e": "AQAB",
         "alg": "RS256",
         "use": "sig",
         "kid": "my-new-consumer:44D20B6A3D8F417C99BAE8F53864DF58"
    },
    "alg": "RS256",
    "keyid": "my-new-consumer:44D20B6A3D8F417C99BAE8F53864DF58",
    "client_id": "client_id supplied by consumer/platform",
    "iss": "iss supplied by consumer/platform",
    "deployment_id": "deployment_id supplied by consumer/platform"
    "platformOIDCAuthEndPoint": "client_id supplied by consumer/platform",
    "platformAccessTokenEndpoint": "platformAccessTokenEndpoint supplied by consumer/platform",
    "platformPublicJWKEndpoint": "not required: one or the other of platformPublicKey/platformPublicJWKEndpoint",
    "platformPublicKey": "not required: one or the other of platformPublicKey/platformPublicJWKEndpoint"
    }
  ```

You will need to fill in all the values where it says "supplied by consumer/platform" from documentation supplied by the consumer and or generated as part of the installation process. And add platformPublicJWKEndpoint or platformPublicKey (platformPublicJWKEndpoint is preferred. Set the one not filled to an empty string)

## Example Information You Will need for the Consumer/Platform

REPLACE: https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage with the actual root/base url of the Tool instance.

1. Tool End-Point to Receive Launches
   (Note: this is the target_link_url that the cert suite will send in OIDC initiation.)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/lti-advantage-launch

2. OIDC Login Initiation URL
   (Note: this is your tool's OIDC initiation URI.)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/init-oidc

3. Tool OIDC Launch Redirect URL
   (Note: this should be the REGISTERED URL for your Tool. The cert suite POSTs launches here!)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/lti-advantage-launch

4. Tool End-Point to Receive Deep Link Launches
   (Note: this is the target_link_url that the cert suite will send in OIDC initiation for Deep Linking.)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/deeplink

5. Tool OIDC Redirect Deep Linking URL
   (Note: this is the REGISTERED URL in OIDC for your Tool's Deep Linking. The cert suite POSTs launches here!)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/deeplink

6. Tool PUBLIC JWKS
   You can either either supply IMS with a public key in PEM format or JWT OR you can give them the url that will send a list of public jwk keys:
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/jwks
