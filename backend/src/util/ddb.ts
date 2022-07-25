import AWS from "aws-sdk";

export enum TableName {
    UserData = "UserData"
}

export function getUserData(cognitoSub: string, credentials: AWS.Credentials){
    
    const ddbClient = new AWS.DynamoDB.DocumentClient({credentials});
    return getItem(
        ddbClient,
        {
            TableName: TableName.UserData,
            Key: {
                sub: cognitoSub
            }
        }
    )
}

type GetItemRestrictedInput = {
    TableName: TableName
    Key: {
        [key: string]: string
    }
}

const getItem =  (ddbClient: AWS.DynamoDB.DocumentClient,
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