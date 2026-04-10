import defaultConfig from "./config.default";

declare const __APP_CONFIG_: typeof defaultConfig;
const config = __APP_CONFIG_;

declare const __MODE_: string;
const mode = __MODE_;

console.log("🔥 app loaded with config: ", config);

export { mode };
export default config;
