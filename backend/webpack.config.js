const path = require("path");
const AwsSamPlugin = require("aws-sam-webpack-plugin");

const awsSamPlugin = new AwsSamPlugin({outFile: "index"});

module.exports = {
    
    entry: () => awsSamPlugin.entry(),
    
    output: {
        filename: (chunkData) => awsSamPlugin.filename(chunkData),
        libraryTarget: "commonjs2",
        path: path.resolve("."),
    },

    // Non-MVP: Investigate do we want this
    //devtool: "source-map",

    // An imported "foo" missing an extension should resolve to "foo.ts"
    resolve: {
        extensions: [".ts"],
    },

    target: "node",

    // AWS recommends always including the aws-sdk in your Lambda package, even though the SDK is always available in the lambda runtime.
    // They recommend this so that you have predictable functionality e.g. they may tweak SDK in the runtime & your code may break.
    // However, excluding the SDK can decrease deployment package size & maybe even lambda cold start lag. So it's a trade-off.
    // In the below, the SDK is disabled - so we're relying on the SDK in the Lambda runtime.
    // Howeever, the SDK has been included conditionally for DEV because the node10.x docker image used by SAM local doesn't include it.
    // TODO: Figure out how to prevent deploying a DEV build (which includes the clunky AWS SDK) to AWS... maybe there's a pre-deploy hook?
    // TODO: (continued) Another option would be to target different dirs for LOCAL vs. OTHER builds - send LOCAL builds to a non-standard folder
    externals: process.env.NODE_ENV === "development" ? [] : ["aws-sdk"],

    mode: process.env.NODE_ENV || "production",

    module: {
        rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
    },

    plugins: [awsSamPlugin],
};