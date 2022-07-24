import { AWSError } from "aws-sdk";
import STS, { AssumeRoleRequest } from "aws-sdk/clients/sts";
import { PromiseResult } from "aws-sdk/lib/request";
import { sts } from "./sts";

export enum RoleName {
    ReadUserData = "ReadUserData"
}

export function assumeRoleInCallerAccount(roleName: RoleName, cognitoSub: string) :  Promise<PromiseResult<STS.AssumeRoleResponse, AWSError>>{            
    return getCallerAccountNum()
        .then(accountNum => assumeRole(roleName, accountNum, cognitoSub));
}

//It's a bit wasteful repeatedly asking for the account number as it won't change across calls
//Non-MVP: Consider statically injecting the account number during Lambda upload.
function getCallerAccountNum() : Promise<string>{
    return sts.getCallerIdentity({}).promise()
        .then(
            ({ Account: accountNum}) => accountNum ?? 
            Promise.reject("Error retrieving account number")
        )
}

function assumeRole(roleName: RoleName, accountNum: string, cognitoSub: string){
    const roleArn = `arn:aws:iam::${accountNum}:role/Lambda/${roleName}`

    const params: AssumeRoleRequest = {
        RoleArn: roleArn,
        RoleSessionName: `assumedRole_${roleName}`,
        // 900s = 15 mins is minimum assume role duration, and also lambda maximum timeout, so makes sense to use this
        DurationSeconds: 900,
        Tags: [{Key:"CognitoUserSub", Value: cognitoSub}]
    };

    return sts.assumeRole(params).promise()
}