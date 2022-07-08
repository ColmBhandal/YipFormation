exports.handler = async (event, context) => {
  console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
  console.log('## CONTEXT: ' + serialize(context))
  console.log('## EVENT: ' + serialize(event))
  try {
    return formatResponse(serialize({yipCodes: ["Yc1", "Yc2", "Yc3"]}))
  } catch(error) {
    return formatError(error)
  }
}

const formatResponse = function(body){
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

const formatError = function(error){
  const response = {
    "statusCode": error.statusCode,
    "headers": {
      "Content-Type": "text/plain"
    },
    "isBase64Encoded": false,
    "body": error.code + ": " + error.message
  }
  return response
}

const serialize = function(object) {
  return JSON.stringify(object)
}