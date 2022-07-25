import AWS from "aws-sdk";

export enum TableName {
    UserData = "UserData"
}

const ddbClient = new AWS.DynamoDB.DocumentClient();

export function getUserData(cognitoSub: string){
    return getItem({
        TableName: TableName.UserData,
        Key: {
            sub: cognitoSub
        }
    })
}

type GetItemRestrictedInput = {
    TableName: TableName
    Key: {
        [key: string]: string
    }
}

const getItem =  (
    input: GetItemRestrictedInput
  ): Promise<AWS.DynamoDB.DocumentClient.GetItemOutput> => {

    return new Promise((resolve, reject) => {
      ddbClient.get(input, (err, result) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }