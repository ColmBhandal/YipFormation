import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda"
import { extractSub } from "../../util/cognito"
import { getUserData } from "../../util/ddb"
import { formatResponse, internalServerErrorResponse } from "../../util/formatting"
import { serialize } from "../../util/misc"
import { isUserData } from "../../util/userData"

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = async (event, context) => {     
  console.log('## FUNCTION NAME: ' + serialize(context.functionName))
  console.log('## EVENT PATH: ' + serialize(event.path))  
  const cognitoSub = extractSub(event)
  if(!!cognitoSub){
    const rawResponse = await getUserData(cognitoSub)
    return getFormattedYipcodeResponse(rawResponse)
  }
  console.error("No Cognito SUB")
  return internalServerErrorResponse
}

function getFormattedYipcodeResponse(rawResponse: any){
  if(isUserData(rawResponse)){
    const yipCodes = rawResponse.data.yipCodes
    const serialized = serialize(yipCodes)
    console.log("Returning YipCodes: " + yipCodes)
    return formatResponse(serialized)
  }
  console.error("Invalid DB response format - expected UserData")
  return internalServerErrorResponse
}