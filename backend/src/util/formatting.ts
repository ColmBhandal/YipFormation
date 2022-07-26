export const formatResponse = function(body: string){
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
  
  export const internalServerErrorResponse = 
  {
      "statusCode": 500,
      "headers": {
        "Content-Type": "text/plain"
      },
      "isBase64Encoded": false,
      "body": "Internal Server Error"
  }