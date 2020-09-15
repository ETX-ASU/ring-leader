# Tool Registration With Canvas

This document discuss the steps required to register an existing LTI 1.3 enabled tool with the Canvas LMS.

## Canvas LTI Tool Setup

1. [Canvas LTI Advantage documentation](https://community.canvaslms.com/t5/Canvas-Releases-Board/Canvas-Release-LTI-1-3-and-LTI-Advantage-2019-06-22/m-p/246652)
2. [How do I configure an LTI Key for an account](https://community.canvaslms.com/t5/Admin-Guide/How-do-I-configure-an-LTI-key-for-an-account/ta-p/140)

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