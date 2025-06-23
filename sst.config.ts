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
    new sst.x.DevCommand("Studio", {
      dev: {
        autostart: true,
        command: "bun drizzle-kit studio",
      },
    });

    new sst.aws.TanStackStart("MyWeb", {
      environment: {
        DATABASE_URL: process.env.DATABASE_URL as string,
        VITE_PUBLIC_URL: process.env.VITE_PUBLIC_URL as string,
        PUBLIC_URL: process.env.PUBLIC_URL as string,
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    });
  },
});
