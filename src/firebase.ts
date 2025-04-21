import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIx1p2-tME0785U0VntX2FPoKsYie8fyQ",
  authDomain: "monitor-de-saude-55c43.firebaseapp.com",
  projectId: "monitor-de-saude-55c43",
  storageBucket: "monitor-de-saude-55c43.appspot.com",
  messagingSenderId: "636014176666",
  appId: "1:636014176666:web:8bf8a91de82c38a7e53223"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
