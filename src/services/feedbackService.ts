import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export interface AdminPermissions {
  canDirectApply: boolean;       // 즉시 라이브 승인/적용 권한
  canReject: boolean;            // 제안 반려/거절 권한
  canDelete: boolean;            // 내역/버전/로그 삭제 권한
  canRevert: boolean;            // 사이트 원복(기본값 되돌리기) 권한
  canManageBackgrounds: boolean; // 배경 사진 업로드 및 변경 권한
  canManageAdmins: boolean;      // 관리자 추가 및 권한 설정 권한
}

export const DEFAULT_ADMIN_PERMISSIONS: AdminPermissions = {
  canDirectApply: true,
  canReject: true,
  canDelete: false,
  canRevert: true,
  canManageBackgrounds: true,
  canManageAdmins: false
};

export const DEVELOPER_PERMISSIONS: AdminPermissions = {
  canDirectApply: true,
  canReject: true,
  canDelete: true,
  canRevert: true,
  canManageBackgrounds: true,
  canManageAdmins: true
};

export interface AdminUser {
  id?: string;
  email: string;
  name?: string;
  role: 'developer' | 'admin';
  permissions?: AdminPermissions;
  addedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

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

export interface SiteVersion {
  id: string;
  sectionKey: string;
  sectionTitle: string;
  targetType: 'text' | 'image';
  previousValue?: string;
  newValue: string;
  authorEmail: string;
  authorName: string;
  changeNote?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actionType: 'apply' | 'revert' | 'reject' | 'delete' | 'admin_add' | 'admin_update' | 'admin_remove' | 'rollback';
  target: string;
  targetTitle: string;
  userEmail: string;
  userName: string;
  details?: string;
  createdAt: string;
}

/**
 * Audit Log recorder
 */
export async function logActivity(
  action: Omit<ActivityLog, 'id' | 'createdAt'>
): Promise<void> {
  const logId = `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const logRef = doc(db, 'activity_logs', logId);
  const payload: ActivityLog = {
    ...action,
    id: logId,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(logRef, payload);
  } catch (error) {
    // Non-critical, log to console
    console.warn('Audit log write error:', error);
  }
}

/**
 * Real-time listener for Activity Logs
 */
export function subscribeActivityLogs(
  callback: (logs: ActivityLog[]) => void
): Unsubscribe {
  const colRef = collection(db, 'activity_logs');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ActivityLog[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as ActivityLog);
      });
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'activity_logs');
    }
  );
}

/**
 * Version Snapshot recorder
 */
export async function createSiteVersion(
  versionData: Omit<SiteVersion, 'id' | 'createdAt'>
): Promise<string> {
  const versionId = `ver_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const versionRef = doc(db, 'site_versions', versionId);
  const payload: SiteVersion = {
    ...versionData,
    id: versionId,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(versionRef, payload);
    return versionId;
  } catch (error) {
    console.warn('Version snapshot write error:', error);
    return versionId;
  }
}

/**
 * Real-time listener for Version History
 */
export function subscribeSiteVersions(
  callback: (versions: SiteVersion[]) => void
): Unsubscribe {
  const colRef = collection(db, 'site_versions');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: SiteVersion[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as SiteVersion);
      });
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'site_versions');
    }
  );
}

/**
 * Delete a version record
 */
export async function deleteSiteVersion(versionId: string): Promise<void> {
  const versionRef = doc(db, 'site_versions', versionId);
  try {
    await deleteDoc(versionRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `site_versions/${versionId}`);
    throw error;
  }
}

/**
 * Real-time listener for site overrides (live applied text/images)
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
    await logActivity({
      actionType: 'apply',
      target: proposalData.sectionKey,
      targetTitle: proposalData.sectionTitle || proposalData.sectionKey,
      userEmail: proposalData.authorEmail || 'anonymous',
      userName: proposalData.authorName,
      details: `새 ${proposalData.targetType === 'image' ? '이미지' : '문구'} 수정 제안 등록`
    });
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
  adminEmail: string,
  adminName?: string,
  currentLiveValue?: string
): Promise<void> {
  const overrideRef = doc(db, 'site_overrides', proposal.sectionKey);
  const proposalRef = doc(db, 'feedback_proposals', proposal.id);
  const applyVal = proposal.proposedImage || proposal.proposedText;

  try {
    // 1. Write the live override
    await setDoc(overrideRef, {
      sectionKey: proposal.sectionKey,
      sectionTitle: proposal.sectionTitle || '',
      targetType: proposal.targetType || 'text',
      text: applyVal,
      appliedBy: adminEmail,
      updatedAt: new Date().toISOString()
    });

    // 2. Mark proposal as applied
    await updateDoc(proposalRef, {
      status: 'applied',
      updatedAt: new Date().toISOString()
    });

    // 3. Create version snapshot
    await createSiteVersion({
      sectionKey: proposal.sectionKey,
      sectionTitle: proposal.sectionTitle || proposal.sectionKey,
      targetType: proposal.targetType || 'text',
      previousValue: currentLiveValue || proposal.originalImage || proposal.originalText,
      newValue: applyVal,
      authorEmail: adminEmail,
      authorName: adminName || adminEmail.split('@')[0],
      changeNote: `제안 승인 및 반영 (${proposal.authorName})`
    });

    // 4. Audit Log
    await logActivity({
      actionType: 'apply',
      target: proposal.sectionKey,
      targetTitle: proposal.sectionTitle || proposal.sectionKey,
      userEmail: adminEmail,
      userName: adminName || adminEmail.split('@')[0],
      details: `'${proposal.authorName}'의 제안 승인 및 라이브 반영`
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `site_overrides/${proposal.sectionKey}`);
    throw error;
  }
}

/**
 * Direct apply (Immediate 1-click apply without review queue)
 */
export async function directApplyOverride(
  sectionKey: string,
  sectionTitle: string,
  value: string,
  adminEmail: string,
  targetType: 'text' | 'image' = 'text',
  adminName?: string,
  previousValue?: string
): Promise<void> {
  const overrideRef = doc(db, 'site_overrides', sectionKey);
  const now = new Date().toISOString();

  try {
    // 1. Write the live override
    await setDoc(overrideRef, {
      sectionKey,
      sectionTitle: sectionTitle || '',
      targetType,
      text: value,
      appliedBy: adminEmail,
      updatedAt: now
    });

    // 2. Create version snapshot
    await createSiteVersion({
      sectionKey,
      sectionTitle: sectionTitle || sectionKey,
      targetType,
      previousValue: previousValue || '',
      newValue: value,
      authorEmail: adminEmail,
      authorName: adminName || adminEmail.split('@')[0],
      changeNote: `즉시 실시간 변경 반영`
    });

    // 3. Audit Log
    await logActivity({
      actionType: 'apply',
      target: sectionKey,
      targetTitle: sectionTitle || sectionKey,
      userEmail: adminEmail,
      userName: adminName || adminEmail.split('@')[0],
      details: `즉시 실시간 ${targetType === 'image' ? '배경 사진' : '문구'} 반영`
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `site_overrides/${sectionKey}`);
    throw error;
  }
}

/**
 * Rollback to a specific historical version
 */
export async function rollbackToVersion(
  version: SiteVersion,
  adminEmail: string,
  adminName?: string
): Promise<void> {
  const overrideRef = doc(db, 'site_overrides', version.sectionKey);
  const now = new Date().toISOString();

  try {
    await setDoc(overrideRef, {
      sectionKey: version.sectionKey,
      sectionTitle: version.sectionTitle || '',
      targetType: version.targetType,
      text: version.newValue,
      appliedBy: adminEmail,
      updatedAt: now
    });

    await logActivity({
      actionType: 'rollback',
      target: version.sectionKey,
      targetTitle: version.sectionTitle || version.sectionKey,
      userEmail: adminEmail,
      userName: adminName || adminEmail.split('@')[0],
      details: `${new Date(version.createdAt).toLocaleString()} 버전으로 롤백 복원`
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `site_overrides/${version.sectionKey}`);
    throw error;
  }
}

/**
 * Admin rejects a proposal
 */
export async function rejectProposal(
  proposalId: string,
  rejectionReason?: string,
  adminEmail?: string,
  adminName?: string,
  sectionKey?: string
): Promise<void> {
  const proposalRef = doc(db, 'feedback_proposals', proposalId);
  try {
    await updateDoc(proposalRef, {
      status: 'rejected',
      reason: rejectionReason || '관리자에 의해 반려되었습니다.',
      updatedAt: new Date().toISOString()
    });

    if (adminEmail) {
      await logActivity({
        actionType: 'reject',
        target: sectionKey || proposalId,
        targetTitle: sectionKey || proposalId,
        userEmail: adminEmail,
        userName: adminName || adminEmail.split('@')[0],
        details: rejectionReason || '제안 반려 처리'
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `feedback_proposals/${proposalId}`);
    throw error;
  }
}

/**
 * Admin deletes a proposal
 */
export async function deleteProposal(
  proposalId: string,
  adminEmail?: string,
  adminName?: string,
  targetTitle?: string
): Promise<void> {
  const proposalRef = doc(db, 'feedback_proposals', proposalId);
  try {
    await deleteDoc(proposalRef);
    if (adminEmail) {
      await logActivity({
        actionType: 'delete',
        target: proposalId,
        targetTitle: targetTitle || proposalId,
        userEmail: adminEmail,
        userName: adminName || adminEmail.split('@')[0],
        details: '제안 내역 영구 삭제'
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `feedback_proposals/${proposalId}`);
    throw error;
  }
}

/**
 * Admin reverts an applied override back to the original code default
 */
export async function revertSiteOverride(
  sectionKey: string,
  adminEmail?: string,
  adminName?: string,
  previousValue?: string
): Promise<void> {
  const overrideRef = doc(db, 'site_overrides', sectionKey);
  try {
    await deleteDoc(overrideRef);

    // Record audit log
    if (adminEmail) {
      await logActivity({
        actionType: 'revert',
        target: sectionKey,
        targetTitle: sectionKey,
        userEmail: adminEmail,
        userName: adminName || adminEmail.split('@')[0],
        details: '원래 코드 기본값으로 원복(되돌리기)'
      });
    }

    // Record revert version snapshot
    if (previousValue && adminEmail) {
      await createSiteVersion({
        sectionKey,
        sectionTitle: sectionKey,
        targetType: sectionKey.startsWith('image_') ? 'image' : 'text',
        previousValue,
        newValue: '(코드 기본값으로 복원됨)',
        authorEmail: adminEmail,
        authorName: adminName || adminEmail.split('@')[0],
        changeNote: '기본값으로 원복 실행'
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `site_overrides/${sectionKey}`);
    throw error;
  }
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
 * Add or update an admin user with customizable granular permissions
 */
export async function addOrUpdateAdminUser(
  email: string,
  name: string,
  role: 'developer' | 'admin' = 'admin',
  permissions?: AdminPermissions,
  addedBy: string = 'admin'
): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const docId = cleanEmail;
  const docRef = doc(db, 'admins', docId);

  const finalPermissions = permissions || (role === 'developer' ? DEVELOPER_PERMISSIONS : DEFAULT_ADMIN_PERMISSIONS);

  const payload: AdminUser = {
    id: docId,
    email: cleanEmail,
    name: name.trim() || cleanEmail.split('@')[0],
    role,
    permissions: finalPermissions,
    addedBy,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(docRef, payload, { merge: true });
    await logActivity({
      actionType: 'admin_add',
      target: cleanEmail,
      targetTitle: name || cleanEmail,
      userEmail: addedBy,
      userName: addedBy.split('@')[0],
      details: `${role === 'developer' ? '개발자' : '일반 관리자'} 권한 등록 및 설정`
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `admins/${docId}`);
    throw error;
  }
}

/**
 * Remove an admin user
 */
export async function removeAdminUser(
  email: string,
  operatorEmail: string = 'admin'
): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();
  const docId = cleanEmail;
  const docRef = doc(db, 'admins', docId);

  try {
    await deleteDoc(docRef);
    await logActivity({
      actionType: 'admin_remove',
      target: cleanEmail,
      targetTitle: cleanEmail,
      userEmail: operatorEmail,
      userName: operatorEmail.split('@')[0],
      details: '관리자 권한 목록에서 삭제'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `admins/${docId}`);
    throw error;
  }
}
