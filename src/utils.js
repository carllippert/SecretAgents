import tauriConfJson from "../src-tauri/tauri.conf.json";

export const APP_NAME = tauriConfJson.package.productName;
export const RUNNING_IN_TAURI = window.__TAURI__ !== undefined;
export const USERNAME = import.meta.env.VITE_USERNAME;
