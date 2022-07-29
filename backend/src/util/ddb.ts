import AWS from "aws-sdk";
import { logAndReturnRejectedPromise } from "../packages/YipStackLib/util/misc";
import { assumeTaggedRoleInCallerAccount, RoleName } from "./assumeRole"
import { serialize } from "../packages/YipStackLib/util/misc";

export enum TableName {
    UserData = "UserData",
    UserAddressData = "UserAddressData"
}

export enum PrimaryKeyAttName {
  Sub = "sub"
}

export function assumeTaggedRoleAndNewClient(cognitoSub: string, roleName: RoleName){
    return assumeTaggedRoleInCallerAccount(roleName, cognitoSub)
    .then(credentials => new AWS.DynamoDB.DocumentClient({credentials}))
    .catch(err => logAndReturnRejectedPromise("Error assuming role for DynamoDB client: " + serialize(err)))
}

type GetItemRestrictedInput = {
    TableName: TableName
    Key: {
        [key: string]: string
    }
}

export function getItem(ddbClient: AWS.DynamoDB.DocumentClient, input: GetItemRestrictedInput){
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

type GetAllPartitionItemsInput = {
  TableName: TableName,
  primaryKey: string
}


/**
 * WARNING: Do not use this function if the data in a partition might exceed 1MB. 
 * This function uses a single DynamoDB query under the hood, and the limit on the return size is 1MB.
 * @param ddbClient DynamoDB client
 * @param input DynamoDB table & partition key
 * @returns All items in the partition of the given table corresponding to the given parition key
 */
export function getAllItemsInParition(ddbClient: AWS.DynamoDB.DocumentClient, input: GetAllPartitionItemsInput,
  primaryKeyAttName: PrimaryKeyAttName){
  
  const queryParams : AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: input.TableName,
    KeyConditionExpression: `#pk = :pk`,
    ExpressionAttributeNames: { '#pk': primaryKeyAttName},
    ExpressionAttributeValues: { ':pk': input.primaryKey}
  };
  
  return new Promise<AWS.DynamoDB.DocumentClient.QueryOutput>((resolve, reject) => {
    ddbClient.query(queryParams, (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
  .then(output => output.Items ?? logAndReturnRejectedPromise("No item found during DynamoDB get"))
  .catch(err => logAndReturnRejectedPromise("Error getting item from DynamoDB table: " + serialize(err)))
}