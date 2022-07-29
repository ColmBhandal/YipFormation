import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { isUserData, UserData } from "../packages/YipStackLib/types/userData"
import { logAndReturnRejectedPromise } from "../packages/YipStackLib/util/misc"
import { assumeTaggedRoleAndNewClient, getItem, TableName } from "../util/ddb"
import { serialize } from "../packages/YipStackLib/util/misc"
import { RoleName } from "../util/assumeRole"

export function getUserData(cognitoSub: string) : Promise<UserData>{    
    const getInput = {
        TableName: TableName.UserData,
        Key: {
            sub: cognitoSub
        }
    }

    return assumeTaggedRoleAndNewClient(cognitoSub, RoleName.ReadUserData)
        .then(ddbClient => getItem(ddbClient, getInput))
        .then(attMap => getUserDataFromRawResponse(attMap))
        .catch(err => logAndReturnRejectedPromise("Error getting user data: " + serialize(err)))
}

function getUserDataFromRawResponse(attMap: DocumentClient.AttributeMap) : UserData{
    if(isUserData(attMap)){
        return attMap
    }
    throw new Error("Non-user data cannot be converted to user data")
}
