import { APIGatewayProxyResult, APIGatewayProxyWithCognitoAuthorizerEvent, APIGatewayProxyWithCognitoAuthorizerHandler, Context } from "aws-lambda";
import { extractSub } from "./cognito";
import { internalServerErrorResponse } from "./http";
import { serialize } from "../packages/YipStackLib/util/misc";

export function runWithCognitoSub(subProcessor: (cognitoSub: string) => Promise<APIGatewayProxyResult>)
    : APIGatewayProxyWithCognitoAuthorizerHandler
    {
    return async (event: APIGatewayProxyWithCognitoAuthorizerEvent, context: Context) => {         
        logStandardFunctionParameters(event, context)
        const cognitoSub = extractSub(event)
        if(!!cognitoSub){
            return await subProcessor(cognitoSub)
        }
        console.error("No Cognito SUB")
        return internalServerErrorResponse
    }
}
    

export function logStandardFunctionParameters(event: APIGatewayProxyWithCognitoAuthorizerEvent, context: Context) : void{
    console.log('## FUNCTION NAME: ' + serialize(context.functionName))
    console.log('## EVENT PATH: ' + serialize(event.path))
}