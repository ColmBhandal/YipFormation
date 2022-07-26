import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { assumeTaggedRoleAndNewClient, getItem, TableName } from "./ddb"
import { logAndReturnRejectedPromise, serialize } from "./misc"
import { isSimpleProperty, isString, isStringArray } from "./typeGuards"

export type UserData = {
    sub: string,
    data: {
        yipCodes: string[]
    }
}

export function getUserData(cognitoSub: string) : Promise<UserData>{    
    const getInput = {
        TableName: TableName.UserData,
        Key: {
            sub: cognitoSub
        }
    }

    return assumeTaggedRoleAndNewClient(cognitoSub)
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

export function isUserData(obj: any): obj is UserData{
    if(!obj){
        return false
    }
    if(!isSimpleProperty(obj, "sub") || !isString(obj.sub)){
        return false
    }
    if(!isSimpleProperty(obj, "data")){
        return false
    }
    const data = obj.data
    if(!data.yipCodes || !isStringArray(data.yipCodes)){
        return false
    }
    return true
}
