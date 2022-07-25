import AWS from "aws-sdk";
import { assumeTaggedRoleInCallerAccount, RoleName } from "./assumeRole"
import { logAndReturnRejectedPromise } from "./misc";

export enum TableName {
    UserData = "UserData"
}

export function getUserData(cognitoSub: string){    
    const getInput = {
        TableName: TableName.UserData,
        Key: {
            sub: cognitoSub
        }
    }

    return assumeTaggedRoleAndNewClient(cognitoSub)
        .then(ddbClient => getItem(ddbClient, getInput))
}

function assumeTaggedRoleAndNewClient(cognitoSub: string){
    return assumeTaggedRoleInCallerAccount(RoleName.ReadUserData, cognitoSub)
    .then(credentials => new AWS.DynamoDB.DocumentClient(credentials))
}

type GetItemRestrictedInput = {
    TableName: TableName
    Key: {
        [key: string]: string
    }
}

const getItem =  (ddbClient: AWS.DynamoDB.DocumentClient,
    input: GetItemRestrictedInput
  ) => {

    return new Promise<AWS.DynamoDB.DocumentClient.GetItemOutput>((resolve, reject) => {
      ddbClient.get(input, (err, result) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
    .then(output => output.Item ?? logAndReturnRejectedPromise("No item found during DynamoDB get"))
    .then(item => AWS.DynamoDB.Converter.unmarshall(item))
  }