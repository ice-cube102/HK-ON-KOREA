import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit3, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Send, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  Trash2, 
  Lock, 
  Layers, 
  Zap, 
  Upload, 
  Check, 
  X,
  UserPlus,
  Users,
  Sliders,
  UploadCloud,
  Crown,
  LogIn,
  History,
  Activity,
  ArrowLeftRight,
  Shield,
  SlidersHorizontal
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from '../firebase';
import { 
  FeedbackProposal, 
  submitFeedbackProposal, 
  subscribeProposals, 
  applyProposal, 
  rejectProposal, 
  deleteProposal, 
  revertSiteOverride, 
  directApplyOverride,
  AdminUser,
  AdminPermissions,
  DEFAULT_ADMIN_PERMISSIONS,
  DEVELOPER_PERMISSIONS,
  subscribeAdminUsers,
  addOrUpdateAdminUser,
  removeAdminUser,
  SiteVersion,
  subscribeSiteVersions,
  deleteSiteVersion,
  rollbackToVersion,
  ActivityLog,
  subscribeActivityLogs
} from '../services/feedbackService';

export const DEVELOPER_EMAIL = 'galaxynoob102@gmail.com';

// Curated high quality presets for non-coders to easily pick replacement images
export const IMAGE_PRESETS = [
  {
    name: '대규모 콜드체인 물류 허브',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600'
  },
  {
    name: '최첨단 스마트 자동화 물류센터',
    url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1600'
  },
  {
    name: '전국 간선 운송 트럭 & 고속 물류망',
    url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1600'
  },
  {
    name: '프리미엄 신선식품 & 콜드 보관',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600'
  },
  {
    name: '유럽 직수입 프리미엄 디저트 & 베이커리',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1600'
  },
  {
    name: '이탈리안 스페셜티 에스프레소 카페',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1600'
  }
];

export const HERO_SLIDES_META = [
  { id: 'image_heroSlide_company', name: '1. HKON 종합 물류 허브', defaultImage: '/images/company.png', desc: '메인 첫 번째 슬라이드 배경' },
  { id: 'image_heroSlide_about-us', name: '2. About Us 비전', defaultImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=60&w=800', desc: '회사 소개 슬라이드 배경' },
  { id: 'image_heroSlide_whats-new', name: "3. What's New 트렌드", defaultImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=60&w=800', desc: '신제품/소식 슬라이드 배경' },
  { id: 'image_heroSlide_haagen-dazs', name: '4. 하겐다즈 프리미엄', defaultImage: '/images/mini_cup.png', desc: '하겐다즈 슬라이드 배경' },
  { id: 'image_heroSlide_lantico', name: '5. 란티코 커피', defaultImage: '/images/lantico.png', desc: '란티코 커피 슬라이드 배경' },
  { id: 'image_heroSlide_caraci', name: '6. 카라치 카다이프', defaultImage: '/images/kadaif_thumbnail.png', desc: '카라치 초콜릿 슬라이드 배경' },
  { id: 'image_heroSlide_general-mills', name: '7. 제너럴밀스 그래놀라', defaultImage: '/images/grnaola_thumbnail.png', desc: '네이처밸리 슬라이드 배경' },
];

/**
 * Client-side image processing:
 * Reads a dropped or selected file, resizes it to max 1920px (preserving aspect ratio)
 * via Canvas, and exports as high-quality compressed JPEG (0.85).
 */
export function processImageFile(file: File): Promise<{ dataUrl: string; width: number; height: number; sizeKb: number; fileName: string }> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('이미지 파일(JPG, PNG, WebP 등)만 업로드할 수 있습니다.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIMENSION = 1920;
        let { width, height } = img;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const raw = e.target?.result as string;
          resolve({
            dataUrl: raw,
            width: img.width,
            height: img.height,
            sizeKb: Math.round(file.size / 1024),
            fileName: file.name
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        resolve({ dataUrl, width, height, sizeKb, fileName: file.name });
      };
      img.onerror = () => reject(new Error('이미지 데이터를 읽어오는 데 실패했습니다.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류가 발생했습니다.'));
    reader.readAsDataURL(file);
  });
}

export interface TargetSectionType {
  key: string;
  title: string;
  currentText?: string;
  isImage?: boolean;
  currentImage?: string;
}

interface FeedbackSystemProps {
  isDarkMode: boolean;
  activeOverrides: Record<string, string>;
  isFeedbackModeActive: boolean;
  setIsFeedbackModeActive: (active: boolean) => void;
  targetSection: TargetSectionType | null;
  setTargetSection: (section: TargetSectionType | null) => void;
  onDirectApplyOptimistic?: (key: string, value: string) => void;
  isAdminActive: boolean;
  setIsAdminActive: (active: boolean) => void;
  isAdminPortalOpen: boolean;
  setIsAdminPortalOpen: (open: boolean) => void;
}

export const FeedbackSystem: React.FC<FeedbackSystemProps> = ({
  activeOverrides,
  isFeedbackModeActive,
  setIsFeedbackModeActive,
  targetSection,
  setTargetSection,
  onDirectApplyOptimistic,
  isAdminActive,
  setIsAdminActive,
  isAdminPortalOpen,
  setIsAdminPortalOpen
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [siteVersions, setSiteVersions] = useState<SiteVersion[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  // Modals & Navigation
  const [isAdminReviewOpen, setIsAdminReviewOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<'control' | 'backgrounds' | 'proposals' | 'versions' | 'logs' | 'admins'>('control');

  // Form states for editing/proposing
  const [targetType, setTargetType] = useState<'text' | 'image'>('text');
  const [selectedSectionKey, setSelectedSectionKey] = useState('');
  const [selectedSectionTitle, setSelectedSectionTitle] = useState('');
  const [currentTextValue, setCurrentTextValue] = useState('');
  const [proposedTextValue, setProposedTextValue] = useState('');
  const [currentImageValue, setCurrentImageValue] = useState('');
  const [proposedImageValue, setProposedImageValue] = useState('');
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ name: string; sizeKb: number; width: number; height: number } | null>(null);
  const [authorNameValue, setAuthorNameValue] = useState('');
  const [reasonValue, setReasonValue] = useState('');
  const [imageInputTab, setImageInputTab] = useState<'upload' | 'url' | 'presets'>('upload');

  // Submit & Action Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Admin proposals state
  const [proposals, setProposals] = useState<FeedbackProposal[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'applied' | 'rejected'>('all');
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  // In-app confirmation dialog state (replaces window.confirm completely)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmColor?: 'rose' | 'amber' | 'emerald';
    onConfirm: () => void;
  } | null>(null);

  // Reject dialog prompt state (replaces window.prompt)
  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    proposalId: string;
    targetTitle: string;
  } | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Admin management form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'developer' | 'admin'>('admin');
  const [newAdminPermissions, setNewAdminPermissions] = useState<AdminPermissions>({ ...DEFAULT_ADMIN_PERMISSIONS });
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [editingAdminEmail, setEditingAdminEmail] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dedicated background upload target
  const [bgUploadKey, setBgUploadKey] = useState<string | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);

  // Show Toast
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1. Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setAuthorNameValue(user.displayName || user.email?.split('@')[0] || '담당자');
      }
    });
    return () => unsub();
  }, []);

  // 2. Real-time subscribe to admin list
  useEffect(() => {
    const unsub = subscribeAdminUsers((list) => {
      setAdminUsers(list);
    });
    return () => unsub();
  }, []);

  // 3. Real-time subscribe to proposals
  useEffect(() => {
    let unsub: (() => void) | null = null;
    if (currentUser) {
      unsub = subscribeProposals((data) => {
        setProposals(data);
      });
    }
    return () => {
      if (unsub) unsub();
    };
  }, [currentUser]);

  // 4. Real-time subscribe to versions & activity logs
  useEffect(() => {
    let unsubVer: (() => void) | null = null;
    let unsubLogs: (() => void) | null = null;
    if (currentUser) {
      unsubVer = subscribeSiteVersions((vers) => setSiteVersions(vers));
      unsubLogs = subscribeActivityLogs((logs) => setActivityLogs(logs));
    }
    return () => {
      if (unsubVer) unsubVer();
      if (unsubLogs) unsubLogs();
    };
  }, [currentUser]);

  // Derived user roles & permissions
  const userEmail = currentUser?.email?.toLowerCase().trim() || '';
  const isDeveloper = userEmail === DEVELOPER_EMAIL.toLowerCase();
  const currentAdminRecord = adminUsers.find(
    (a) => a.email.toLowerCase().trim() === userEmail
  );
  const isRegisteredAdmin = Boolean(currentAdminRecord);
  const hasAdminPrivileges = isDeveloper || isRegisteredAdmin;

  // Granular effective permissions for the current logged-in user
  const effectivePermissions: AdminPermissions = isDeveloper
    ? DEVELOPER_PERMISSIONS
    : currentAdminRecord?.permissions || DEFAULT_ADMIN_PERMISSIONS;

  // Enforce rule: Non-admin users cannot have edit mode active
  useEffect(() => {
    if (!hasAdminPrivileges) {
      if (isAdminActive) setIsAdminActive(false);
      if (isFeedbackModeActive) setIsFeedbackModeActive(false);
    }
  }, [hasAdminPrivileges, isAdminActive, isFeedbackModeActive, setIsAdminActive, setIsFeedbackModeActive]);

  // Handle external trigger from clicking an inline edit pencil or image icon
  useEffect(() => {
    if (targetSection) {
      setSelectedSectionKey(targetSection.key);
      setSelectedSectionTitle(targetSection.title);
      setUploadedFileInfo(null);
      
      if (targetSection.isImage) {
        setTargetType('image');
        setCurrentImageValue(targetSection.currentImage || '');
        setProposedImageValue(targetSection.currentImage || '');
        setImageInputTab('upload');
      } else {
        setTargetType('text');
        setCurrentTextValue(targetSection.currentText || '');
        setProposedTextValue(targetSection.currentText || '');
      }
      setIsSubmitModalOpen(true);
    }
  }, [targetSection]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('Google sign-in popup:', msg);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAdminActive(false);
      setIsFeedbackModeActive(false);
      showToast('로그아웃 되었습니다.', 'info');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Process dropped or selected file
  const handleFileUpload = async (file: File) => {
    try {
      const result = await processImageFile(file);
      setProposedImageValue(result.dataUrl);
      setUploadedFileInfo({
        name: result.fileName,
        sizeKb: result.sizeKb,
        width: result.width,
        height: result.height
      });
      showToast(`사진 파일이 준비되었습니다 (${result.sizeKb}KB)`, 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.';
      showToast(msg, 'error');
    }
  };

  // Immediate 1-click apply by admin/developer
  const handleDirectApply = async () => {
    const isImage = targetType === 'image';
    const valueToApply = isImage ? proposedImageValue.trim() : proposedTextValue.trim();

    if (!valueToApply) {
      showToast(isImage ? '새 이미지를 업로드하거나 선택해주세요.' : '수정할 문구를 입력해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const operatorName = currentUser?.displayName || userEmail.split('@')[0] || '관리자';

      await directApplyOverride(
        selectedSectionKey,
        selectedSectionTitle,
        valueToApply,
        userEmail,
        targetType,
        operatorName,
        isImage ? currentImageValue : currentTextValue
      );

      if (onDirectApplyOptimistic) {
        onDirectApplyOptimistic(selectedSectionKey, valueToApply);
      }

      showToast('🎉 변경사항이 사이트에 즉시 반영되었습니다!');
      setIsSubmitModalOpen(false);
      setTargetSection(null);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      showToast('적용 중 오류 발생: ' + msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct background upload from Background Manager tab
  const handleBackgroundUpload = async (file: File, key: string, name: string) => {
    try {
      setActionInProgressId(key);
      const res = await processImageFile(file);
      const operatorName = currentUser?.displayName || userEmail.split('@')[0] || '관리자';
      const prev = activeOverrides[key];

      await directApplyOverride(key, name, res.dataUrl, userEmail, 'image', operatorName, prev);
      
      if (onDirectApplyOptimistic) {
        onDirectApplyOptimistic(key, res.dataUrl);
      }
      showToast(`'${name}' 배경 사진이 성공적으로 업로드 및 반영되었습니다! (${res.sizeKb}KB)`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('배경 사진 업로드 실패: ' + msg, 'error');
    } finally {
      setActionInProgressId(null);
      setBgUploadKey(null);
    }
  };

  // Submit as proposal
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    const isImage = targetType === 'image';
    const finalProposed = isImage ? proposedImageValue.trim() : proposedTextValue.trim();
    const finalOriginal = isImage ? currentImageValue : currentTextValue;

    if (!finalProposed) {
      showToast(isImage ? '새 이미지를 업로드하거나 선택해주세요.' : '수정 제안할 문구를 입력해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFeedbackProposal({
        authorName: authorNameValue.trim() || '담당자',
        authorEmail: currentUser?.email || 'unauthenticated',
        authorUid: currentUser?.uid || 'anonymous',
        sectionKey: selectedSectionKey,
        sectionTitle: selectedSectionTitle,
        originalText: !isImage ? finalOriginal : undefined,
        proposedText: finalProposed,
        originalImage: isImage ? finalOriginal : undefined,
        proposedImage: isImage ? finalProposed : undefined,
        targetType,
        reason: reasonValue.trim()
      });

      showToast('제안이 정상적으로 등록되었습니다!');
      setIsSubmitModalOpen(false);
      setReasonValue('');
      setTargetSection(null);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      showToast('등록 중 오류 발생: ' + msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add or update admin user
  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) {
      showToast('이메일을 입력해주세요.', 'error');
      return;
    }

    setIsAddingAdmin(true);
    try {
      await addOrUpdateAdminUser(
        newAdminEmail.trim(),
        newAdminName.trim() || newAdminEmail.split('@')[0],
        newAdminRole,
        newAdminPermissions,
        currentUser?.email || 'admin'
      );
      showToast(`✅ ${newAdminEmail} 관리자 권한이 저장되었습니다.`);
      setNewAdminEmail('');
      setNewAdminName('');
      setEditingAdminEmail(null);
      setNewAdminPermissions({ ...DEFAULT_ADMIN_PERMISSIONS });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('저장 실패: ' + msg, 'error');
    } finally {
      setIsAddingAdmin(false);
    }
  };

  // Remove admin user
  const handleRemoveAdminConfirm = (email: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '관리자 권한 삭제',
      message: `${email} 계정을 관리자 목록에서 삭제하시겠습니까? 삭제 후 해당 계정의 수정 권한이 제거됩니다.`,
      confirmText: '삭제하기',
      confirmColor: 'rose',
      onConfirm: async () => {
        try {
          await removeAdminUser(email, userEmail);
          showToast(`🗑️ ${email} 계정이 삭제되었습니다.`);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          showToast('삭제 실패: ' + msg, 'error');
        }
      }
    });
  };

  // Proposal apply action
  const handleApply = async (prop: FeedbackProposal) => {
    setActionInProgressId(prop.id);
    const applyVal = prop.proposedImage || prop.proposedText;
    const operatorName = currentUser?.displayName || userEmail.split('@')[0] || '관리자';

    // Optimistic update
    if (onDirectApplyOptimistic) {
      onDirectApplyOptimistic(prop.sectionKey, applyVal);
    }

    try {
      await applyProposal(prop, userEmail, operatorName, activeOverrides[prop.sectionKey]);
      showToast(`'${prop.sectionTitle || prop.sectionKey}'이(가) 실시간 반영되었습니다.`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      showToast('적용 실패: ' + msg, 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Proposal revert action (using in-app confirm dialog, NO window.confirm)
  const handleRevertPrompt = (sectionKey: string, sectionTitle?: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '코드 기본값으로 되돌리기',
      message: `'${sectionTitle || sectionKey}' 항목을 수정한 내역을 해제하고 원래 기본 코드로 되돌리시겠습니까?`,
      confirmText: '되돌리기(원복)',
      confirmColor: 'amber',
      onConfirm: async () => {
        setActionInProgressId(sectionKey);
        const previousVal = activeOverrides[sectionKey];

        // Optimistic update
        if (onDirectApplyOptimistic) {
          onDirectApplyOptimistic(sectionKey, '');
        }

        try {
          await revertSiteOverride(sectionKey, userEmail, currentUser?.displayName || userEmail.split('@')[0], previousVal);
          showToast(`'${sectionTitle || sectionKey}'이(가) 기본값으로 원복되었습니다.`);
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          showToast('원복 실패: ' + msg, 'error');
        } finally {
          setActionInProgressId(null);
        }
      }
    });
  };

  // Reject proposal action with in-app dialog
  const handleRejectPrompt = (prop: FeedbackProposal) => {
    setRejectionReasonInput('');
    setRejectDialog({
      isOpen: true,
      proposalId: prop.id,
      targetTitle: prop.sectionTitle || prop.sectionKey
    });
  };

  const handleConfirmReject = async () => {
    if (!rejectDialog) return;
    const { proposalId, targetTitle } = rejectDialog;
    setActionInProgressId(proposalId);
    setRejectDialog(null);

    // Optimistic update
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'rejected' } : p));

    try {
      await rejectProposal(
        proposalId, 
        rejectionReasonInput.trim() || '관리자에 의해 반려되었습니다.',
        userEmail,
        currentUser?.displayName || userEmail.split('@')[0],
        targetTitle
      );
      showToast('해당 제안이 반려 처리되었습니다.');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      showToast('반려 처리 실패: ' + msg, 'error');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Delete proposal action (using in-app confirm dialog, NO window.confirm)
  const handleDeletePrompt = (prop: FeedbackProposal) => {
    setConfirmDialog({
      isOpen: true,
      title: '제안 내역 삭제',
      message: `'${prop.sectionTitle || prop.sectionKey}' 제안 기록을 완전히 삭제하시겠습니까?`,
      confirmText: '삭제하기',
      confirmColor: 'rose',
      onConfirm: async () => {
        setActionInProgressId(prop.id);
        // Optimistic update
        setProposals(prev => prev.filter(p => p.id !== prop.id));

        try {
          await deleteProposal(prop.id, userEmail, currentUser?.displayName || userEmail.split('@')[0], prop.sectionTitle || prop.sectionKey);
          showToast('제안 내역이 영구 삭제되었습니다.');
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          showToast('삭제 실패: ' + msg, 'error');
        } finally {
          setActionInProgressId(null);
        }
      }
    });
  };

  // Rollback to historical version
  const handleRollbackPrompt = (ver: SiteVersion) => {
    setConfirmDialog({
      isOpen: true,
      title: '버전 롤백 (이전 상태로 복원)',
      message: `'${ver.sectionTitle || ver.sectionKey}'을(를) ${new Date(ver.createdAt).toLocaleString()} 시점의 내용으로 사이트에 즉시 복원하시겠습니까?`,
      confirmText: '이 버전으로 롤백',
      confirmColor: 'emerald',
      onConfirm: async () => {
        setActionInProgressId(ver.id);
        // Optimistic update
        if (onDirectApplyOptimistic) {
          onDirectApplyOptimistic(ver.sectionKey, ver.newValue);
        }

        try {
          await rollbackToVersion(ver, userEmail, currentUser?.displayName || userEmail.split('@')[0]);
          showToast(`'${ver.sectionTitle}' 버전으로 사이트가 성공적으로 롤백되었습니다!`);
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          showToast('롤백 복원 실패: ' + msg, 'error');
        } finally {
          setActionInProgressId(null);
        }
      }
    });
  };

  // Delete a version snapshot
  const handleDeleteVersion = async (verId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '버전 스냅샷 삭제',
      message: '이 버전 기록을 영구히 삭제하시겠습니까?',
      confirmText: '삭제',
      confirmColor: 'rose',
      onConfirm: async () => {
        try {
          await deleteSiteVersion(verId);
          showToast('버전 기록이 삭제되었습니다.');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          showToast('삭제 실패: ' + msg, 'error');
        }
      }
    });
  };

  const filteredProposals = proposals.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const pendingCount = proposals.filter((p) => p.status === 'pending').length;

  return (
    <>
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-fadeIn transition-all ${
          toastMessage.type === 'error'
            ? 'bg-rose-600 text-white'
            : toastMessage.type === 'info'
            ? 'bg-blue-600 text-white'
            : 'bg-emerald-600 text-white'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Custom In-App Confirmation Dialog (Replaces window.confirm) */}
      {confirmDialog?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${
                confirmDialog.confirmColor === 'rose'
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                  : confirmDialog.confirmColor === 'amber'
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
                  : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
              }`}>
                <Shield size={20} />
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                {confirmDialog.title}
              </h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                  confirmDialog.confirmColor === 'rose'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : confirmDialog.confirmColor === 'amber'
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {confirmDialog.confirmText || '확인'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Dialog Prompt (Replaces window.prompt) */}
      {rejectDialog?.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
                <XCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  제안 반려 처리
                </h4>
                <p className="text-xs text-gray-400">{rejectDialog.targetTitle}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                반려 사유 입력 (선택)
              </label>
              <input
                type="text"
                autoFocus
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="예: 최신 브랜드 가이드라인과 불일치"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectDialog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
              >
                반려 확정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          0. Admin Portal Modal (Clean, Secure & Multi-Tab Hub)
          ======================================================== */}
      {isAdminPortalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header: Clean, Security-Respecting (No developer email leak) */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                  isDeveloper 
                    ? 'bg-purple-600/15 text-purple-600 dark:text-purple-400' 
                    : hasAdminPrivileges 
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {isDeveloper ? <Crown size={24} /> : <ShieldCheck size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span>HKON 보안 관리 센터</span>
                    {isDeveloper && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                        <Crown size={10} /> 개발자 마스터
                      </span>
                    )}
                    {isRegisteredAdmin && !isDeveloper && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {currentAdminRecord?.name || '일반 관리자'}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser ? (
                      <span>로그인 계정: <strong>{currentUser.email}</strong></span>
                    ) : (
                      <span>보안 담당자 인증이 필요합니다</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAdminPortalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            {/* CASE 1: NOT LOGGED IN (Clean, zero exposure of admin/developer emails) */}
            {!currentUser && (
              <div className="p-8 space-y-6">
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 space-y-2">
                  <p className="font-bold text-sm flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <ShieldCheck size={18} className="text-amber-500" />
                    HKON 웹사이트 담당자 전용 인증
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    등록된 관리자 계정으로 로그인 시 <strong>수정 탭</strong>, <strong>배경 사진 실시간 업로드</strong>, <strong>버전 히스토리 롤백</strong> 기능이 활성화됩니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm shadow-xl hover:opacity-90 cursor-pointer transition-all"
                  >
                    <LogIn size={18} />
                    <span>Google 계정으로 보안 로그인</span>
                  </button>
                  <p className="text-center text-[11px] text-gray-400">
                    허용 도메인: <strong>hkonkorea.com</strong> 및 공식 인증 계정
                  </p>
                </div>
              </div>
            )}

            {/* CASE 2: LOGGED IN BUT NOT REGISTERED AS ADMIN */}
            {currentUser && !hasAdminPrivileges && (
              <div className="p-8 space-y-6">
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 space-y-3">
                  <p className="font-bold text-sm flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                    <AlertCircle size={18} />
                    관리자로 등록되지 않은 계정입니다
                  </p>
                  <p className="leading-relaxed">
                    현재 로그인된 계정(<strong>{currentUser.email}</strong>)은 관리자 권한 목록에 등록되어 있지 않습니다.
                  </p>
                  <p className="text-rose-700/80 dark:text-rose-300/80">
                    보안 정책에 따라 <strong>수정 탭 및 관리 도구가 노출되지 않습니다.</strong> 권한이 필요한 경우 총괄 담당자에게 승인을 요청하세요.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs shadow-md cursor-pointer hover:opacity-90 transition-all"
                  >
                    <LogIn size={14} />
                    <span>다른 계정으로 로그인</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-xs cursor-pointer transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}

            {/* CASE 3: LOGGED IN WITH ADMIN PRIVILEGES */}
            {currentUser && hasAdminPrivileges && (
              <>
                {/* 6 Comprehensive Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 px-4 text-xs font-semibold overflow-x-auto scrollbar-none">
                  <button
                    onClick={() => setPortalTab('control')}
                    className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'control'
                        ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Sliders size={14} />
                    <span>모드 제어</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('backgrounds')}
                    className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'backgrounds'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <UploadCloud size={14} />
                    <span>배경 사진 업로드</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('proposals')}
                    className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'proposals'
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FileText size={14} />
                    <span>검토함</span>
                    {pendingCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                        {pendingCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setPortalTab('versions')}
                    className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'versions'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <History size={14} />
                    <span>버전 히스토리 ({siteVersions.length})</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('logs')}
                    className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'logs'
                        ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Activity size={14} />
                    <span>활동 로그 ({activityLogs.length})</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('admins')}
                    className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'admins'
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Users size={14} />
                    <span>권한 설정 ({adminUsers.length + 1})</span>
                  </button>
                </div>

                {/* Tab Contents Body */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                  
                  {/* TAB 1: MODE & SWITCHES */}
                  {portalTab === 'control' && (
                    <div className="space-y-4">
                      {/* Status Banner */}
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>
                            <strong>{isDeveloper ? '개발자 마스터' : '인증 관리자'}</strong> 권한이 활성화되어 있습니다.
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                          {effectivePermissions.canDirectApply && <span className="bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded">즉시승인</span>}
                          {effectivePermissions.canRevert && <span className="bg-amber-200 dark:bg-amber-800 px-1.5 py-0.5 rounded">원복</span>}
                          {effectivePermissions.canDelete && <span className="bg-rose-200 dark:bg-rose-800 px-1.5 py-0.5 rounded">삭제</span>}
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="space-y-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            const next = !isAdminActive;
                            setIsAdminActive(next);
                            if (!next) setIsFeedbackModeActive(false);
                          }}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                            isAdminActive
                              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                              : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isAdminActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                              <Zap size={18} />
                            </div>
                            <div>
                              <div className="font-bold text-sm">관리자 수정 도구바 (하단 도크 탭)</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {isAdminActive ? '화면 좌측 하단에 제어 탭이 표시 중입니다' : '하단 수정 도구바가 숨겨져 있습니다'}
                              </div>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${isAdminActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                            {isAdminActive ? 'ON' : 'OFF'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (!isAdminActive) setIsAdminActive(true);
                            setIsFeedbackModeActive(!isFeedbackModeActive);
                          }}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                            isFeedbackModeActive
                              ? 'border-amber-400 bg-amber-500/10 text-amber-900 dark:text-amber-200'
                              : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isFeedbackModeActive ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                              <Edit3 size={18} />
                            </div>
                            <div>
                              <div className="font-bold text-sm">화면 직접 수정 버튼 (문구✏️ & 배경 사진🖼️)</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {isFeedbackModeActive ? '웹사이트 곳곳에 수정 버튼이 켜져 있습니다' : '화면에 노출되는 수정 버튼이 꺼져 있습니다'}
                              </div>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${isFeedbackModeActive ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                            {isFeedbackModeActive ? 'ON' : 'OFF'}
                          </span>
                        </button>
                      </div>

                      {/* Quick Links */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setPortalTab('backgrounds')}
                          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <UploadCloud size={16} />
                          <span>Hero 배경 사진 업로드</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPortalTab('versions')}
                          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          <History size={16} />
                          <span>버전 히스토리 및 롤백</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: BACKGROUND IMAGE UPLOAD (DRAG & DROP) */}
                  {portalTab === 'backgrounds' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                          <UploadCloud size={16} className="text-blue-500" />
                          Hero 슬라이드 배경 사진 실시간 업로드 (드롭 & 업로드)
                        </p>
                        <p className="text-blue-800/80 dark:text-blue-300/80">
                          컴퓨터에서 사진을 드래그하여 업로드하거나 프리셋에서 1초 만에 교체할 수 있습니다.
                        </p>
                      </div>

                      {/* Hidden file input */}
                      <input 
                        type="file" 
                        ref={bgFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && bgUploadKey) {
                            const found = HERO_SLIDES_META.find(s => s.id === bgUploadKey);
                            handleBackgroundUpload(file, bgUploadKey, found?.name || '배경 사진');
                          }
                          e.target.value = '';
                        }}
                      />

                      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                        {HERO_SLIDES_META.map((slide) => {
                          const currentLive = activeOverrides[slide.id] || slide.defaultImage;
                          const isCustomized = Boolean(activeOverrides[slide.id]);
                          const isUpdating = actionInProgressId === slide.id;

                          return (
                            <div
                              key={slide.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                isCustomized
                                  ? 'border-blue-300 dark:border-blue-800/80 bg-blue-50/20 dark:bg-blue-950/20'
                                  : 'border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="relative w-28 h-18 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 bg-gray-900 shadow-sm">
                                  <img 
                                    src={currentLive} 
                                    alt={slide.name} 
                                    className="w-full h-full object-cover"
                                  />
                                  {isCustomized && (
                                    <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">
                                      수정됨
                                    </span>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                    {slide.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {slide.desc}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {effectivePermissions.canManageBackgrounds && (
                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      onClick={() => {
                                        setBgUploadKey(slide.id);
                                        bgFileInputRef.current?.click();
                                      }}
                                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                                    >
                                      <Upload size={13} />
                                      <span>{isUpdating ? '업로드 중...' : '사진 업로드'}</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedSectionKey(slide.id);
                                      setSelectedSectionTitle(slide.name);
                                      setTargetType('image');
                                      setCurrentImageValue(currentLive);
                                      setProposedImageValue(currentLive);
                                      setImageInputTab('upload');
                                      setIsSubmitModalOpen(true);
                                      setIsAdminPortalOpen(false);
                                    }}
                                    className="p-2 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    title="상세 편집 (드롭, URL, 프리셋)"
                                  >
                                    <Edit3 size={14} />
                                  </button>

                                  {isCustomized && effectivePermissions.canRevert && (
                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      onClick={() => handleRevertPrompt(slide.id, slide.name)}
                                      className="p-2 rounded-xl text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors cursor-pointer"
                                      title="원래 기본 사진으로 되돌리기"
                                    >
                                      <RotateCcw size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PROPOSALS & REVIEW HUB */}
                  {portalTab === 'proposals' && (
                    <div className="space-y-4">
                      {/* Filter Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1.5">
                          {(['all', 'pending', 'applied', 'rejected'] as const).map((st) => (
                            <button
                              key={st}
                              onClick={() => setFilterStatus(st)}
                              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                                filterStatus === st
                                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                              }`}
                            >
                              {st === 'all' && `전체 (${proposals.length})`}
                              {st === 'pending' && `대기 중 (${proposals.filter((p) => p.status === 'pending').length})`}
                              {st === 'applied' && `적용됨 (${proposals.filter((p) => p.status === 'applied').length})`}
                              {st === 'rejected' && `반려 (${proposals.filter((p) => p.status === 'rejected').length})`}
                            </button>
                          ))}
                        </div>
                        <div className="text-gray-500 text-xs">
                          현재 사이트 적용 건: <strong>{Object.keys(activeOverrides).length}개</strong>
                        </div>
                      </div>

                      {/* Proposals List */}
                      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                        {filteredProposals.length === 0 ? (
                          <div className="py-12 text-center text-gray-400 text-xs">
                            제안 내역이 없습니다.
                          </div>
                        ) : (
                          filteredProposals.map((prop) => {
                            const isImage = prop.targetType === 'image' || prop.sectionKey.startsWith('image_');
                            const isCurrentlyActive = activeOverrides[prop.sectionKey] === (prop.proposedImage || prop.proposedText);

                            return (
                              <div
                                key={prop.id}
                                className={`border rounded-2xl p-4 transition-all ${
                                  prop.status === 'pending'
                                    ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
                                    : prop.status === 'applied'
                                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 opacity-80'
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                      prop.status === 'pending' ? 'bg-amber-100 text-amber-700' : prop.status === 'applied' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                    }`}>
                                      {prop.status === 'pending' ? '⏳ 검토 대기' : prop.status === 'applied' ? '✅ 적용됨' : '❌ 반려됨'}
                                    </span>
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                                      {prop.sectionTitle || prop.sectionKey}
                                    </span>
                                  </div>
                                  <div className="text-gray-400 text-[11px]">
                                    작성자: {prop.authorName} • {new Date(prop.createdAt).toLocaleDateString()}
                                  </div>
                                </div>

                                {/* Content preview */}
                                {isImage ? (
                                  <div className="grid grid-cols-2 gap-3 py-3 text-xs">
                                    <div>
                                      <span className="text-[10px] text-gray-400 block mb-1">기존 사진</span>
                                      <img src={prop.originalImage} alt="Original" className="w-full h-24 object-cover rounded-lg border" />
                                    </div>
                                    <div>
                                      <span className="text-[10px] text-blue-500 font-bold block mb-1">제안된 새 사진</span>
                                      <img src={prop.proposedImage || prop.proposedText} alt="Proposed" className="w-full h-24 object-cover rounded-lg border-2 border-blue-400" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="py-2 text-xs">
                                    <div className="text-emerald-700 dark:text-emerald-300 font-medium whitespace-pre-line bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                                      {prop.proposedText}
                                    </div>
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-2">
                                  <div>
                                    {isCurrentlyActive && (
                                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> 라이브 적용 중
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {effectivePermissions.canDirectApply && (
                                      <button
                                        type="button"
                                        onClick={() => handleApply(prop)}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                                      >
                                        사이트 적용
                                      </button>
                                    )}

                                    {activeOverrides[prop.sectionKey] && effectivePermissions.canRevert && (
                                      <button
                                        type="button"
                                        onClick={() => handleRevertPrompt(prop.sectionKey, prop.sectionTitle)}
                                        className="px-3 py-1.5 rounded-xl text-amber-700 bg-amber-100 hover:bg-amber-200 text-xs font-bold cursor-pointer"
                                      >
                                        되돌리기
                                      </button>
                                    )}

                                    {prop.status === 'pending' && effectivePermissions.canReject && (
                                      <button
                                        type="button"
                                        onClick={() => handleRejectPrompt(prop)}
                                        className="px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                                      >
                                        거절/반려
                                      </button>
                                    )}

                                    {effectivePermissions.canDelete && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeletePrompt(prop)}
                                        className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 cursor-pointer"
                                        title="삭제"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: VERSION HISTORY & ROLLBACK */}
                  {portalTab === 'versions' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold flex items-center gap-1.5">
                            <History size={16} className="text-indigo-500" />
                            버전 히스토리 및 원클릭 롤백 복원
                          </p>
                          <p className="text-indigo-800/80 dark:text-indigo-300/80">
                            모든 수정 사항이 스냅샷으로 기록되며, 과거 어떤 시점으로든 1클릭 복원할 수 있습니다.
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200">
                          총 {siteVersions.length}개 스냅샷
                        </span>
                      </div>

                      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                        {siteVersions.length === 0 ? (
                          <div className="py-12 text-center text-gray-400 text-xs">
                            아직 기록된 버전 스냅샷이 없습니다. 문구나 배경 사진을 변경하면 자동으로 버전이 생성됩니다.
                          </div>
                        ) : (
                          siteVersions.map((ver) => {
                            const isImage = ver.targetType === 'image';
                            const isCurrentlyActive = activeOverrides[ver.sectionKey] === ver.newValue;

                            return (
                              <div
                                key={ver.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                  isCurrentlyActive
                                    ? 'border-indigo-400 bg-indigo-50/30 dark:bg-indigo-950/20'
                                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60'
                                }`}
                              >
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900 dark:text-white">
                                      {ver.sectionTitle || ver.sectionKey}
                                    </span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                      {isImage ? '배경 사진' : '문구'}
                                    </span>
                                    {isCurrentlyActive && (
                                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-emerald-100 text-emerald-700">
                                        현재 사이트 반영 중
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-gray-400 text-[11px]">
                                    작업자: {ver.authorName || ver.authorEmail} • {new Date(ver.createdAt).toLocaleString()}
                                  </div>
                                </div>

                                <div className="py-2 text-xs">
                                  {isImage ? (
                                    <div className="flex items-center gap-3">
                                      <img src={ver.newValue} alt="Version" className="w-24 h-16 object-cover rounded-xl border shadow-sm" />
                                      <p className="text-[11px] text-gray-500 font-mono truncate">{ver.newValue}</p>
                                    </div>
                                  ) : (
                                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed max-h-24 overflow-y-auto bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700">
                                      {ver.newValue}
                                    </p>
                                  )}
                                  {ver.changeNote && (
                                    <p className="text-[11px] text-gray-400 mt-1.5">
                                      메모: {ver.changeNote}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                                  {effectivePermissions.canDirectApply && !isCurrentlyActive && (
                                    <button
                                      type="button"
                                      onClick={() => handleRollbackPrompt(ver)}
                                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm cursor-pointer"
                                    >
                                      <ArrowLeftRight size={13} />
                                      <span>이 버전으로 복원 (롤백)</span>
                                    </button>
                                  )}

                                  {effectivePermissions.canDelete && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteVersion(ver.id)}
                                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 cursor-pointer"
                                      title="버전 삭제"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: AUDIT ACTIVITY LOGS */}
                  {portalTab === 'logs' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold flex items-center gap-1.5">
                            <Activity size={16} className="text-teal-500" />
                            실시간 관리자 활동 감사 로그 (Audit Trail)
                          </p>
                          <p className="text-teal-800/80 dark:text-teal-300/80">
                            승인, 거절, 원복, 삭제, 권한 설정 등 모든 관리자 액션이 실시간 기록됩니다.
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                          {activityLogs.length}건
                        </span>
                      </div>

                      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                        {activityLogs.length === 0 ? (
                          <div className="py-12 text-center text-gray-400 text-xs">
                            활동 로그 내역이 없습니다.
                          </div>
                        ) : (
                          activityLogs.map((log) => {
                            const typeColor = 
                              log.actionType === 'apply' ? 'bg-emerald-100 text-emerald-800' :
                              log.actionType === 'revert' ? 'bg-amber-100 text-amber-800' :
                              log.actionType === 'reject' ? 'bg-rose-100 text-rose-800' :
                              log.actionType === 'rollback' ? 'bg-indigo-100 text-indigo-800' :
                              log.actionType === 'admin_add' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800';

                            return (
                              <div
                                key={log.id}
                                className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeColor}`}>
                                    {log.actionType.toUpperCase()}
                                  </span>
                                  <div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                      {log.details || log.targetTitle}
                                    </p>
                                    <p className="text-[11px] text-gray-400 font-mono">
                                      대상: {log.target}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right text-[11px] text-gray-400 shrink-0">
                                  <p>{log.userName || log.userEmail}</p>
                                  <p className="text-[10px]">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: GRANULAR ADMIN PERMISSION SETTINGS */}
                  {portalTab === 'admins' && (
                    <div className="space-y-5">
                      {/* Developer Master Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                            <Crown size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-900 dark:text-white">
                                {isDeveloper ? userEmail : '개발자 마스터 계정'}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                                최고 관리자
                              </span>
                            </div>
                            <p className="text-xs text-purple-800/80 dark:text-purple-300/80">
                              모든 권한(즉시 승인, 거절, 삭제, 원복, 배경 사진, 관리자 제어) 보유
                            </p>
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-purple-600">
                          ALL PERMISSIONS
                        </div>
                      </div>

                      {/* Add/Edit Admin Form */}
                      {effectivePermissions.canManageAdmins && (
                        <form onSubmit={handleSaveAdmin} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                              <UserPlus size={15} className="text-purple-600" />
                              <span>{editingAdminEmail ? `${editingAdminEmail} 권한 수정` : '새 관리자 등록 및 상세 권한 설정'}</span>
                            </h4>
                            {editingAdminEmail && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAdminEmail(null);
                                  setNewAdminEmail('');
                                  setNewAdminName('');
                                  setNewAdminPermissions({ ...DEFAULT_ADMIN_PERMISSIONS });
                                }}
                                className="text-xs text-gray-500 hover:text-gray-700 underline cursor-pointer"
                              >
                                신규 등록으로 전환
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] text-gray-500 mb-1">
                                관리자 로그인 이메일 <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="email"
                                required
                                disabled={Boolean(editingAdminEmail)}
                                value={newAdminEmail}
                                onChange={(e) => setNewAdminEmail(e.target.value)}
                                placeholder="staff@hkonkorea.com"
                                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs font-mono outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-gray-500 mb-1">
                                담당자 이름 / 직책
                              </label>
                              <input
                                type="text"
                                value={newAdminName}
                                onChange={(e) => setNewAdminName(e.target.value)}
                                placeholder="김물류 대리"
                                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>

                          {/* Granular Permissions Checkboxes */}
                          <div>
                            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                              <SlidersHorizontal size={13} />
                              <span>세부 관리자 권한 설정 (체크 시 허용)</span>
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                              <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newAdminPermissions.canDirectApply}
                                  onChange={(e) => setNewAdminPermissions(p => ({ ...p, canDirectApply: e.target.checked }))}
                                  className="rounded text-purple-600"
                                />
                                <span>즉시 라이브 승인</span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newAdminPermissions.canReject}
                                  onChange={(e) => setNewAdminPermissions(p => ({ ...p, canReject: e.target.checked }))}
                                  className="rounded text-purple-600"
                                />
                                <span>제안 거절/반려</span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newAdminPermissions.canRevert}
                                  onChange={(e) => setNewAdminPermissions(p => ({ ...p, canRevert: e.target.checked }))}
                                  className="rounded text-purple-600"
                                />
                                <span>기본값 되돌리기(원복)</span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newAdminPermissions.canDelete}
                                  onChange={(e) => setNewAdminPermissions(p => ({ ...p, canDelete: e.target.checked }))}
                                  className="rounded text-purple-600"
                                />
                                <span>내역/버전 삭제</span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newAdminPermissions.canManageBackgrounds}
                                  onChange={(e) => setNewAdminPermissions(p => ({ ...p, canManageBackgrounds: e.target.checked }))}
                                  className="rounded text-purple-600"
                                />
                                <span>배경 사진 업로드</span>
                              </label>

                              {isDeveloper && (
                                <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={newAdminPermissions.canManageAdmins}
                                    onChange={(e) => setNewAdminPermissions(p => ({ ...p, canManageAdmins: e.target.checked }))}
                                    className="rounded text-purple-600"
                                  />
                                  <span>관리자 계정 관리</span>
                                </label>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              type="submit"
                              disabled={isAddingAdmin}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                            >
                              <UserPlus size={13} />
                              <span>{isAddingAdmin ? '저장 중...' : editingAdminEmail ? '권한 업데이트' : '관리자 등록하기'}</span>
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Registered Admin List */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center justify-between">
                          <span>등록된 관리자 목록 ({adminUsers.length}명)</span>
                        </h4>

                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {adminUsers.map((admin) => (
                            <div
                              key={admin.email}
                              className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                                    {(admin.name || admin.email)[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-gray-900 dark:text-white">
                                        {admin.name || admin.email}
                                      </span>
                                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-blue-100 text-blue-700">
                                        일반 관리자
                                      </span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-mono">
                                      {admin.email}
                                    </span>
                                  </div>
                                </div>

                                {effectivePermissions.canManageAdmins && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingAdminEmail(admin.email);
                                        setNewAdminEmail(admin.email);
                                        setNewAdminName(admin.name || '');
                                        setNewAdminPermissions(admin.permissions || { ...DEFAULT_ADMIN_PERMISSIONS });
                                      }}
                                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                                      title="권한 수정"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveAdminConfirm(admin.email)}
                                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 cursor-pointer"
                                      title="관리자 삭제"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Permission Badges */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-gray-500">
                                <span className={admin.permissions?.canDirectApply ? 'text-emerald-600 font-bold' : 'line-through text-gray-300'}>즉시승인</span>
                                <span>•</span>
                                <span className={admin.permissions?.canReject ? 'text-rose-600 font-bold' : 'line-through text-gray-300'}>반려</span>
                                <span>•</span>
                                <span className={admin.permissions?.canRevert ? 'text-amber-600 font-bold' : 'line-through text-gray-300'}>원복</span>
                                <span>•</span>
                                <span className={admin.permissions?.canDelete ? 'text-rose-600 font-bold' : 'line-through text-gray-300'}>삭제</span>
                                <span>•</span>
                                <span className={admin.permissions?.canManageBackgrounds ? 'text-blue-600 font-bold' : 'line-through text-gray-300'}>배경사진</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-gray-500">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>인증 계정: <strong>{currentUser.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      로그아웃
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAdminPortalOpen(false)}
                      className="px-4 py-1.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold cursor-pointer"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          1. Global Floating Control Bar (ONLY rendered for admins)
          ======================================================== */}
      {isAdminActive && hasAdminPrivileges && (
        <div className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3 pointer-events-auto animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-amber-500/30 dark:border-amber-500/30">
            {/* Identity badge */}
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${
              isDeveloper 
                ? 'bg-purple-600/10 text-purple-800 dark:text-purple-300' 
                : 'bg-amber-500/10 text-amber-800 dark:text-amber-300'
            }`}>
              {isDeveloper ? <Crown size={14} className="text-purple-600" /> : <ShieldCheck size={14} className="text-amber-500" />}
              <span className="truncate max-w-[140px]">{currentUser?.displayName || currentUser?.email?.split('@')[0]}</span>
              <span className="text-[10px] font-normal opacity-75">
                {isDeveloper ? '[개발자]' : '[관리자]'}
              </span>
            </div>

            {/* Toggle edit buttons */}
            <button
              onClick={() => setIsFeedbackModeActive(!isFeedbackModeActive)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isFeedbackModeActive
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title="화면의 문구 ✏️ 및 배경/이미지 🖼️ 편집 버튼 켜기/끄기"
            >
              <Edit3 size={13} className={isFeedbackModeActive ? 'animate-bounce' : ''} />
              <span>{isFeedbackModeActive ? '수정 버튼 [ON]' : '수정 버튼 [OFF]'}</span>
            </button>

            {/* Quick Background Manager Jump */}
            {effectivePermissions.canManageBackgrounds && (
              <button
                onClick={() => {
                  setPortalTab('backgrounds');
                  setIsAdminPortalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200 dark:border-blue-800"
              >
                <UploadCloud size={13} className="text-blue-500" />
                <span>배경 업로드</span>
              </button>
            )}

            {/* History / Versions Jump */}
            <button
              onClick={() => {
                setPortalTab('versions');
                setIsAdminPortalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-200 dark:border-indigo-800"
            >
              <History size={13} className="text-indigo-500" />
              <span>버전 롤백</span>
            </button>

            {/* Admin Hub button */}
            <button
              onClick={() => {
                setPortalTab('proposals');
                setIsAdminPortalOpen(true);
              }}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-90 cursor-pointer shadow-sm"
            >
              <ShieldCheck size={13} className="text-amber-400" />
              <span>검토함</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            {/* Close / Exit Admin Mode */}
            <button
              onClick={() => {
                setIsAdminActive(false);
                setIsFeedbackModeActive(false);
              }}
              className="p-2 text-gray-400 hover:text-rose-500 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              title="관리자 모드 종료"
              aria-label="종료"
            >
              <X size={15} />
            </button>
          </div>

          {/* Banner indicator */}
          {isFeedbackModeActive && (
            <div className="bg-amber-500/95 text-white text-xs px-3.5 py-2 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-2 animate-fadeIn border border-amber-400">
              <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
              <span>
                화면의 <strong>[✏️ 문구 수정]</strong> 또는 <strong>[🖼️ 배경 사진 변경]</strong> 버튼을 누르면 편집창이 열립니다!
              </span>
              <button
                onClick={() => setIsFeedbackModeActive(false)}
                className="ml-2 text-white/80 hover:text-white underline cursor-pointer shrink-0"
              >
                숨기기
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          2. Unified Proposal & Direct Apply Modal (Drag & Drop)
          ======================================================== */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${targetType === 'image' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                  {targetType === 'image' ? <UploadCloud size={22} /> : <Edit3 size={22} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span>{targetType === 'image' ? '배경 사진 업로드 & 변경' : '화면 문구(텍스트) 수정'}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${targetType === 'image' ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}`}>
                      {selectedSectionTitle || selectedSectionKey}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    ID: {selectedSectionKey}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  setTargetSection(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitProposal} className="p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* IMAGE EDITING & UPLOAD SECTION */}
              {targetType === 'image' ? (
                <div className="space-y-4">
                  {currentImageValue && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        현재 사이트에 적용 중인 원본 사진
                      </label>
                      <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <img 
                          src={currentImageValue} 
                          alt="Current" 
                          className="w-20 h-14 object-cover rounded-xl border shadow-sm shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="text-xs text-gray-500 truncate font-mono flex-1">
                          {currentImageValue}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload Mode Selector (Tabs) */}
                  <div>
                    <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 text-xs font-bold mb-3">
                      <button
                        type="button"
                        onClick={() => setImageInputTab('upload')}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          imageInputTab === 'upload'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <UploadCloud size={14} />
                        <span>사진 파일 업로드 / 드롭</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageInputTab('url')}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          imageInputTab === 'url'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <Zap size={14} />
                        <span>웹 URL 입력</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageInputTab('presets')}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          imageInputTab === 'presets'
                            ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <Sparkles size={14} />
                        <span>고화질 프리셋 (1초 선택)</span>
                      </button>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />

                    {/* DRAG & DROP FILE UPLOAD */}
                    {imageInputTab === 'upload' && (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 scale-[1.01]'
                            : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 bg-gray-50/50 dark:bg-gray-800/40'
                        }`}
                      >
                        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <UploadCloud size={30} />
                        </div>
                        <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
                          사진 파일을 여기에 드래그하거나 클릭하여 업로드
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          JPG, PNG, WebP 등 모든 이미지 지원 • 최대 1920px 자동 최적화
                        </p>

                        {uploadedFileInfo && (
                          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                            <CheckCircle size={14} />
                            <span>{uploadedFileInfo.name} ({uploadedFileInfo.width}×{uploadedFileInfo.height}, {uploadedFileInfo.sizeKb}KB)</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* URL INPUT */}
                    {imageInputTab === 'url' && (
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                          변경할 새 이미지 웹 URL 입력
                        </label>
                        <input
                          type="url"
                          value={proposedImageValue}
                          onChange={(e) => {
                            setProposedImageValue(e.target.value);
                            setUploadedFileInfo(null);
                          }}
                          placeholder="https://images.unsplash.com/... 또는 이미지 링크"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {/* PRESET PICKER */}
                    {imageInputTab === 'presets' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-52 overflow-y-auto p-1">
                        {IMAGE_PRESETS.map((preset, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              setProposedImageValue(preset.url);
                              setUploadedFileInfo(null);
                            }}
                            className={`group relative rounded-xl overflow-hidden border text-left p-1.5 cursor-pointer transition-all ${
                              proposedImageValue === preset.url
                                ? 'border-blue-600 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                            }`}
                          >
                            <img 
                              src={preset.url} 
                              alt={preset.name}
                              className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform" 
                            />
                            <p className="text-[11px] font-semibold text-gray-800 dark:text-gray-200 mt-1 line-clamp-1">
                              {preset.name}
                            </p>
                            {proposedImageValue === preset.url && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                <Check size={12} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Live Preview */}
                  {proposedImageValue && (
                    <div>
                      <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>실제 반영 미리보기</span>
                        <span className="text-[10px] text-gray-400 font-normal">적용 시 이 사진으로 교체됩니다</span>
                      </label>
                      <div className="relative w-full h-48 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-gray-900">
                        <img 
                          src={proposedImageValue} 
                          alt="Proposed Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute top-2 right-2 px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold shadow">
                          적용 준비 완료
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* TEXT EDITING SECTION */
                <div className="space-y-4">
                  {currentTextValue && (
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                        현재 사이트 원본 문구
                      </label>
                      <div className="p-3.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
                        {currentTextValue}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                      수정할 새 문구 입력 <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={proposedTextValue}
                      onChange={(e) => setProposedTextValue(e.target.value)}
                      placeholder="변경하고자 하는 문구를 입력하세요..."
                      className="w-full p-4 rounded-2xl border-2 border-amber-500/40 dark:border-amber-600/40 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white leading-relaxed focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Author & Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    작업자 / 작성자
                  </label>
                  <input
                    type="text"
                    value={authorNameValue}
                    onChange={(e) => setAuthorNameValue(e.target.value)}
                    placeholder="담당자 이름"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    변경 사유 / 메모 (선택)
                  </label>
                  <input
                    type="text"
                    value={reasonValue}
                    onChange={(e) => setReasonValue(e.target.value)}
                    placeholder="예: 2026 홍보 사진 업데이트"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitModalOpen(false);
                    setTargetSection(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  취소
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Send size={13} />
                    <span>제안함에 등록</span>
                  </button>

                  {effectivePermissions.canDirectApply && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleDirectApply}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
                    >
                      <Zap size={14} className="fill-amber-300 text-amber-300" />
                      <span>{isSubmitting ? '사이트 반영 중...' : '즉시 라이브 반영 (1클릭)'}</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal backwards compatibility trigger */}
      {isAdminReviewOpen && (
        <div className="hidden">
          {/* redirects to portalTab = proposals */}
          {(() => {
            setTimeout(() => {
              setIsAdminReviewOpen(false);
              setPortalTab('proposals');
              setIsAdminPortalOpen(true);
            }, 10);
            return null;
          })()}
        </div>
      )}
    </>
  );
};
