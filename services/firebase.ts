
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  DocumentData
} from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import { RSVPData } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyCYt4juUgunrMWDhRP978yZ8BdG0J7DB3g",
  authDomain: "nye2026-c3b2e.firebaseapp.com",
  projectId: "nye2026-c3b2e",
  storageBucket: "nye2026-c3b2e.firebasestorage.app",
  messagingSenderId: "959706450424",
  appId: "1:959706450424:web:0f61194067806eff7dee0d",
  measurementId: "G-DJMGE809SJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics if supported
isSupported().then(supported => {
  if (supported) getAnalytics(app);
});

export const submitRSVP = async (data: RSVPData) => {
  try {
    // Add document to 'rsvps' collection
    const docRef = await addDoc(collection(db, "rsvps"), {
      ...data,
      created_at: serverTimestamp(),
    });
    
    return { 
      data: [{ id: docRef.id, ...data }], 
      error: null 
    };
  } catch (error: any) {
    console.error("Error submitting RSVP to Firebase:", error);
    return { data: null, error };
  }
};

export const fetchAllRSVPs = async (): Promise<RSVPData[]> => {
  try {
    const rsvpRef = collection(db, "rsvps");
    const q = query(rsvpRef, orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);
    
    const rsvps: RSVPData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      rsvps.push({
        ...data,
        id: doc.id,
        // Convert Firestore timestamp to ISO string for compatibility with existing components
        created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString()
      } as RSVPData);
    });
    
    return rsvps;
  } catch (error) {
    console.error("Error fetching RSVPs from Firebase:", error);
    throw error;
  }
};
