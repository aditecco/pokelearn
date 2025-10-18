import type { SavedPokemon, UserProgress, Settings } from "../types";

const DB_NAME = "PokeLearnDB";
const DB_VERSION = 1;

const STORES = {
  POKEMON: "pokemon",
  PROGRESS: "progress",
  SETTINGS: "settings",
};

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.POKEMON)) {
        db.createObjectStore(STORES.POKEMON, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
        db.createObjectStore(STORES.PROGRESS, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: "id" });
      }
    };
  });
}

export async function savePokemon(pokemon: SavedPokemon): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.POKEMON], "readwrite");
    const store = transaction.objectStore(STORES.POKEMON);
    const request = store.put(pokemon);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getAllPokemon(): Promise<SavedPokemon[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.POKEMON], "readonly");
    const store = transaction.objectStore(STORES.POKEMON);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deletePokemon(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.POKEMON], "readwrite");
    const store = transaction.objectStore(STORES.POKEMON);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllPokemon(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.POKEMON], "readwrite");
    const store = transaction.objectStore(STORES.POKEMON);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PROGRESS], "readwrite");
    const store = transaction.objectStore(STORES.PROGRESS);
    const request = store.put({ id: "main", ...progress });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getProgress(): Promise<UserProgress | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.PROGRESS], "readonly");
    const store = transaction.objectStore(STORES.PROGRESS);
    const request = store.get("main");

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        const { id, ...progress } = result;
        resolve(progress as UserProgress);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.SETTINGS], "readwrite");
    const store = transaction.objectStore(STORES.SETTINGS);
    const request = store.put({ id: "main", ...settings });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getSettings(): Promise<Settings | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORES.SETTINGS], "readonly");
    const store = transaction.objectStore(STORES.SETTINGS);
    const request = store.get("main");

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        const { id, ...settings } = result;
        resolve(settings as Settings);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}
