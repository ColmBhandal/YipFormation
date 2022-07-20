import {STS} from "aws-sdk"
import { STSClient } from  "@aws-sdk/client-sts";

export const sts = new STS()


//Non-MVP: Should we be setting the region during build rather than hard-coding?
const REGION = "us-east-1"
const stsClient = new STSClient({ region: REGION });
export { stsClient };