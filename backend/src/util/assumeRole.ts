import {STS} from "aws-sdk"

export function assumeRole(){
    //This is a stub for now
    //TODO: Implement this properly
    var sts = new STS()
    
    console.log("STS Endpoint: " + sts.endpoint.hostname)
}