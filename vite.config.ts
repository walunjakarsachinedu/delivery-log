import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import deepmerge from "deepmerge";
import fs from "fs";

export default defineConfig(async ({ mode }) => {
  return {
    plugins: [react()],
    define: {
      __APP_CONFIG_: JSON.stringify(await extractConfig(mode)),
      __MODE_: JSON.stringify(mode)
    },
    resolve: {
      tsconfigPaths: true,
    },
  };
});

async function extractConfig(mode: string) {
  const configDir = path.resolve(__dirname, "src/config");

  // Validate mode by checking for corresponding config files
  const availableModes = fs
    .readdirSync(configDir)
    .filter((file) => /^config\..+\.ts$/.test(file))
    .map((file) => file.replace(/^config\.(.+)\.ts$/, "$1"));

  if (!availableModes.includes(mode) && mode !== "development") {
    throw new Error(
      `Invalid mode: "${mode}". Supported modes: ${availableModes.join(", ")}`
    );
  }

  if (mode == "development") mode = "default";

  // Dynamically import default and environment-specific configs
  const defaultConfig = (await import(__dirname + `/src/config/config.default.ts`))
    .default;
  const envConfig = (await import(__dirname + `/src/config/config.${mode}.ts`)).default;

  const finalConfig = deepmerge(defaultConfig, envConfig);

  return finalConfig;
}
