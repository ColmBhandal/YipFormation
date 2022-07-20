import { AssumeRoleCommand } from "@aws-sdk/client-sts";
import { sts, stsClient } from "./sts";

export enum RoleName {
    ReadUserData = "ReadUserData"
}

export function assumeRoleInCallerAccount(roleName: RoleName) : Promise<void>{        
    

    return getCallerAccountNum()
        .then(accountNum => assumeRole(roleName, accountNum));
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

function assumeRole(roleName: RoleName, accountNum: string){
    const roleArn = `arn:aws:iam::${accountNum}:role/Lambda/${roleName}`

    const params = {
        RoleArn: roleArn,
        RoleSessionName: `assumedRole_${roleName}`,
        //Non-MVP: Think about tweaking duration or allowing it to be changed.
        //For now, fixed duration of a few seconds for each lambda seesm reasonable
        //We don't expect lambdas to take very long at all
        DurationSeconds: 5,
    };

    stsClient.send(new AssumeRoleCommand(params))
}