import { APIGatewayProxyWithCognitoAuthorizerHandler } from "aws-lambda"
import { extractSub } from "../../util/cognito"
import { getUserData } from "../../util/ddb"
import { logAndReturnRejectedPromise } from "../../util/misc"

export const handler: APIGatewayProxyWithCognitoAuthorizerHandler = async (event, context) => {     
  console.log('## FUNCTION NAME: ' + serialize(context.functionName))
  console.log('## EVENT PATH: ' + serialize(event.path))  
  const cognitoSub = extractSub(event)  
  if(!!cognitoSub){
    await getTransformedUserData(cognitoSub)
  }
  return internalServerErrorResponse
}

function getTransformedUserData(cognitoSub: string){
  return getUserData(cognitoSub)
  .then(data => data.Item ?? logAndReturnRejectedPromise("No user data item found"))
  .then(userDataAttMap => getYipcodesFromAttMap(userDataAttMap))
}

function getYipcodesFromAttMap(userDataAttMap: AWS.DynamoDB.DocumentClient.AttributeMap){
      //TODO: Use type guard to convert attribute map into object with known properties
      console.log(formatResponse(serialize(userDataAttMap)))
      throw new Error("Unmarshalling DDB Read not yet implemented")
      //return formatResponse(serialize({yipCodes: yipCodes}))
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