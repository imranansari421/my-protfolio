import { initializeApp } from "firebase/app";
import { 
  initializeFirestore,
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore with custom settings to handle sandboxed environment/iframe proxy issues
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);

// Collection references
const PORTFOLIO_DOC_ID = "imran-ansari-portfolio";

/**
 * Fetch the portfolio data from Firestore.
 * If it doesn't exist, create it with the provided default data.
 */
export async function getPortfolioData(defaultData: any): Promise<any> {
  try {
    const docRef = doc(db, "portfolios", PORTFOLIO_DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Initialize with default details
      await setDoc(docRef, defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Error fetching portfolio from Firestore:", error);
    return null;
  }
}

/**
 * Compresses and resizes a base64 image string to keep document size small.
 */
export function compressBase64Image(base64Str: string, maxWidth = 400, maxHeight = 400, quality = 0.6): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !base64Str || !base64Str.startsWith("data:image/")) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = base64Str;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } else {
          resolve(base64Str);
        }
      } catch (e) {
        console.error("Canvas compression error:", e);
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

/**
 * Traverses a portfolio object, locates all base64-encoded images, and compresses them.
 */
export async function optimizePortfolioForFirestore(data: any): Promise<any> {
  if (!data || typeof data !== "object") {
    return data;
  }

  // Create a deep copy to avoid mutating active application state unexpectedly
  const optimized = JSON.parse(JSON.stringify(data));

  // 1. Optimize avatarUrl
  if (optimized.avatarUrl && optimized.avatarUrl.startsWith("data:image/")) {
    optimized.avatarUrl = await compressBase64Image(optimized.avatarUrl, 300, 300, 0.7);
  }

  // 2. Optimize all project images
  if (Array.isArray(optimized.projects)) {
    for (let i = 0; i < optimized.projects.length; i++) {
      const project = optimized.projects[i];
      if (project && Array.isArray(project.images)) {
        const optimizedImages: string[] = [];
        for (let j = 0; j < project.images.length; j++) {
          const imgUrl = project.images[j];
          if (imgUrl && imgUrl.startsWith("data:image/")) {
            const compressed = await compressBase64Image(imgUrl, 600, 400, 0.6);
            optimizedImages.push(compressed);
          } else {
            optimizedImages.push(imgUrl);
          }
        }
        project.images = optimizedImages;
      }
    }
  }

  return optimized;
}

/**
 * Save updated portfolio data to Firestore.
 */
export async function savePortfolioData(data: any): Promise<boolean> {
  try {
    const docRef = doc(db, "portfolios", PORTFOLIO_DOC_ID);
    const optimizedData = await optimizePortfolioForFirestore(data);
    await setDoc(docRef, optimizedData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving portfolio to Firestore:", error);
    return false;
  }
}

/**
 * Submit a new inquiry to Firestore.
 */
export async function submitInquiry(inquiry: any): Promise<boolean> {
  try {
    const collRef = collection(db, "inquiries");
    await addDoc(collRef, {
      ...inquiry,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error("Error adding inquiry to Firestore:", error);
    return false;
  }
}

/**
 * Fetch all inquiries from Firestore, ordered by submittedAt or creation date.
 */
export async function fetchInquiries(): Promise<any[]> {
  try {
    const collRef = collection(db, "inquiries");
    const q = query(collRef, orderBy("submittedAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results: any[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return results;
  } catch (error) {
    console.error("Error fetching inquiries from Firestore:", error);
    // Fallback try without ordering if index is not created yet
    try {
      const collRef = collection(db, "inquiries");
      const querySnapshot = await getDocs(collRef);
      const results: any[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } catch (err) {
      console.error("Fallback fetching inquiries failed:", err);
      return [];
    }
  }
}

/**
 * Update the status of an inquiry (e.g., mark as read/unread).
 */
export async function updateInquiryStatus(id: string, status: "read" | "unread"): Promise<boolean> {
  try {
    const docRef = doc(db, "inquiries", id);
    await updateDoc(docRef, { status });
    return true;
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return false;
  }
}

/**
 * Delete an inquiry from Firestore.
 */
export async function deleteInquiry(id: string): Promise<boolean> {
  try {
    const docRef = doc(db, "inquiries", id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting inquiry from Firestore:", error);
    return false;
  }
}

/**
 * Clear all inquiries from Firestore.
 */
export async function clearAllInquiries(): Promise<boolean> {
  try {
    const collRef = collection(db, "inquiries");
    const querySnapshot = await getDocs(collRef);
    const deletePromises: Promise<any>[] = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Error clearing all inquiries from Firestore:", error);
    return false;
  }
}

