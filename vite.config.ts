import babel from "@rolldown/plugin-babel";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    target: "esnext",
  },
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: "./src/server.ts",
        },
      },
    },
  },
  plugins: [
    devtools(),
    lingui(),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    babel({
      plugins: ["@lingui/babel-plugin-lingui-macro"],
    }),
    viteReact(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
  ],
  nitro: {
    preset: "aws-lambda",
    inlineDynamicImports: true,
    awsLambda: {
      streaming: true,
    },
  },
});
