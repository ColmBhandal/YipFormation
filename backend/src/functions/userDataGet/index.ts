import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda"
import { extractSub } from "../../util/cognito"
import { formatResponse, internalServerErrorResponse } from "../../util/formatting"
import { serialize } from "../../util/misc"
import { getUserData } from "../../util/userData"

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = async (event, context) => {     
  console.log('## FUNCTION NAME: ' + serialize(context.functionName))
  console.log('## EVENT PATH: ' + serialize(event.path))  
  const cognitoSub = extractSub(event)
  if(!!cognitoSub){
    const rawResponse = await getUserData(cognitoSub)
    if(!!rawResponse){
      return formatResponse(serialize(rawResponse))
    }
    console.error("Error retrieving user data")
    return internalServerErrorResponse
  }
  console.error("No Cognito SUB")
  return internalServerErrorResponse
}