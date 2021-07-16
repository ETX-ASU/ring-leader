import { Response } from "express";
import jwt from "jsonwebtoken";
import { getToolConsumerById } from "../services/ToolConsumerService"
import ToolConsumer from "../database/entity/ToolConsumer";
import { logger, JWK_CACHE_TOKEN_EXPIRY } from "@asu-etx/rl-shared";

const setResponseAuthorization = (response: Response, toolConsumer: ToolConsumer, key: string): void => {
  const jwtToken = getRedirectToken(toolConsumer, key);
  //logger.debug(`set authorization header: ${jwtToken}`);
  response.setHeader("Authorization", "Bearer " + jwtToken);
}

const getRedirectToken = (toolConsumer: ToolConsumer, key: string): string => {
  if (toolConsumer) {
    const jwtToken = jwt.sign({
      key: key
    }, toolConsumer.private_key, {
      algorithm: "RS256",
      expiresIn: JWK_CACHE_TOKEN_EXPIRY,
      audience: toolConsumer.uuid,
      issuer: toolConsumer.iss
    });
    //logger.debug(`created token: ${jwtToken}`);
    //.debug(`consumerid: ${toolConsumer.uuid}`);
    return jwtToken.substr(0, 40) + toolConsumer.uuid + jwtToken.substring(40);
  }
  throw Error("unable to find toolConsumer");
}

const validateTokenWithToolConsumer = (token: string, toolConsumer: ToolConsumer): any => {
  const jwttoken = token.substr(0, 40) + token.substring(72);
  //logger.debug(`return token: ${jwttoken}`);
  //logger.debug(`consumerid from tool: ${toolConsumer?.uuid}`);
  try {
    if (toolConsumer) {
      const decoded: any = jwt.verify(jwttoken, toolConsumer.public_key, {
        algorithms: ["RS256"],
        audience: toolConsumer.uuid,
        issuer: toolConsumer.iss
      });
      //logger.debug(`decoded object: ${toolConsumer.uuid}`);
      return decoded.key;
    } else {
      throw Error("Token failed to validate for unable to find toolConsumer");
    }
  } catch (error) {
    logger.error("Validation failed:" + JSON.stringify(error));
  };
}


const validateRequest = (request: any): string => {
  const authorization = request.get('authorization');
  logger.debug(`found authorization: ${authorization}`);
  logger.debug(`request.query: ${JSON.stringify(request.query)}`);
  logger.debug(`request.body: ${JSON.stringify(request.body)}`);
  if (authorization && authorization.split(' ')[0] === 'Bearer')
    return validateToken(authorization.split(' ')[1]);
  else if (request.query && request.query.hash) {
    const hash: string = request.query.hash;
    return validateToken(hash);
  }
  else if (request.body.hash) {
    const hash: string = request.body.hash;
    return validateToken(hash);
  }
  throw Error("no authorization header found");

}

const validateToken = (token: string): any => {
  const consumerId = token.substr(40, 32);
  //logger.debug(`found consumerId: ${consumerId}`);
  const toolConsumer = getToolConsumerById(consumerId);
  if (toolConsumer) {
    const key = validateTokenWithToolConsumer(token, toolConsumer);
    return key;
  }
  logger.error("Validation failed: unable to find key: for consumerId:" + consumerId);
}


export {
  getRedirectToken, validateToken,
  validateTokenWithToolConsumer,
  setResponseAuthorization,
  validateRequest
};
