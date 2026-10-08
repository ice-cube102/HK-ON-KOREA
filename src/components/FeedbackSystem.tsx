import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit3, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Send, 
  ShieldCheck, 
  LogOut, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  Trash2, 
  Lock, 
  Layers, 
  ArrowRight, 
  Image as ImageIcon, 
  Zap, 
  Upload, 
  Check, 
  X,
  UserPlus,
  Users,
  Sliders,
  UploadCloud,
  RefreshCw,
  Crown,
  Key,
  ShieldAlert,
  LogIn
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
  subscribeAdminUsers,
  addOrUpdateAdminUser,
  removeAdminUser
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
  isDarkMode,
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
  
  // Modals
  const [isAdminReviewOpen, setIsAdminReviewOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<'control' | 'backgrounds' | 'admins' | 'proposals'>('control');

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

  // Submit feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<string | null>(null);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  // Admin proposals state
  const [proposals, setProposals] = useState<FeedbackProposal[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'applied' | 'rejected'>('all');
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);
  const [adminStatusNotice, setAdminStatusNotice] = useState<string | null>(null);

  // Admin management form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'developer' | 'admin'>('admin');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [adminManageNotice, setAdminManageNotice] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dedicated background upload target
  const [bgUploadKey, setBgUploadKey] = useState<string | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setAuthorNameValue(user.displayName || user.email || '직원/관리자');
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

  // 3. Subscribe to proposals when user is authenticated
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

  // Derived user roles
  const userEmail = currentUser?.email?.toLowerCase().trim() || '';
  const isDeveloper = userEmail === DEVELOPER_EMAIL.toLowerCase();
  const isRegisteredAdmin = adminUsers.some(
    (a) => a.email.toLowerCase().trim() === userEmail
  );
  // User has administrative privileges only if developer OR in registered admin list
  const hasAdminPrivileges = isDeveloper || isRegisteredAdmin;

  // Enforce user requirement:
  // "만약 관리자 등록 계정이 아니라면 수정 탭은 안 나오도록."
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
      setSubmitSuccessMessage(null);
      setSubmitErrorMessage(null);
      
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
      setSubmitErrorMessage(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.';
      setSubmitErrorMessage(msg);
    }
  };

  // Immediate 1-click apply by admin/developer
  const handleDirectApply = async () => {
    const isImage = targetType === 'image';
    const valueToApply = isImage ? proposedImageValue.trim() : proposedTextValue.trim();

    if (!valueToApply) {
      setSubmitErrorMessage(isImage ? '새 이미지를 업로드하거나 선택해주세요.' : '수정할 문구를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMessage(null);

    try {
      const applyBy = isDeveloper 
        ? `${DEVELOPER_EMAIL} [개발자]` 
        : `${userEmail} [일반 관리자]`;

      await directApplyOverride(
        selectedSectionKey,
        selectedSectionTitle,
        valueToApply,
        applyBy,
        targetType
      );

      if (onDirectApplyOptimistic) {
        onDirectApplyOptimistic(selectedSectionKey, valueToApply);
      }

      setSubmitSuccessMessage('🎉 변경사항이 사이트에 실시간으로 즉시 반영되었습니다!');
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccessMessage(null);
        setTargetSection(null);
      }, 1200);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      setSubmitErrorMessage('적용 중 오류 발생: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct background upload from Background Manager tab
  const handleBackgroundUpload = async (file: File, key: string, name: string) => {
    try {
      setActionInProgressId(key);
      const res = await processImageFile(file);
      const applyBy = isDeveloper ? `${DEVELOPER_EMAIL} [개발자]` : `${userEmail} [관리자]`;
      await directApplyOverride(key, name, res.dataUrl, applyBy, 'image');
      if (onDirectApplyOptimistic) {
        onDirectApplyOptimistic(key, res.dataUrl);
      }
      setAdminStatusNotice(`'${name}' 배경 사진이 성공적으로 업로드 및 반영되었습니다! (${res.sizeKb}KB)`);
      setTimeout(() => setAdminStatusNotice(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert('배경 사진 업로드 실패: ' + msg);
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
      setSubmitErrorMessage(isImage ? '새 이미지를 업로드하거나 선택해주세요.' : '수정 제안할 문구를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitErrorMessage(null);

    try {
      await submitFeedbackProposal({
        authorName: authorNameValue.trim() || '직원/관리자',
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

      setSubmitSuccessMessage('제안이 정상적으로 등록되었습니다!');
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccessMessage(null);
        setReasonValue('');
        setTargetSection(null);
      }, 1400);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      setSubmitErrorMessage('등록 중 오류 발생: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add new admin user
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) {
      setAdminManageNotice('이메일을 입력해주세요.');
      return;
    }

    setIsAddingAdmin(true);
    setAdminManageNotice(null);
    try {
      await addOrUpdateAdminUser(
        newAdminEmail.trim(),
        newAdminName.trim() || newAdminEmail.split('@')[0],
        newAdminRole,
        currentUser?.email || 'admin'
      );
      setAdminManageNotice(`✅ ${newAdminEmail} 계정이 ${newAdminRole === 'developer' ? '개발자' : '일반 관리자'}로 등록되었습니다.`);
      setNewAdminEmail('');
      setNewAdminName('');
      setTimeout(() => setAdminManageNotice(null), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAdminManageNotice('등록 실패: ' + msg);
    } finally {
      setIsAddingAdmin(false);
    }
  };

  // Remove admin user
  const handleRemoveAdmin = async (email: string) => {
    if (!window.confirm(`정말 ${email} 관리자 계정을 권한 목록에서 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await removeAdminUser(email);
      setAdminManageNotice(`🗑️ ${email} 계정이 관리자 목록에서 삭제되었습니다.`);
      setTimeout(() => setAdminManageNotice(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setAdminManageNotice('삭제 실패: ' + msg);
    }
  };

  // Proposal actions
  const handleApply = async (prop: FeedbackProposal) => {
    setActionInProgressId(prop.id);
    try {
      await applyProposal(prop, currentUser?.email || DEVELOPER_EMAIL);
      const applyVal = prop.proposedImage || prop.proposedText;
      if (onDirectApplyOptimistic) {
        onDirectApplyOptimistic(prop.sectionKey, applyVal);
      }
      setAdminStatusNotice(`'${prop.sectionTitle || prop.sectionKey}'이(가) 실시간 반영되었습니다.`);
      setTimeout(() => setAdminStatusNotice(null), 3500);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert('적용 실패: ' + msg);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleRevert = async (sectionKey: string) => {
    if (!window.confirm(`'${sectionKey}' 수정을 해제하고 원래 기본 코드로 되돌리시겠습니까?`)) {
      return;
    }
    setActionInProgressId(sectionKey);
    try {
      await revertSiteOverride(sectionKey);
      if (onDirectApplyOptimistic) {
        onDirectApplyOptimistic(sectionKey, '');
      }
      setAdminStatusNotice(`'${sectionKey}'이(가) 원래 기본값으로 원복되었습니다.`);
      setTimeout(() => setAdminStatusNotice(null), 3500);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert('원복 실패: ' + msg);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleReject = async (proposalId: string) => {
    setActionInProgressId(proposalId);
    try {
      await rejectProposal(proposalId);
      setAdminStatusNotice('해당 제안이 반려되었습니다.');
      setTimeout(() => setAdminStatusNotice(null), 3000);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert('반려 처리 실패: ' + msg);
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleDelete = async (proposalId: string) => {
    if (!window.confirm('이 제안 내역을 완전히 삭제하시겠습니까?')) return;
    setActionInProgressId(proposalId);
    try {
      await deleteProposal(proposalId);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      alert('삭제 실패: ' + msg);
    } finally {
      setActionInProgressId(null);
    }
  };

  const filteredProposals = proposals.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const pendingCount = proposals.filter((p) => p.status === 'pending').length;

  return (
    <>
      {/* ========================================================
          0. Admin Portal Modal (Triggered by shield icon in menu)
          ======================================================== */}
      {isAdminPortalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
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
                    <span>HKON 관리자 & 개발자 포털</span>
                    {isDeveloper && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                        <Crown size={10} /> 개발자 마스터
                      </span>
                    )}
                    {isRegisteredAdmin && !isDeveloper && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        일반 관리자
                      </span>
                    )}
                    {!hasAdminPrivileges && currentUser && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        권한 없음
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser ? (
                      <span>로그인 계정: <strong>{currentUser.email}</strong></span>
                    ) : (
                      <span>보안 로그인이 필요합니다</span>
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

            {/* CASE 1: NOT LOGGED IN */}
            {!currentUser && (
              <div className="p-8 space-y-6">
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                  <p className="font-semibold text-sm flex items-center gap-1.5">
                    <ShieldAlert size={16} className="text-amber-500" />
                    관리자 및 직원 전용 보안 구역
                  </p>
                  <p className="text-amber-800/90 dark:text-amber-300/80 leading-relaxed">
                    등록된 관리자 또는 개발자 계정으로 로그인해야 사이트 <strong>수정 탭</strong> 및 <strong>배경 사진 업로드 기능</strong>이 활성화됩니다.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm shadow-xl hover:opacity-90 cursor-pointer transition-all"
                  >
                    <LogIn size={18} />
                    <span>Google 계정으로 로그인</span>
                  </button>
                  <p className="text-center text-[11px] text-gray-400">
                    개발자 마스터: <strong>{DEVELOPER_EMAIL}</strong> 또는 등록된 관리자 이메일
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
                    현재 로그인된 계정 (<strong>{currentUser.email}</strong>)은 HKON 관리자 권한 목록에 등록되어 있지 않습니다.
                  </p>
                  <p className="text-rose-700/80 dark:text-rose-300/80">
                    보안 정책에 따라 <strong>수정 탭 및 관리 권한이 노출되지 않습니다.</strong> 사이트 수정을 원하시면 최고 개발자(<strong>{DEVELOPER_EMAIL}</strong>)에게 관리자 등록을 요청해주세요.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs shadow-md cursor-pointer hover:opacity-90 transition-all"
                  >
                    <RefreshCw size={14} />
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

            {/* CASE 3: LOGGED IN WITH ADMIN PRIVILEGES (DEVELOPER OR REGISTERED ADMIN) */}
            {currentUser && hasAdminPrivileges && (
              <>
                {/* Navigation Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 px-4 text-xs font-semibold overflow-x-auto">
                  <button
                    onClick={() => setPortalTab('control')}
                    className={`px-4 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'control'
                        ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Sliders size={14} />
                    <span>대시보드 & 모드 제어</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('backgrounds')}
                    className={`px-4 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'backgrounds'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <UploadCloud size={14} />
                    <span>배경 사진 업로드 & 관리</span>
                  </button>

                  <button
                    onClick={() => setPortalTab('admins')}
                    className={`px-4 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'admins'
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <Users size={14} />
                    <span>관리자 권한 설정 ({adminUsers.length + 1})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAdminPortalOpen(false);
                      setIsAdminReviewOpen(true);
                    }}
                    className="px-4 py-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <FileText size={14} />
                    <span>검토함 & 실시간 원복 허브</span>
                    {pendingCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px]">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                  
                  {/* TAB 1: CONTROL & MODE */}
                  {portalTab === 'control' && (
                    <div className="space-y-4">
                      {/* Active Status Banner */}
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>
                            <strong>{isDeveloper ? '[개발자]' : '[일반 관리자]'}</strong> 권한이 인증되었습니다.
                          </span>
                        </div>
                        <span className="font-mono text-[10px] bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-300 font-bold">
                          VERIFIED
                        </span>
                      </div>

                      {/* Mode Toggles */}
                      <div className="space-y-2.5">
                        {/* 1. Toggle Admin Active Mode */}
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
                              <div className="font-bold text-sm">관리자 수정 도구바 (하단 도크)</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {isAdminActive ? '화면 좌측 하단에 관리자 제어 탭이 표시 중입니다' : '하단 수정 탭이 숨겨져 있습니다'}
                              </div>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${isAdminActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                            {isAdminActive ? 'ON' : 'OFF'}
                          </span>
                        </button>

                        {/* 2. Toggle Live Edit Badges */}
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
                              <div className="font-bold text-sm">화면 직접 수정 버튼 (문구✏️ & 배경🖼️)</div>
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

                      {/* Quick jump to review or backgrounds */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setPortalTab('backgrounds')}
                          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <UploadCloud size={16} />
                          <span>배경 사진 업로드하기</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPortalTab('admins')}
                          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold hover:bg-purple-100 transition-colors cursor-pointer"
                        >
                          <UserPlus size={16} />
                          <span>관리자 이메일 추가</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: BACKGROUND IMAGE UPLOAD & MANAGEMENT */}
                  {portalTab === 'backgrounds' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                          <UploadCloud size={16} className="text-blue-500" />
                          Hero 슬라이드 배경 사진 실시간 업로드 (드롭 & 업로드)
                        </p>
                        <p className="text-blue-800/80 dark:text-blue-300/80">
                          컴퓨터에서 사진을 드래그하거나 [업로드]를 눌러 즉시 사이트 배경으로 교체할 수 있습니다.
                        </p>
                      </div>

                      {adminStatusNotice && (
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle size={15} />
                          <span>{adminStatusNotice}</span>
                        </div>
                      )}

                      {/* Hidden file input for direct bg upload */}
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
                                {/* Thumbnail preview */}
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

                                {/* Slide info */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                    {slide.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {slide.desc}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">
                                    키: {slide.id}
                                  </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 shrink-0">
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

                                  {isCustomized && (
                                    <button
                                      type="button"
                                      disabled={isUpdating}
                                      onClick={() => handleRevert(slide.id)}
                                      className="p-2 rounded-xl text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors cursor-pointer"
                                      title="원래 기본 사진으로 원복"
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

                  {/* TAB 3: ADMIN ACCOUNTS & PERMISSION SETTINGS */}
                  {portalTab === 'admins' && (
                    <div className="space-y-5">
                      {/* Notice */}
                      {adminManageNotice && (
                        <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-xs font-semibold text-purple-900 dark:text-purple-200 flex items-center gap-2">
                          <CheckCircle size={16} />
                          <span>{adminManageNotice}</span>
                        </div>
                      )}

                      {/* Developer Super Admin Card */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                            <Crown size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-900 dark:text-white">
                                {DEVELOPER_EMAIL}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                                개발자 마스터
                              </span>
                            </div>
                            <p className="text-xs text-purple-800/80 dark:text-purple-300/80">
                              영구 최고 관리자 (관리자 추가/삭제, 사이트 수정, 모든 권한 보유)
                            </p>
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                          PERMANENT
                        </div>
                      </div>

                      {/* Add Admin Form */}
                      <form onSubmit={handleAddAdmin} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <UserPlus size={15} className="text-purple-600" />
                          <span>새 관리자 이메일 추가 및 권한 부여</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-gray-500 mb-1">
                              관리자 Google/로그인 이메일 <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={newAdminEmail}
                              onChange={(e) => setNewAdminEmail(e.target.value)}
                              placeholder="admin@hkon.co.kr"
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
                              placeholder="김물류 팀장"
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-gray-500">부여 역할:</span>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input 
                                type="radio" 
                                name="role" 
                                checked={newAdminRole === 'admin'} 
                                onChange={() => setNewAdminRole('admin')} 
                              />
                              <span>일반 관리자</span>
                            </label>
                            {isDeveloper && (
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input 
                                  type="radio" 
                                  name="role" 
                                  checked={newAdminRole === 'developer'} 
                                  onChange={() => setNewAdminRole('developer')} 
                                />
                                <span>개발자/운영자</span>
                              </label>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={isAddingAdmin}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                          >
                            <UserPlus size={13} />
                            <span>{isAddingAdmin ? '등록 중...' : '관리자 등록하기'}</span>
                          </button>
                        </div>
                      </form>

                      {/* Registered Admin List */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 flex items-center justify-between">
                          <span>등록된 관리자 목록 ({adminUsers.length}명)</span>
                          <span className="text-[10px] text-gray-400">실시간 동기화됨</span>
                        </h4>

                        {adminUsers.length === 0 ? (
                          <div className="p-6 text-center text-xs text-gray-400 border border-dashed rounded-2xl">
                            아직 추가로 등록된 일반 관리자가 없습니다. 위 입력창에서 이메일을 등록해주세요.
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {adminUsers.map((admin) => (
                              <div
                                key={admin.email}
                                className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                                    {(admin.name || admin.email)[0].toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-gray-900 dark:text-white">
                                        {admin.name || admin.email}
                                      </span>
                                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                        {admin.role === 'developer' ? '개발자' : '일반 관리자'}
                                      </span>
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-mono">
                                      {admin.email}
                                    </span>
                                  </div>
                                </div>

                                {isDeveloper && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAdmin(admin.email)}
                                    className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                                    title="관리자 권한 삭제"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
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
          1. Global Floating Control Bar (ONLY if admin privileges)
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
              <span className="truncate max-w-[140px]">{currentUser?.email || DEVELOPER_EMAIL}</span>
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
            <button
              onClick={() => {
                setPortalTab('backgrounds');
                setIsAdminPortalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200 dark:border-blue-800"
              title="배경 사진 업로드 및 변경 관리"
            >
              <UploadCloud size={13} className="text-blue-500" />
              <span>배경 업로드</span>
            </button>

            {/* Admin Management Hub button */}
            <button
              onClick={() => setIsAdminReviewOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              title="관리자 검토함 및 실시간 반영 관리"
            >
              <ShieldCheck size={13} className="text-amber-400" />
              <span>검토/원복함</span>
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

          {/* Feedback mode banner indicator when active */}
          {isFeedbackModeActive && (
            <div className="bg-amber-500/95 text-white text-xs px-3.5 py-2 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-2 animate-fadeIn border border-amber-400">
              <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
              <span>
                화면의 <strong>[✏️ 문구 수정]</strong> 또는 <strong>[🖼️ 배경 사진 변경]</strong> 버튼을 누르면 업로드 및 편집창이 열립니다!
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
          2. Unified Proposal & Direct Apply Modal (With Drag & Drop)
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
                    <span>{targetType === 'image' ? '배경 & 이미지 업로드 / 변경' : '화면 문구(텍스트) 수정'}</span>
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
                  {/* Current image info */}
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

                    {/* Hidden Native File Input */}
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

                    {/* TAB: DRAG & DROP FILE UPLOAD */}
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

                    {/* TAB: URL INPUT */}
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

                    {/* TAB: PRESET PICKER */}
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

                  {/* Image Live Preview */}
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

              {/* Author & Reason (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    작업자 / 작성자
                  </label>
                  <input
                    type="text"
                    value={authorNameValue}
                    onChange={(e) => setAuthorNameValue(e.target.value)}
                    placeholder="관리자 이름"
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
                    placeholder="예: 2026 봄 홍보 사진 교체"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs"
                  />
                </div>
              </div>

              {/* Status messages */}
              {submitSuccessMessage && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>{submitSuccessMessage}</span>
                </div>
              )}
              {submitErrorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{submitErrorMessage}</span>
                </div>
              )}

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
                  {/* Submit Proposal */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Send size={13} />
                    <span>제안함에 등록</span>
                  </button>

                  {/* 1-Click Direct Live Apply */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleDirectApply}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
                  >
                    <Zap size={14} className="fill-amber-300 text-amber-300" />
                    <span>{isSubmitting ? '사이트 반영 중...' : '즉시 라이브 반영 (1클릭)'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          3. Admin Review & Live Overrides Hub Modal
          ======================================================== */}
      {isAdminReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span>검토함 & 실시간 사이트 반영 관리</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                      {isDeveloper ? '개발자 마스터' : '관리자'}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    직원들의 문구/이미지 제안을 검토하거나 실시간 반영된 내용을 원복할 수 있습니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAdminReviewOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            {/* Notification */}
            {adminStatusNotice && (
              <div className="bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-200 dark:border-emerald-800 px-6 py-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle size={16} />
                <span>{adminStatusNotice}</span>
              </div>
            )}

            {/* Filter bar & stats */}
            <div className="px-6 py-3 bg-gray-50/30 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs">
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

              {/* Active overrides count */}
              <div className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Layers size={14} className="text-emerald-500" />
                <span>현재 실시간 적용 중인 수정 건: <strong>{Object.keys(activeOverrides).length}개</strong></span>
              </div>
            </div>

            {/* Proposals List */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {filteredProposals.length === 0 ? (
                <div className="py-16 text-center text-gray-400 dark:text-gray-500 space-y-3">
                  <FileText size={36} className="mx-auto opacity-40" />
                  <p className="text-sm font-semibold">제안 및 수정 내역이 없습니다.</p>
                  <p className="text-xs">
                    화면의 [문구 수정] 또는 [배경 사진 변경]을 클릭하여 손쉽게 등록해 보세요.
                  </p>
                </div>
              ) : (
                filteredProposals.map((prop) => {
                  const isImage = prop.targetType === 'image' || prop.sectionKey.startsWith('image_');
                  const currentLiveVal = activeOverrides[prop.sectionKey];
                  const isCurrentlyActive = currentLiveVal === (prop.proposedImage || prop.proposedText);

                  return (
                    <div
                      key={prop.id}
                      className={`border rounded-2xl p-5 transition-all ${
                        prop.status === 'pending'
                          ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
                          : prop.status === 'applied'
                          ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20 dark:bg-emerald-950/10'
                          : 'border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20 opacity-80'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-gray-800 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                              prop.status === 'pending'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                : prop.status === 'applied'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {prop.status === 'pending' && '⏳ 검토 대기'}
                            {prop.status === 'applied' && '✅ 사이트 적용 완료'}
                            {prop.status === 'rejected' && '❌ 반려됨'}
                          </span>

                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isImage ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}>
                            {isImage ? '🖼️ 배경/이미지' : '✏️ 문구'}
                          </span>

                          <span className="font-bold text-gray-900 dark:text-white text-sm">
                            {prop.sectionTitle || prop.sectionKey}
                          </span>
                          <span className="text-gray-400 font-mono text-[11px]">({prop.sectionKey})</span>
                        </div>

                        <div className="text-gray-500 dark:text-gray-400 flex items-center gap-2 text-xs">
                          <span>제안/적용자: <strong>{prop.authorName}</strong></span>
                          <span>•</span>
                          <span>{new Date(prop.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Content Comparison */}
                      {isImage ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                          <div className="bg-gray-100 dark:bg-gray-800/70 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
                            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                              기존 사진
                            </span>
                            {prop.originalImage ? (
                              <img 
                                src={prop.originalImage} 
                                alt="Original" 
                                className="w-full h-32 object-cover rounded-lg border shadow-sm"
                              />
                            ) : (
                              <div className="h-32 flex items-center justify-center text-gray-400 text-xs">기본 코드 이미지</div>
                            )}
                          </div>

                          <div className="bg-blue-50/70 dark:bg-blue-950/40 p-3.5 rounded-xl border border-blue-200 dark:border-blue-800 space-y-2">
                            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider block flex items-center gap-1">
                              <Sparkles size={12} />
                              <span>새로 제안/업로드된 사진</span>
                            </span>
                            <img 
                              src={prop.proposedImage || prop.proposedText} 
                              alt="Proposed" 
                              className="w-full h-32 object-cover rounded-lg border-2 border-blue-400 shadow-md"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 text-xs">
                          <div className="bg-gray-100 dark:bg-gray-800/70 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              기존 원본 문구
                            </div>
                            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto">
                              {prop.originalText || '(기본 문구)'}
                            </div>
                          </div>

                          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                              <Sparkles size={12} />
                              <span>수정 제안 문구</span>
                            </div>
                            <div className="text-emerald-950 dark:text-emerald-200 whitespace-pre-line leading-relaxed font-medium max-h-36 overflow-y-auto">
                              {prop.proposedText}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Reason */}
                      {prop.reason && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 bg-white/60 dark:bg-gray-900/60 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                          <strong>사유:</strong> {prop.reason}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div>
                          {isCurrentlyActive && (
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                              현재 실제 웹사이트에 라이브 반영되어 있습니다.
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApply(prop)}
                            disabled={actionInProgressId === prop.id}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer transition-all"
                          >
                            <CheckCircle size={14} />
                            <span>{prop.status === 'applied' ? '재적용하기' : '사이트에 적용하기'}</span>
                          </button>

                          {activeOverrides[prop.sectionKey] && (
                            <button
                              onClick={() => handleRevert(prop.sectionKey)}
                              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 transition-colors cursor-pointer"
                            >
                              <RotateCcw size={13} />
                              <span>원복(기본값)</span>
                            </button>
                          )}

                          {prop.status === 'pending' && (
                            <button
                              onClick={() => handleReject(prop.id)}
                              disabled={actionInProgressId === prop.id}
                              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <XCircle size={14} />
                              <span>반려</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleDelete(prop.id)}
                            disabled={actionInProgressId === prop.id}
                            className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                            title="내역 삭제"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Lock size={13} className="text-amber-500" />
                <span>계정: <strong>{currentUser?.email || DEVELOPER_EMAIL}</strong></span>
              </div>
              <button
                onClick={() => setIsAdminReviewOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:opacity-90 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
