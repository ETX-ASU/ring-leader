import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Platform } from "./Platform";
import { getToolConsumerByName, getToolConsumerById } from "../services/ToolConsumerService"
import ToolConsumer from "../models/ToolConsumer";
import { logger } from "@asu-etx/rl-shared";

const getRedirectToken = (toolConsumer: ToolConsumer, key: string): string => {
    if (toolConsumer) {
        const jwtToken = jwt.sign({
            key: key
        }, toolConsumer.private_key, {
            algorithm: "RS256",
            expiresIn: 120,
            audience: toolConsumer.name,
            issuer: toolConsumer.uuid
        });
        logger.debug(`created token: ${jwtToken}`);
        logger.debug(`consumerid: ${toolConsumer.uuid}`);
        const jtsToken = jwtToken.substr(0, 40) + toolConsumer.uuid + jwtToken.substring(40);
        return jtsToken;
    }
    throw Error("unable to find toolConsumer");
}

const validateTokenWithToolConsumer = (token: string, toolConsumer:ToolConsumer): any => {
    

    const jwttoken = token.substr(0, 40) + token.substring(72);
    logger.debug(`return token: ${jwttoken}`);
    logger.debug(`consumerid from tool: ${toolConsumer?.uuid}`);
    try {
        if (toolConsumer) {
            const decoded : any = jwt.verify(jwttoken, toolConsumer.public_key, {
                algorithms: ["RS256"],
                audience: toolConsumer.name,
                issuer: toolConsumer.uuid
            });
            logger.debug(`decoded object: ${toolConsumer.uuid}`);
            return decoded.key;
        } else {
            throw Error("Token failed to validate for unable to find toolConsumer");
        }
    } catch (error) {
        logger.error("Validation failed:" + JSON.stringify(error));
    };
}

const validateToken = (token: string): any => {
    const consumerId = token.substr(40, 72);
    logger.debug(`found consumerId: ${consumerId}`);
    const toolConsumer = getToolConsumerById(consumerId);
    if(toolConsumer)
        return validateTokenWithToolConsumer(token, toolConsumer);
    return null;
}

export { getRedirectToken, validateToken, validateTokenWithToolConsumer }

