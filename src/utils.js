import tauriConfJson from "../src-tauri/tauri.conf.json";

export const APP_NAME = tauriConfJson.package.productName;
export const RUNNING_IN_TAURI = window.__TAURI__ !== undefined;
export const USERNAME = import.meta.env.VITE_USERNAME;

export const formatPushDIDForFrontEnd = (address) => {
  return `${address.slice(7, 12)}...${address.slice(-4)}`;
};

export const formatEtherAddressFromPushDID = (did) => {
  const addressRegex = /^eip155:(0x[a-fA-F0-9]{40})$/;
  const match = did.match(addressRegex);
  return match ? match[1] : null;
};
