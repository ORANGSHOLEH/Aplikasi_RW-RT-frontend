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
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_NAME = "loker";

// Type definitions untuk Loker
interface LokerData {
  id?: string;
  url_gambar?: string;
  nama_perusahaan: string;
  alamat_perusahaan: string;
  kontak: string;
  posisi: string;
  gaji: string;
  syarat: string;
  waktu_kerja: string;
  tempat_kerja: string;
  is_active?: boolean;
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

export const lokerService = {
  // Create Loker
  async create(data: LokerData): Promise<ServiceResponse> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { success: true, id: docRef.id };
    } catch (error: unknown) {
      console.error("Error creating Loker:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },

  // Read All Active Loker
  async getAll(
    activeOnly: boolean = true
  ): Promise<ServiceResponse<LokerData[]>> {
    try {
      let q = query(
        collection(db, COLLECTION_NAME),
        orderBy("created_at", "desc")
      );

      if (activeOnly) {
        q = query(
          collection(db, COLLECTION_NAME),
          where("is_active", "==", true),
          orderBy("created_at", "desc")
        );
      }

      const querySnapshot = await getDocs(q);
      const lokerList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LokerData[];
      return { success: true, data: lokerList || [] };
    } catch (error: unknown) {
      console.error("Error fetching Loker:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage, data: [] };
    }
  },

  // Read Single Loker
  async getById(id: string): Promise<ServiceResponse<LokerData>> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          success: true,
          data: { id: docSnap.id, ...docSnap.data() } as LokerData,
        };
      } else {
        return { success: false, error: "Loker not found", data: undefined };
      }
    } catch (error: unknown) {
      console.error("Error fetching Loker:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage, data: undefined };
    }
  },

  // Update Loker
  async update(id: string, data: Partial<LokerData>): Promise<ServiceResponse> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...data,
        updated_at: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Error updating Loker:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },

  // Delete Loker (soft delete - set inactive)
  async delete(id: string): Promise<ServiceResponse> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        is_active: false,
        updated_at: new Date().toISOString(),
      });
      return { success: true };
    } catch (error: unknown) {
      console.error("Error deleting Loker:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },

  // Hard delete Loker
  async hardDelete(id: string): Promise<ServiceResponse> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      return { success: true };
    } catch (error: unknown) {
      console.error("Error hard deleting Loker:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage };
    }
  },

  // Search Loker by position or company
  async search(searchTerm: string): Promise<ServiceResponse<LokerData[]>> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This will get all active lokers and filter client-side
      const result = await this.getAll(true);

      if (result.success && result.data) {
        const filteredData = result.data.filter(
          (loker) =>
            loker.posisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loker.nama_perusahaan
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            loker.syarat.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { success: true, data: filteredData };
      }

      return { success: false, error: "Failed to search loker", data: [] };
    } catch (error: unknown) {
      console.error("Error searching Loker:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage, data: [] };
    }
  },

  // Get loker by work type (Full-Time, Part-Time, Freelance)
  async getByWorkType(workType: string): Promise<ServiceResponse<LokerData[]>> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("is_active", "==", true),
        where("waktu_kerja", "==", workType),
        orderBy("created_at", "desc")
      );

      const querySnapshot = await getDocs(q);
      const lokerList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LokerData[];

      return { success: true, data: lokerList || [] };
    } catch (error: unknown) {
      console.error("Error fetching Loker by work type:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage, data: [] };
    }
  },

  // Get loker by workplace (On-Site, Work From Home)
  async getByWorkplace(
    workplace: string
  ): Promise<ServiceResponse<LokerData[]>> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("is_active", "==", true),
        where("tempat_kerja", "==", workplace),
        orderBy("created_at", "desc")
      );

      const querySnapshot = await getDocs(q);
      const lokerList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LokerData[];

      return { success: true, data: lokerList || [] };
    } catch (error: unknown) {
      console.error("Error fetching Loker by workplace:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: errorMessage, data: [] };
    }
  },
};

// Export types untuk digunakan di component lain
export type { LokerData, ServiceResponse };
