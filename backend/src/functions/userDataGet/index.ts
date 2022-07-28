import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda"
import { okResponse, internalServerErrorResponse } from "../../util/http"
import { runWithCognitoSub } from "../../util/lambda"
import { serialize } from "../../util/misc"
import { getUserData } from "../../util/userData"

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = runWithCognitoSub(getUserDataFromSub)

async function getUserDataFromSub(cognitoSub: string){
  const rawResponse = await getUserData(cognitoSub)
  if(!!rawResponse){
    return okResponse(serialize(rawResponse))
  }
  console.error("Error retrieving user data")
  return internalServerErrorResponse
}