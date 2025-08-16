import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_NAME = "umkm";

// Type definitions
interface UMKMData {
  id?: string;
  name: string;
  description: string;
  image?: string;
  contact: string;
  address: string;
  laravel_id?: number;
  created_at?: string;
  updated_at?: string;
  imported_at?: string;
}

interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  id?: string;
}

export const umkmService = {
  // Create UMKM
  async create(data: UMKMData): Promise<ServiceResponse> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { success: true, id: docRef.id };
    } catch (error: unknown) {
      console.error("Error creating UMKM:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },

  // Read All UMKM
  async getAll(): Promise<ServiceResponse<UMKMData[]>> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("created_at", "desc")
      );
      const querySnapshot = await getDocs(q);
      const umkmList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UMKMData[];
      return { success: true, data: umkmList || [] };
    } catch (error: unknown) {
      console.error("Error fetching UMKM:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage, data: [] };
    }
  },

  // Read Single UMKM
  async getById(id: string): Promise<ServiceResponse<UMKMData>> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          success: true,
          data: { id: docSnap.id, ...docSnap.data() } as UMKMData,
        };
      } else {
        return { success: false, error: "UMKM not found", data: undefined };
      }
    } catch (error: unknown) {
      console.error("Error fetching UMKM:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage, data: undefined };
    }
  },

  // Update UMKM
  async update(id: string, data: Partial<UMKMData>): Promise<ServiceResponse> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Error updating UMKM:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },

  // Delete UMKM
  async delete(id: string): Promise<ServiceResponse> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return { success: true };
    } catch (error: unknown) {
      console.error("Error deleting UMKM:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },
};
