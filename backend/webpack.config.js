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

    // AWS recommends always including the aws-sdk packages in your Lambda package, even though the SDK is always available in the lambda runtime.
    // However, adding these packages to the externals list causes them to be excluded from webpack and significantly reduces the bundle size
    externals: ["aws-sdk", "@aws-sdk/client-sts"],

    mode: process.env.NODE_ENV || "production",

    module: {
        rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
    },

    plugins: [awsSamPlugin],
};