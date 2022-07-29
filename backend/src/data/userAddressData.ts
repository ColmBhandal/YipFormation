import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { isUserAddressData, UserAddressData } from "../packages/YipStackLib/types/userAddressData"
import { logAndReturnRejectedPromise } from "../packages/YipStackLib/util/misc"
import { assumeTaggedRoleAndNewClient, getAllItemsInParition, PrimaryKeyAttName, TableName } from "../util/ddb"
import { serialize } from "../packages/YipStackLib/util/misc"
import { RoleName } from "../util/assumeRole"


export function getUserAddressData(cognitoSub: string) : Promise<UserAddressData[]>{    
    const getAllInput = {
        TableName: TableName.UserAddressData,
        primaryKey: cognitoSub
    }

    return assumeTaggedRoleAndNewClient(cognitoSub, RoleName.ReadUserAddressData)
        .then(ddbClient => getAllItemsInParition(ddbClient, getAllInput, PrimaryKeyAttName.Sub))
        .then(itemList => getUserAddressDataFromRawResponse(itemList))
        .catch(err => logAndReturnRejectedPromise("Error getting user data: " + serialize(err)))
}

function getUserAddressDataFromRawResponse(itemList: DocumentClient.ItemList){
    return itemList.filter(isUserAddressData)
}