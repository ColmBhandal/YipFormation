import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda"
import { extractSub } from "../../util/cognito"
import { getUserData } from "../../util/ddb"
import { isUserData } from "../../util/userData"

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = async (event, context) => {     
  console.log('## FUNCTION NAME: ' + serialize(context.functionName))
  console.log('## EVENT PATH: ' + serialize(event.path))  
  const cognitoSub = extractSub(event)
  if(!!cognitoSub){
    const rawResponse = await getUserData(cognitoSub)
    return getFormattedYipcodeResponse(rawResponse)
  }
  return internalServerErrorResponse
}

function getFormattedYipcodeResponse(rawResponse: any){
  if(isUserData(rawResponse)){
    return formatResponse(serialize(rawResponse.data.yipCodes))
  }
  return internalServerErrorResponse
}

const formatResponse = function(body: string){
  const response = {
    "statusCode": 200,
    "headers": {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET"
    },
    "isBase64Encoded": false,
    "body": body
  }
  return response
}

const internalServerErrorResponse = 
{
    "statusCode": 500,
    "headers": {
      "Content-Type": "text/plain"
    },
    "isBase64Encoded": false,
    "body": "Internal Server Error"
}

const serialize = function(obj: any) {
  return JSON.stringify(obj)
}