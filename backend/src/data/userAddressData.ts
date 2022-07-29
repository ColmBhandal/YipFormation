import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { isUserAddressData, UserAddressData } from "../packages/YipStackLib/types/userAddressData"
import { logAndReturnRejectedPromise } from "../packages/YipStackLib/util/misc"
import { assumeTaggedRoleAndNewClient, getAllItemsInParition, TableName } from "../util/ddb"
import { serialize } from "../util/misc"


export function getUserAddressData(cognitoSub: string) : Promise<UserAddressData[]>{    
    const getAllInput = {
        TableName: TableName.UserAddressData,
        primaryKey: cognitoSub
    }

    return assumeTaggedRoleAndNewClient(cognitoSub)
        .then(ddbClient => getAllItemsInParition( ddbClient, getAllInput))
        .then(itemList => getUserAddressDataFromRawResponse(itemList))
        .catch(err => logAndReturnRejectedPromise("Error getting user data: " + serialize(err)))
}

function getUserAddressDataFromRawResponse(itemList: DocumentClient.ItemList){
    return itemList.filter(isUserAddressData)
}