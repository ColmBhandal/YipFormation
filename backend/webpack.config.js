const path = require("path");
const AwsSamPlugin = require("aws-sam-webpack-plugin");

const awsSamPlugin = new AwsSamPlugin({outFile: "index"});

module.exports = {

    devtool: false,
    
    entry: () => awsSamPlugin.entry(),

    output: {
        filename: (chunkData) => awsSamPlugin.filename(chunkData),
        libraryTarget: "commonjs2",
        path: path.resolve("."),
    },

    // Non-MVP: Investigate do we want this
    //devtool: "source-map",

    // Try to resolve to a TS file first, if not, try a JS file.
    // We can't only support TS here, because webpack needs to pack not just the code in this project, but also all dependencies
    // The dependencies are out of our control and may include JS, rather than TS, files    
    resolve: {
        extensions: [".ts", ".js"],
    },

    target: "node",

    // The aws-sdk seems to be part of the lambda runtime already, so there is no need to bundle it into each lambda
    // This makes a massive difference to the bundles lambda's size
    // Note: the aws sdk seems to be available to both sam local invoke and the lambda runtime in the AWS cloud
    // The README for aws-sam-webpack-plugin stated that the AWS SDK would not be available to sam local invoke, perhaps it was outdated
    externals: ["aws-sdk"],

    mode: process.env.NODE_ENV || "production",

    module: {
        rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
    },

    plugins: [awsSamPlugin],
};