import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  Unsubscribe 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export interface FeedbackProposal {
  id: string;
  authorName: string;
  authorEmail?: string;
  authorUid: string;
  sectionKey: string;
  sectionTitle: string;
  targetType?: 'text' | 'image';
  originalText?: string;
  proposedText: string;
  originalImage?: string;
  proposedImage?: string;
  reason?: string;
  status: 'pending' | 'applied' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

export interface SiteOverride {
  sectionKey: string;
  sectionTitle?: string;
  targetType?: 'text' | 'image';
  text: string;
  appliedBy?: string;
  updatedAt: string;
}

/**
 * Real-time listener for site overrides (live applied text)
 */
export function subscribeSiteOverrides(
  callback: (overrides: Record<string, string>) => void
): Unsubscribe {
  const colRef = collection(db, 'site_overrides');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const overrides: Record<string, string> = {};
      snapshot.forEach((d) => {
        const data = d.data() as SiteOverride;
        if (data.sectionKey && typeof data.text === 'string') {
          overrides[data.sectionKey] = data.text;
        }
      });
      callback(overrides);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'site_overrides');
    }
  );
}

/**
 * Submit employee feedback or text proposal
 */
export async function submitFeedbackProposal(
  proposalData: Omit<FeedbackProposal, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const proposalId = `prop_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const docRef = doc(db, 'feedback_proposals', proposalId);
  
  const payload: FeedbackProposal = {
    ...proposalData,
    id: proposalId,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(docRef, payload);
    return proposalId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `feedback_proposals/${proposalId}`);
    throw error;
  }
}

/**
 * Real-time listener for proposals (for Admin / Review mode)
 */
export function subscribeProposals(
  callback: (proposals: FeedbackProposal[]) => void
): Unsubscribe {
  const colRef = collection(db, 'feedback_proposals');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: FeedbackProposal[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as FeedbackProposal);
      });
      // Sort newest first
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'feedback_proposals');
    }
  );
}

/**
 * Admin applies proposal to the live website
 */
export async function applyProposal(
  proposal: FeedbackProposal,
  adminEmail: string
): Promise<void> {
  const overrideRef = doc(db, 'site_overrides', proposal.sectionKey);
  const proposalRef = doc(db, 'feedback_proposals', proposal.id);

  try {
    // 1. Write the live override
    await setDoc(overrideRef, {
      sectionKey: proposal.sectionKey,
      sectionTitle: proposal.sectionTitle || '',
      targetType: proposal.targetType || 'text',
      text: proposal.proposedText,
      appliedBy: adminEmail,
      updatedAt: new Date().toISOString()
    });

    // 2. Mark proposal as applied
    await updateDoc(proposalRef, {
      status: 'applied',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `site_overrides/${proposal.sectionKey}`);
    throw error;
  }
}

/**
 * Direct apply for galaxynoob102@gmail.com (employee & admin combined)
 * Immediately updates the site override without needing separate review steps!
 */
export async function directApplyOverride(
  sectionKey: string,
  sectionTitle: string,
  value: string,
  adminEmail: string,
  targetType: 'text' | 'image' = 'text',
  authorUid?: string,
  authorName?: string,
  originalValue?: string
): Promise<void> {
  const overrideRef = doc(db, 'site_overrides', sectionKey);
  const now = new Date().toISOString();
  const proposalId = `prop_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const proposalRef = doc(db, 'feedback_proposals', proposalId);

  try {
    // 1. Apply to live website immediately
    await setDoc(overrideRef, {
      sectionKey,
      sectionTitle: sectionTitle || '',
      targetType,
      text: value,
      appliedBy: adminEmail,
      updatedAt: now
    });

    // 2. Also log to feedback_proposals as 'applied' so there is clear audit history
    if (authorUid) {
      await setDoc(proposalRef, {
        id: proposalId,
        authorName: authorName || '관리자 (galaxynoob102)',
        authorEmail: adminEmail,
        authorUid,
        sectionKey,
        sectionTitle: sectionTitle || sectionKey,
        targetType,
        originalText: targetType === 'text' ? (originalValue || '') : '',
        proposedText: value,
        originalImage: targetType === 'image' ? (originalValue || '') : '',
        proposedImage: targetType === 'image' ? value : '',
        reason: '직원/관리자 계정 즉시 실시간 반영',
        status: 'applied',
        createdAt: now,
        updatedAt: now
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `site_overrides/${sectionKey}`);
    throw error;
  }
}

/**
 * Admin rejects a proposal
 */
export async function rejectProposal(
  proposalId: string,
  rejectionReason?: string
): Promise<void> {
  const proposalRef = doc(db, 'feedback_proposals', proposalId);
  try {
    await updateDoc(proposalRef, {
      status: 'rejected',
      reason: rejectionReason || '관리자에 의해 반려되었습니다.',
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `feedback_proposals/${proposalId}`);
    throw error;
  }
}

/**
 * Admin deletes a proposal
 */
export async function deleteProposal(proposalId: string): Promise<void> {
  const proposalRef = doc(db, 'feedback_proposals', proposalId);
  try {
    await deleteDoc(proposalRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `feedback_proposals/${proposalId}`);
    throw error;
  }
}

/**
 * Admin reverts an applied override back to the original code default
 */
export async function revertSiteOverride(sectionKey: string): Promise<void> {
  const overrideRef = doc(db, 'site_overrides', sectionKey);
  try {
    await deleteDoc(overrideRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `site_overrides/${sectionKey}`);
    throw error;
  }
}

export interface AdminUser {
  id?: string;
  email: string;
  name?: string;
  role: 'developer' | 'admin';
  addedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Real-time listener for admin users
 */
export function subscribeAdminUsers(
  callback: (admins: AdminUser[]) => void
): Unsubscribe {
  const colRef = collection(db, 'admins');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: AdminUser[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...(d.data() as AdminUser) });
      });
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'admins');
    }
  );
}

/**
 * Super Admin (Developer) adds or updates an admin user
 */
export async function addOrUpdateAdminUser(
  email: string,
  name: string,
  role: 'developer' | 'admin' = 'admin',
  addedBy: string = 'galaxynoob102@gmail.com'
): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const docId = cleanEmail;
  const docRef = doc(db, 'admins', docId);

  const payload: AdminUser = {
    id: docId,
    email: cleanEmail,
    name: name.trim() || cleanEmail.split('@')[0],
    role,
    addedBy,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `admins/${docId}`);
    throw error;
  }
}

/**
 * Super Admin (Developer) removes an admin user
 */
export async function removeAdminUser(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const docId = cleanEmail;
  const docRef = doc(db, 'admins', docId);

  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `admins/${docId}`);
    throw error;
  }
}

