import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  firebaseConfig.projectId
);

let app;
let auth;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
  } catch (error) {
    console.warn('Failed to initialize Firebase Auth, falling back to local auth mode:', error);
  }
}

// Local mock storage for development when Firebase credentials are not set
const MOCK_STORAGE_KEY = 'resumax_users_db';
const MOCK_CURRENT_USER_KEY = 'resumax_current_user';

const DEFAULT_DEMO_USER = {
  uid: 'user_demo_default',
  email: 'demo@resumax.com',
  password: 'Password123!',
  displayName: 'Alex Morgan',
  createdAt: new Date().toISOString()
};

const getMockUsers = () => {
  try {
    const raw = localStorage.getItem(MOCK_STORAGE_KEY);
    if (!raw) {
      const defaultUsers = [DEFAULT_DEMO_USER];
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.some((u) => u.email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase())) {
      parsed.push(DEFAULT_DEMO_USER);
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return [DEFAULT_DEMO_USER];
  }
};

const saveMockUsers = (users) => {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(users));
};

export const authService = {
  isConfigured: isFirebaseConfigured && Boolean(auth),

  // Register a new user
  async register(fullName, email, password) {
    if (this.isConfigured) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (fullName) {
        await updateProfile(userCredential.user, { displayName: fullName });
      }
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: fullName || userCredential.user.displayName || email.split('@')[0]
      };
    } else {
      // Local Auth Fallback
      const users = getMockUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        const error = new Error('An account with this email already exists.');
        error.code = 'auth/email-already-in-use';
        throw error;
      }
      const newUser = {
        uid: 'user_' + Date.now(),
        email: email.toLowerCase(),
        password, // stored locally for mock testing
        displayName: fullName || email.split('@')[0],
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      saveMockUsers(users);

      const userSession = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName
      };
      localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(userSession));
      return userSession;
    }
  },

  // Login existing user
  async login(email, password) {
    if (this.isConfigured) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || userCredential.user.email.split('@')[0]
      };
    } else {
      // Local Auth Fallback
      const users = getMockUsers();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!user) {
        const error = new Error('Invalid email or password. Please check your credentials.');
        error.code = 'auth/invalid-credential';
        throw error;
      }
      const userSession = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      };
      localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(userSession));
      return userSession;
    }
  },

  // Log out user
  async logout() {
    if (this.isConfigured) {
      await signOut(auth);
    } else {
      localStorage.removeItem(MOCK_CURRENT_USER_KEY);
    }
  },

  // Reset password
  async resetPassword(email) {
    if (this.isConfigured) {
      await sendPasswordResetEmail(auth, email);
    } else {
      const users = getMockUsers();
      const userExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!userExists) {
        const error = new Error('No account found with this email address.');
        error.code = 'auth/user-not-found';
        throw error;
      }
      // Mock success for local dev
      return true;
    }
  },

  // Listen for auth state changes
  onAuthStateChanged(callback) {
    if (this.isConfigured) {
      return onAuthStateChanged(auth, (user) => {
        if (user) {
          callback({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0]
          });
        } else {
          callback(null);
        }
      });
    } else {
      // Check local storage
      const savedUser = localStorage.getItem(MOCK_CURRENT_USER_KEY);
      if (savedUser) {
        try {
          callback(JSON.parse(savedUser));
        } catch (e) {
          callback(null);
        }
      } else {
        callback(null);
      }
      // Return unlisten function
      return () => {};
    }
  }
};

export { auth };
