export interface IFirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface IFirestoreSearchDocument {
  field: string;
  value: any
}

export interface IBaseItemFromFirebase {
  createdAt?: number | null;
  updatedAt?: number | null;
  deletedAt?: number | null;
  [key: string]: any;
}
