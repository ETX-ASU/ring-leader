import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Platform } from "./Platform";
import { getToolConsumerByName, getToolConsumerById } from "../services/ToolConsumerService"

const getRedirectToken = (response: Response, consumerName: string, key: string): string => {
    const toolConsumer = getToolConsumerByName(consumerName);
    if (toolConsumer) {
        const jwtToken = jwt.sign(key, toolConsumer.private_key, {
            algorithm: "RS256",
            expiresIn: 120,
            audience: toolConsumer.name,
            issuer: toolConsumer.uuid
        });
        const jtsToken = jwtToken.substr(0, 40) + toolConsumer.id + jwtToken.substring(72);
        return jtsToken;
    }
    throw Error("unable to find toolConsumer");
}

const validateToken = (token: string): string => {
    const consumerId = token.substr(40, 72);
    const toolConsumer = getToolConsumerById(consumerId);
    const jwttoken = token.substr(0, 40) + token.substring(72);
    if (toolConsumer) {
        const decoded = jwt.verify(jwttoken, toolConsumer.private_key, {
            algorithms: ["RS256"],
            audience: toolConsumer.name,
            issuer: toolConsumer.uuid
        });
        return decoded.toString();
    } else {
        throw Error("Token failed to validate for");
    }
}

export { getRedirectToken, validateToken }

