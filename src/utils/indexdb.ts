import ManifestObject from "@/ManifestClasses/ManifestObject";
import { IiifManifest } from "@/types/iiif";

export class IndexedDB {
  dbName: string = "IIIfManifest3DProjects";
  version: number = 1;
  static request: IDBOpenDBRequest;
  static db: IDBDatabase | null = null;

  constructor(dbName?: string, version?: number) {
    if (dbName) this.dbName = dbName;
    if (version) this.version = version;
    IndexedDB.request = indexedDB.open(this.dbName, this.version);
  }

  open(): Promise<IDBDatabase> {
    if (IndexedDB.db) {
      return Promise.resolve(IndexedDB.db);
    }

    return new Promise((resolve, reject) => {
      IndexedDB.request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects");
        }
      };

      IndexedDB.request.onsuccess = (event) => {
        IndexedDB.db = (event.target as IDBOpenDBRequest).result;
        resolve(IndexedDB.db);
      };

      IndexedDB.request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  saveProject(manifest: object) {
    return new Promise((resolve, reject) => {
      if (!IndexedDB.db) {
        reject(new Error("Database not open"));
        return;
      }

      const transaction = IndexedDB.db.transaction(["projects"], "readwrite");
      const store = transaction.objectStore("projects");
      const request = store.put(manifest, "current");

      request.onsuccess = () => {
        resolve(manifest);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
        console.error(
          "Failed to save project to IndexedDB:",
          (event.target as IDBRequest).error
        );
      };
    });
  }

  getProject(id: string) {
    return new Promise<object>((resolve, reject) => {
      if (!IndexedDB.db) {
        reject(new Error("Database not open"));
        return;
      }

      const transaction = IndexedDB.db.transaction(["projects"], "readonly");
      const store = transaction.objectStore("projects");
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    });
  }
}