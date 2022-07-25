import { isSimpleProperty, isString, isStringArray } from "./typeGuards"

export type UserData = {
    sub: string,
    data: {
        yipCodes: string[]
    }
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

