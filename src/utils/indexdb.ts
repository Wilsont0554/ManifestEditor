import ManifestObject from "@/ManifestClasses/ManifestObject";
import { IiifManifest } from "@/types/iiif";

/**
 * Utility class for handling IndexedDB operations related to saving and retrieving IIIF manifest data.
 * We use IndexedDB to persist the latest manifest data locally in the user's browser.
 * The class provides methods to open the database, save a manifest object, and retrieve a manifest object by ID.
 * The manifest data is stored in an object store named "projects" with a key of "current" for the latest manifest.
 */
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

  /**
   * Opens the IndexedDB database.
   * @returns A promise resolving to the database instance.
   */

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

      //handle successful opening of the database
      IndexedDB.request.onsuccess = (event) => {
        IndexedDB.db = (event.target as IDBOpenDBRequest).result;
        resolve(IndexedDB.db);
      };

      //handle errors during opening of the database
      IndexedDB.request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  /**
   * Saves a manifest object to the IndexedDB under the "current" key in the "projects" object store.
   * @param manifest the manifest object you want to store to indexDB
   * @returns A promise resolving to the saved manifest object
   */
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

  /**
   * Retrieves a manifest object from the IndexedDB by its ID in the "projects" object store.
   * @param id the ID of the manifest object to retrieve
   * @returns A promise resolving to the retrieved manifest object
   */
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