import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda"
import { assumeRoleInCallerAccount, RoleName } from "../../util/assumeRole"

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = async (event, context) => {   
  const tempCredentials = await assumeRoleInCallerAccount(RoleName.ReadUserData)
  console.log("Credentials expiration: " + tempCredentials.Credentials?.Expiration)
  console.log('## FUNCTION NAME: ' + serialize(context.functionName))
  console.log('## EVENT PATH: ' + serialize(event.path))  
  try {
    return formatResponse(serialize({yipCodes: ["Yc1", "Yc2", "Yc3"]}))
  } catch(error) {
    return internalServerErrorResponse
  }
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