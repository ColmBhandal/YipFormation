import { APIGatewayProxyWithCognitoAuthorizerEvent } from "aws-lambda";

export function extractSub (event: APIGatewayProxyWithCognitoAuthorizerEvent) : string | undefined {
    return event.requestContext.authorizer.claims['sub']
}