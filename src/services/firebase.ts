import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocFromServer,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PendingSubscriptionRequest, SubscriptionActivationKey } from '../types';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Status:', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'subscriptionRequests', '_test_init_'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is in offline fallback mode.');
    }
  }
}
testFirestoreConnection();

// =================== FIRESTORE SYNC HELPERS ===================

export const syncSubscriptionRequestToFirestore = async (
  request: PendingSubscriptionRequest
): Promise<void> => {
  const path = `subscriptionRequests/${request.id}`;
  try {
    await setDoc(doc(db, 'subscriptionRequests', request.id), request, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
};

export const updateSubscriptionRequestInFirestore = async (
  requestId: string,
  updates: Partial<PendingSubscriptionRequest>
): Promise<void> => {
  const path = `subscriptionRequests/${requestId}`;
  try {
    await updateDoc(doc(db, 'subscriptionRequests', requestId), updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
};

export const listenToSubscriptionRequests = (
  onData: (requests: PendingSubscriptionRequest[]) => void
): Unsubscribe => {
  const path = 'subscriptionRequests';
  try {
    return onSnapshot(
      collection(db, 'subscriptionRequests'),
      (snapshot) => {
        const items: PendingSubscriptionRequest[] = [];
        snapshot.forEach((doc) => {
          if (doc.id !== '_test_init_') {
            items.push(doc.data() as PendingSubscriptionRequest);
          }
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return () => {};
  }
};

export const syncActivationKeyToFirestore = async (key: SubscriptionActivationKey): Promise<void> => {
  const path = `activationKeys/${key.id}`;
  try {
    await setDoc(doc(db, 'activationKeys', key.id), key, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
};

export const listenToActivationKeys = (
  onData: (keys: SubscriptionActivationKey[]) => void
): Unsubscribe => {
  const path = 'activationKeys';
  try {
    return onSnapshot(
      collection(db, 'activationKeys'),
      (snapshot) => {
        const items: SubscriptionActivationKey[] = [];
        snapshot.forEach((doc) => {
          items.push(doc.data() as SubscriptionActivationKey);
        });
        onData(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return () => {};
  }
};
