import babel from "@rolldown/plugin-babel";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

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
  plugins: [
    ...nitro({
      preset: "aws-lambda",
      awsLambda: {
        streaming: false,
      },
    }),
    ...lingui(),
    tailwindcss(),
    ...tanstackStart(),
    babel({
      plugins: ["@lingui/babel-plugin-lingui-macro"],
    }),
    ...viteReact(),
  ],
});
