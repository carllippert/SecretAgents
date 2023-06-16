import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import tauriConfJson from "../../src-tauri/tauri.conf.json";
import { APP_NAME, RUNNING_IN_TAURI } from "../utils";
import { useTauriContext } from "./TauriProvider";
// import { usePolybase, useDocument, useCollection } from "@polybase/react";
// import { ethers } from "ethers";
// import { user } from "@pushprotocol/restapi";

// const PK = import.meta.env.VITE_ETHEREUM_PRIVATE_KEY;
// const PUBKEY = import.meta.env.VITE_ETHEREUM_PUBLIC_KEY;
// const Pkey = "0x" + PK;
// const signer = new ethers.Wallet(Pkey);
// const ACCOUNT = `eip155:${PUBKEY}`;
// NOTE: Add cacheable Tauri calls in this file
//   that you want to use synchronously across components in your app

// defaults are only for auto-complete
const PushProtocolContext = React.createContext({});

export const usePushProtocolContext = () => useContext(PushProtocolContext);
export function PushProtocolProvider({ children }) {
  const { fileSep, documents, downloads, appDocuments } = useTauriContext();
  const [pushProtocolUser, setPushProtocolUser] = useState(null);

  const getUser = async () => {
    try {
      // const user = await PushAPI.user.get({
      //   env: "staging",
      //   account: ACCOUNT,
      // });
      // setPushProtocolUser(user);
    } catch (e) {
      setPushProtocolUser(null);
      console.log(e);
    }
  };

  const decryptUserPGP = async () => {
    try {
      console.log("Hit Decrypt");
      // const response = await PushAPI.chat.decryptPGPKey({
      //   // encryptedPGPPrivateKey: string;
      //   // account?: string;
      //   // signer?: SignerType;
      //   // additionalMeta?: {
      //   //   NFTPGP_V1?: {
      //   //     password: string;
      //   //   };
      //   // };
      //   // env?: ENV;
      //   // toUpgrade?: boolean;
      //   // progressHook?: (progress: ProgressHookType) => void;
      // });
    } catch (e) {
      console.log(e);
    }
  };

  const createUser = async () => {
    try {
      if (!pushProtocolUser) {
        // const user = await PushAPI.user.create({
        //   env: "staging",
        //   account: ACCOUNT,
        //   signer: signer,
        // });
        // setPushProtocolUser(user);
      } else {
        throw new Error("User already exists, Don't create. ");
      }
    } catch (e) {
      setPushProtocolUser(null);
      console.log(e);
    }
  };

  const initialize = async () => {
    //GET USER
    let res = await getUser();
    if (res) {
      //IF USER EXISTS
    } else {
      //IF USER DOESNT EXIST CREATE
      let res = await createUser();
    }
  };

  useEffect(() => {
    if (pushProtocolUser) {
      console.log(pushProtocolUser);
      decryptUserPGP();
    }
  }, [pushProtocolUser]);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <PushProtocolContext.Provider value={{}}>
      {children}
    </PushProtocolContext.Provider>
  );
}