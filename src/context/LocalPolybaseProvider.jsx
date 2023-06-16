import React, { useState, useEffect, useContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import { readDir, readTextFile } from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import tauriConfJson from "../../src-tauri/tauri.conf.json";
import { APP_NAME, RUNNING_IN_TAURI, USERNAME } from "../utils";
import { useTauriContext } from "./TauriProvider";
import { useLangchainContext } from "./LangchainProvider";
import { usePolybase, useDocument, useCollection } from "@polybase/react";
import { v4 as uuidv4 } from "uuid";

const PUBKEY = import.meta.env.VITE_ETHEREUM_PUBLIC_KEY;

const LocalPolybaseContext = React.createContext({
  loading: false,
  createNote: undefined,
  updateNote: undefined,
});

export const useLocalPolybaseContext = () => useContext(LocalPolybaseContext);

export function LocalPolybaseProvider({ children }) {
  const { fileSep, documents, downloads, appDocuments } = useTauriContext();
  const polybase = usePolybase();

  // const UserCollection = polybase.collection("User");
  // const NotesCollection = polybase.collection("Notes");

  const [polybaseUser, setPolybaseUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingNote, setLoadingNote] = useState("");

  const createNote = async (fileName, content) => {
    console.log("Create Note in LocalPolybase");

    try {
      setLoading(true);
      setLoadingNote(fileName);
      let note = await polybase
        .collection("Note")
        .create([fileName, fileName, content]);

      console.log("Polybase created Note", note);
      // setPolybaseUser(user);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setLoadingNote("");
    }
  };

  const updateNote = async (fileName, content) => {
    console.log("Update Note in LocalPolybase");
    try {
      setLoading(true);
      setLoadingNote(fileName);

      //find note to get id.
      // let res = await polybase
      //   .collection("Note")
      //   .where("name", "==", fileName)
      //   .get();

      // console.log("Polybase fetched Note", res);

      //once found update
      // if (res.length === 0) {
      //   let note = res[0].data;

      //   console.log("Polybase fetched Note", note);

      let updatedNote = await polybase
        .collection("Note")
        .record(fileName)
        .call("setContent", [content]);

      console.log("Polybase updated Note", updatedNote);
      // } else {
      //   console.log("cant update note that doesnt exist");
      // }
      // setPolybaseUser(user);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    //TODO: fetch notes and add to file system
    //DECRYPT NOTES
  };

  const createUser = async () => {
    try {
      setLoading(true);
      let user = await polybase
        .collection("User")
        .create([uuidv4(), USERNAME, PUBKEY]);
      console.log("Polybase create user", user);
      setPolybaseUser(user);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    try {
      setLoading(true);

      const records = await polybase
        .collection("User")
        .where("normalPublicKey", "==", PUBKEY)
        .get();

      // Array of records is available under the data property
      const { data, cursor } = records;

      if (data.length > 0) {
        let user = data[0].data;
        console.log("Found exact user", user);
        setPolybaseUser(user);
        // return data;
      } else {
        await createUser();
      }

      return false;
    } catch (e) {
      console.log("polybase error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <LocalPolybaseContext.Provider
      value={{
        loading,
        createNote,
        updateNote,
      }}
    >
      {children}
    </LocalPolybaseContext.Provider>
  );
}
