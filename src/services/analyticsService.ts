import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDb } from "./firebase";

export const logVisit = async () => {
  try {
    const db = getDb();
    const payload = {
      createdAt: serverTimestamp(),
      page: typeof location !== "undefined" ? location.pathname : "/",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      language: typeof navigator !== "undefined" ? navigator.language : "",
      screen:
        typeof window !== "undefined"
          ? `${window.innerWidth}x${window.innerHeight}`
          : "",
    };
    const docRef = await addDoc(collection(db, "visits"), payload);
    if (
      typeof window !== "undefined" &&
      window.location.hostname === "localhost"
    ) {
      // Dev-only confirmation
      console.log("✅ Visit logged to Firestore:", {
        id: docRef.id,
        ...payload,
      });
    }
  } catch (error) {
    console.warn("Visit logging failed:", error);
  }
};
