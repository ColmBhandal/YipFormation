import AWS from "aws-sdk";
import { AssumeRoleRequest } from "aws-sdk/clients/sts";
import { logAndReturnRejectedPromise } from "../packages/YipStackLib/util/misc";
import { serialize } from "./misc";
import { sts } from "./sts";

export enum RoleName {
    ReadUserData = "ReadUserData"
}

export function assumeTaggedRoleInCallerAccount(roleName: RoleName, cognitoSub: string){            
    return getCallerAccountNum()
        .then(accountNum => assumeTaggedRole(roleName, accountNum, cognitoSub))
        .then(response => response.Credentials ?? Promise.reject("Error getting STS credentials"))
        .then(stsCredentials => stsToAwsCredentials(stsCredentials))
        .catch(err => logAndReturnRejectedPromise("Error assuming role in caller account: " + serialize(err)))
}

function stsToAwsCredentials(stsCredentials: AWS.STS.Credentials) : AWS.Credentials{
    return new AWS.Credentials({
        accessKeyId: stsCredentials.AccessKeyId,
        secretAccessKey: stsCredentials.SecretAccessKey,
        sessionToken: stsCredentials.SessionToken,
      });
}

//It's a bit wasteful repeatedly asking for the account number as it won't change across calls
//Non-MVP: Consider statically injecting the account number during Lambda upload.
function getCallerAccountNum() : Promise<string>{
    return sts.getCallerIdentity({}).promise()
        .then(
            ({ Account: accountNum}) => accountNum ?? 
            Promise.reject("Error retrieving account number")
        )
        .catch(err => logAndReturnRejectedPromise("Error getting caller's account number: " + serialize(err)))
}

function assumeTaggedRole(roleName: RoleName, accountNum: string, cognitoSub: string){
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