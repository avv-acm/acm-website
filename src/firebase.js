import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  writeBatch, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

// Environment variables configured in Vite (.env or system env)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const DB_KEY = 'acm_portal_members';

const initialMockMembers = [
  { _id: 'ACM-129034', name: 'Aswin Kumar', email: 'aswin@am.amrita.edu', rollNo: 'AM.EN.U4CSE23005', studentId: 'AM.EN.U4CSE23005', year: '3rd Year', department: 'Computer Science and Engineering', interest: 'web', status: 'active', type: 'student', role: 'Member', joinedAt: '2026-03-12T10:30:00Z' },
  { _id: 'ACM-903482', name: 'Nisha Sundar', email: 'nisha@am.amrita.edu', rollNo: 'AM.EN.U4CSE23114', studentId: 'AM.EN.U4CSE23114', year: '3rd Year', department: 'Computer Science and Engineering', interest: 'ai-ml', status: 'active', type: 'student', role: 'Member', joinedAt: '2026-04-01T15:20:00Z' },
  { _id: 'ACM-549832', name: 'Adithya R', email: 'adithya@am.amrita.edu', rollNo: 'AM.EN.U4ECE23012', studentId: 'AM.EN.U4ECE23012', year: '3rd Year', department: 'Electrical and Communication Engineering', interest: 'cp', status: 'active', type: 'student', role: 'Member', joinedAt: '2026-04-18T09:12:00Z' },
  { _id: 'ACM-763421', name: 'Maria Sharon', email: 'maria@am.amrita.edu', rollNo: 'AM.EN.U4CSE23055', studentId: 'AM.EN.U4CSE23055', year: '3rd Year', department: 'Computer Science and Engineering', interest: 'ui-ux', status: 'active', type: 'student', role: 'Member', joinedAt: '2026-05-02T14:45:00Z' },
  { _id: 'ACM-219803', name: 'Rahul Krishnan', email: 'rahul@am.amrita.edu', rollNo: 'AM.EN.U4CSE23087', studentId: 'AM.EN.U4CSE23087', year: '3rd Year', department: 'Computer Science and Engineering', interest: 'cyber', status: 'active', type: 'student', role: 'Member', joinedAt: '2026-05-20T11:00:00Z' }
];

// Determine if valid Firebase config is provided
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  firebaseConfig.projectId !== 'YOUR_PROJECT_ID';

let db = null;
let useFirebase = false;

if (isFirebaseConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    useFirebase = true;
    console.log('[Firebase] Initialized successfully. Operating on Cloud Firestore.');
  } catch (error) {
    console.error('[Firebase] Initialization failed. Falling back to Local Storage.', error);
  }
} else {
  console.warn('[Firebase] Configuration missing or incomplete. Using Local Storage fallback adapter.');
}

// ----------------------------------------------------
// LOCAL STORAGE FALLBACK ADAPTER
// ----------------------------------------------------
const getLocalMembers = () => {
  const stored = localStorage.getItem(DB_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return initialMockMembers;
    }
  }
  localStorage.setItem(DB_KEY, JSON.stringify(initialMockMembers));
  return initialMockMembers;
};

const saveLocalMembers = (members) => {
  localStorage.setItem(DB_KEY, JSON.stringify(members));
};

// ----------------------------------------------------
// UNIFIED DATABASE API
// ----------------------------------------------------
export const getMembersFromDB = async () => {
  if (useFirebase && db) {
    try {
      const q = query(collection(db, 'members'), orderBy('joinedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const membersList = [];
      querySnapshot.forEach((doc) => {
        membersList.push({ id: doc.id, ...doc.data() });
      });
      
      // If Firestore is empty, pre-populate with default mock data
      if (membersList.length === 0) {
        console.log('[Firebase] Firestore members collection is empty. Seeding initial mock entries...');
        await seedInitialData();
        return getMembersFromDB();
      }
      return membersList;
    } catch (error) {
      console.error('[Firebase] Error reading members from Firestore. Falling back to local cache.', error);
      return getLocalMembers();
    }
  } else {
    return getLocalMembers();
  }
};

export const registerMemberInDB = async (memberData) => {
  const normalizedMember = {
    _id: memberData._id || memberData.id || `ACM-${Math.floor(100000 + Math.random() * 900000)}`,
    studentId: memberData.rollNo || memberData.studentId,
    status: 'active',
    type: 'student',
    role: 'Member',
    ...memberData
  };

  if (useFirebase && db) {
    try {
      const docRef = await addDoc(collection(db, 'members'), normalizedMember);
      console.log('[Firebase] Member registered successfully with Firestore ID:', docRef.id);
      return { id: docRef.id, ...normalizedMember };
    } catch (error) {
      console.error('[Firebase] Failed to write member to Firestore. Saving to local storage fallback...', error);
      const local = getLocalMembers();
      const updated = [normalizedMember, ...local];
      saveLocalMembers(updated);
      return normalizedMember;
    }
  } else {
    const local = getLocalMembers();
    const updated = [normalizedMember, ...local];
    saveLocalMembers(updated);
    // Write an audit log for the admin to see immediately
    try {
      const logsRaw = localStorage.getItem('acm_audit_logs');
      const logs = logsRaw ? JSON.parse(logsRaw) : [];
      const newLog = {
        _id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        action: 'MEMBER_JOIN_REQUEST',
        resource: 'members',
        details: `Student ${normalizedMember.name} (${normalizedMember.studentId}) registered for Amrita ACM Chapter.`,
        severity: 'info',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('acm_audit_logs', JSON.stringify([newLog, ...logs].slice(0, 200)));
    } catch (err) {}
    return normalizedMember;
  }
};

export const addBulkMembersToDB = async (membersList) => {
  if (useFirebase && db) {
    try {
      const batch = writeBatch(db);
      membersList.forEach((member) => {
        const docRef = doc(collection(db, 'members'));
        batch.set(docRef, {
          name: member.name,
          email: member.email,
          rollNo: member.rollNo,
          interest: member.interest,
          year: member.year || '1st Year',
          department: member.department || 'Computer Science and Engineering',
          joinedAt: member.joinedAt || new Date().toISOString()
        });
      });
      await batch.commit();
      console.log(`[Firebase] Successfully uploaded ${membersList.length} members in batch query.`);
      return true;
    } catch (error) {
      console.error('[Firebase] Batch upload to Firestore failed. Updating local storage fallback...', error);
      const local = getLocalMembers();
      const updated = [...membersList, ...local];
      saveLocalMembers(updated);
      return false;
    }
  } else {
    const local = getLocalMembers();
    const updated = [...membersList, ...local];
    saveLocalMembers(updated);
    return false;
  }
};

// Seed initial mock data to Firestore if it's empty
async function seedInitialData() {
  if (!db) return;
  try {
    const batch = writeBatch(db);
    initialMockMembers.forEach((member) => {
      // Use their id as doc ID or autogenerate
      const docRef = doc(collection(db, 'members'), member.id);
      batch.set(docRef, {
        name: member.name,
        email: member.email,
        rollNo: member.rollNo,
        interest: member.interest,
        year: member.year,
        department: member.department,
        joinedAt: member.joinedAt
      });
    });
    await batch.commit();
    console.log('[Firebase] Firestore database successfully seeded with initial mock members.');
  } catch (err) {
    console.error('[Firebase] Failed to seed initial data:', err);
  }
}
