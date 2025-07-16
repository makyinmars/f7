import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  inlineDynamicImports: true,
  preset: "aws-lambda",
  awsLambda: {},
});
