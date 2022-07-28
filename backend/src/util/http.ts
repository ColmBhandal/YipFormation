import { APIGatewayProxyResult } from "aws-lambda"

export const okResponse = function(body: string): APIGatewayProxyResult{
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers" : "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
      },
      isBase64Encoded: false,
      body: body
    }
    return response
  }
  
export const internalServerErrorResponse: APIGatewayProxyResult = 
{
    statusCode: 500,
    headers: {
      "Content-Type": "text/plain"
    },
    isBase64Encoded: false,
    body: "Internal Server Error"
}