import AWS from "aws-sdk";
import { logAndReturnRejectedPromise } from "../packages/YipStackLib/util/misc";
import { assumeTaggedRoleInCallerAccount, RoleName } from "./assumeRole"
import { serialize } from "./misc";

export enum TableName {
    UserData = "UserData"
}

export function assumeTaggedRoleAndNewClient(cognitoSub: string){
    return assumeTaggedRoleInCallerAccount(RoleName.ReadUserData, cognitoSub)
    .then(credentials => new AWS.DynamoDB.DocumentClient({credentials}))
    .catch(err => logAndReturnRejectedPromise("Error assuming role for DynamoDB client: " + serialize(err)))
}

type GetItemRestrictedInput = {
    TableName: TableName
    Key: {
        [key: string]: string
    }
}

export const getItem =  (ddbClient: AWS.DynamoDB.DocumentClient,
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
    .catch(err => logAndReturnRejectedPromise("Error getting item from DynamoDB table: " + serialize(err)))
  }