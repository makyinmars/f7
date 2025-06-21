/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "f7-template",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-east-2",
          profile:
            input.stage === "production"
              ? "developer-production"
              : "developer-dev",
        },
      },
    };
  },
  async run() {
    console.log("PROCESS NODE ENV", process.env.NODE_ENV);
    new sst.aws.TanStackStart("MyWeb", {
      environment: {
        DATABASE_URL: process.env.DATABASE_URL as string,
        VITE_PUBLIC_URL: process.env.VITE_PUBLIC_URL as string,
      },
    });
  },
});
