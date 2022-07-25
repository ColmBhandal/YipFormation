import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda"
import { assumeRoleInCallerAccount, RoleName } from "../../util/assumeRole"
import { extractSub } from "../../util/cognito"
import { getUserData } from "../../util/ddb"

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = async (event, context) => {     
  console.log('## FUNCTION NAME: ' + serialize(context.functionName))
  console.log('## EVENT PATH: ' + serialize(event.path))  
  const cognitoSub = extractSub(event)
  if(!!cognitoSub){
    const tempCredentials = await assumeRoleInCallerAccount(RoleName.ReadUserData, cognitoSub)
    console.log("Credentials expiration: " + tempCredentials.Credentials?.Expiration)
    //TODO: Will somehow need to pass credentials or else this will fail
    const userDataAttMap = (await getUserData(cognitoSub)).Item
    if(!!userDataAttMap){
      //TODO: Use type guard to convert attribute map into object with known properties
      console.log(userDataAttMap)
      throw new Error("Unmarshalling DDB Read not yet implemented")
      //return formatResponse(serialize({yipCodes: yipCodes}))
    }    
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