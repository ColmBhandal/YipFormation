import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda"
import { getUserAddressData } from "../../data/userAddressData"
import { okResponse, internalServerErrorResponse } from "../../util/http"
import { runWithCognitoSub } from "../../util/lambda"
import { serialize } from "../../util/misc"

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = runWithCognitoSub(getUserAddressDataFromSub)

async function getUserAddressDataFromSub(cognitoSub: string){
  const rawResponse = await getUserAddressData(cognitoSub)
  if(!!rawResponse){
    return okResponse(serialize(rawResponse))
  }
  console.error("Error retrieving user's address data")
  return internalServerErrorResponse
}