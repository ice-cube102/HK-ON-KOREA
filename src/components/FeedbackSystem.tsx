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
  Zap, 
  RefreshCw, 
  X, 
  Shield, 
  Eye, 
  Clock, 
  User, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  History, 
  Activity, 
  Sliders, 
  UploadCloud, 
  Users, 
  Key, 
  Filter, 
  Search, 
  Copy, 
  Image as ImageIcon, 
  Maximize2, 
  Plus,
  LogIn
} from 'lucide-react';
import { 
  auth, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser, 
  googleProvider 
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
  subscribeActivityLogs,
  deleteActivityLog
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

// Global Site Assets Registry for the "사진함" Media Library
export interface SiteAsset {
  id: string;
  name: string;
  category: 'hero' | 'product' | 'brand' | 'custom';
  defaultUrl: string;
  sectionKey?: string;
  desc?: string;
}

export const GLOBAL_SITE_ASSETS: SiteAsset[] = [
  // Hero Slides
  { id: 'asset_hero_company', name: '메인 슬라이드 1 (HKON 물류 허브)', category: 'hero', defaultUrl: '/images/company.png', sectionKey: 'image_heroSlide_company', desc: '메인 첫 화면 대형 배경' },
  { id: 'asset_hero_about', name: '메인 슬라이드 2 (About Us 비전)', category: 'hero', defaultUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=60&w=800', sectionKey: 'image_heroSlide_about-us', desc: '회사 소개 슬라이드 배경' },
  { id: 'asset_hero_whats_new', name: "메인 슬라이드 3 (What's New)", category: 'hero', defaultUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=60&w=800', sectionKey: 'image_heroSlide_whats-new', desc: '신제품 소식 슬라이드 배경' },
  { id: 'asset_hero_haagendazs', name: '메인 슬라이드 4 (하겐다즈 미니컵)', category: 'hero', defaultUrl: '/images/mini_cup.png', sectionKey: 'image_heroSlide_haagen-dazs', desc: '하겐다즈 브랜드 슬라이드' },
  { id: 'asset_hero_lantico', name: '메인 슬라이드 5 (란티코 커피)', category: 'hero', defaultUrl: '/images/lantico.png', sectionKey: 'image_heroSlide_lantico', desc: '란티코 커피 슬라이드 배경' },
  { id: 'asset_hero_caraci', name: '메인 슬라이드 6 (카라치 카다이프)', category: 'hero', defaultUrl: '/images/kadaif_thumbnail.png', sectionKey: 'image_heroSlide_caraci', desc: '카라치 초콜릿 슬라이드 배경' },
  { id: 'asset_hero_mills', name: '메인 슬라이드 7 (제너럴밀스 그래놀라)', category: 'hero', defaultUrl: '/images/grnaola_thumbnail.png', sectionKey: 'image_heroSlide_general-mills', desc: '네이처밸리 그래놀라 슬라이드' },

  // Products
  { id: 'asset_prod_granola_1', name: '네이처밸리 그래놀라 1 (오리지널)', category: 'product', defaultUrl: '/images/granola_600_1.png', desc: '네이처밸리 통귀리 그래놀라' },
  { id: 'asset_prod_granola_2', name: '네이처밸리 그래놀라 2 (허니 오트)', category: 'product', defaultUrl: '/images/granola_600_2.png', desc: '네이처밸리 오트밀 제품' },
  { id: 'asset_prod_granola_3', name: '네이처밸리 그래놀라 3 (초콜릿)', category: 'product', defaultUrl: '/images/granola_600_3.png', desc: '네이처밸리 초코 그래놀라' },
  { id: 'asset_prod_granola_4', name: '네이처밸리 그래놀라 4 (크랜베리)', category: 'product', defaultUrl: '/images/granola_600_4.png', desc: '네이처밸리 베리 그래놀라' },
  { id: 'asset_prod_granola_6', name: '네이처밸리 그래놀라 6 (믹스 너트)', category: 'product', defaultUrl: '/images/granola_600_6.png', desc: '네이처밸리 프리미엄 믹스' },
  { id: 'asset_prod_kadaif', name: '카라치 카다이프 피스타치오 초콜릿', category: 'product', defaultUrl: '/images/kadaif.png', desc: '두바이 스타일 카다이프' },
  { id: 'asset_prod_dark_choco', name: '하겐다즈 다크초콜릿', category: 'product', defaultUrl: '/images/dark_choco_thumbnail.png', desc: '하겐다즈 프리미엄 아이스크림' },
  { id: 'asset_prod_stick_bar', name: '하겐다즈 스틱바', category: 'product', defaultUrl: '/images/stick_bar.png', desc: '하겐다즈 프리미엄 바' },
  { id: 'asset_prod_mini_cup', name: '하겐다즈 미니컵 컬렉션', category: 'product', defaultUrl: '/images/mini_cup.png', desc: '하겐다즈 미니컵' },
  { id: 'asset_prod_green_giant_orig', name: '그린자이언트 스위트콘 오리지널', category: 'product', defaultUrl: '/images/green_giant_original.png', desc: '그린자이언트 옥수수' },
  { id: 'asset_prod_green_giant_huge', name: '그린자이언트 대용량', category: 'product', defaultUrl: '/images/green_giant_huge.png', desc: '그린자이언트 대용량 캔' },
  { id: 'asset_prod_green_giant_bogo', name: '그린자이언트 기획팩 4+4', category: 'product', defaultUrl: '/images/green_giant_buy_4_get_4.png', desc: '그린자이언트 번들 패키지' },
  { id: 'asset_prod_fruit_foot', name: '푸룻바이더풋 젤리', category: 'product', defaultUrl: '/images/fruit_by_the_foot.png', desc: '제너럴밀스 과일 젤리' },
  { id: 'asset_prod_lantico_2', name: '란티코 에스프레소 원두 팩', category: 'product', defaultUrl: '/images/lantico_2.png', desc: '이탈리안 란티코 프리미엄 원두' },

  // Brand & Company Assets
  { id: 'asset_brand_company', name: 'HKON 본사 및 전경', category: 'brand', defaultUrl: '/images/company.png', desc: '회사 소개 메인 그래픽' },
  { id: 'asset_brand_product_all', name: 'HKON 취급 전 품목 컬렉션', category: 'brand', defaultUrl: '/images/product.png', desc: '종합 제품 포트폴리오' },
  { id: 'asset_brand_paint', name: 'HKON 브랜드 아트 그래픽', category: 'brand', defaultUrl: '/images/paint.png', desc: '브랜드 디자인 에셋' },
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
        const approxSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl,
          width,
          height,
          sizeKb: approxSizeKb,
          fileName: file.name
        });
      };
      img.onerror = () => {
        reject(new Error('이미지를 불러오는데 실패했습니다.'));
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };
    reader.readAsDataURL(file);
  });
}

export type TargetSectionType = {
  key: string;
  title: string;
  currentText?: string;
  currentImage?: string;
  isImage?: boolean;
} | null;

interface FeedbackSystemProps {
  activeOverrides: Record<string, string>;
  isFeedbackModeActive: boolean;
  setIsFeedbackModeActive: (active: boolean) => void;
  isAdminActive: boolean;
  setIsAdminActive: (active: boolean) => void;
  isAdminReviewOpen: boolean;
  setIsAdminReviewOpen: (open: boolean) => void;
  targetSection: {
    key: string;
    title: string;
    currentText?: string;
    currentImage?: string;
    isImage?: boolean;
  } | null;
  setTargetSection: (section: {
    key: string;
    title: string;
    currentText?: string;
    currentImage?: string;
    isImage?: boolean;
  } | null) => void;
  onDirectApplyOptimistic?: (sectionKey: string, newValue: string) => void;
  isAdminPortalOpen: boolean;
  setIsAdminPortalOpen: (open: boolean) => void;
}

export const FeedbackSystem: React.FC<FeedbackSystemProps> = ({
  activeOverrides,
  isFeedbackModeActive,
  setIsFeedbackModeActive,
  isAdminActive,
  setIsAdminActive,
  isAdminReviewOpen,
  setIsAdminReviewOpen,
  targetSection,
  setTargetSection,
  onDirectApplyOptimistic,
  isAdminPortalOpen,
  setIsAdminPortalOpen
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [siteVersions, setSiteVersions] = useState<SiteVersion[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [proposals, setProposals] = useState<FeedbackProposal[]>([]);
  const [toastMessage, setToastMessage] = useState<{ text: string; type?: 'info' | 'error' | 'success' } | null>(null);

  // Proposal modal state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedSectionKey, setSelectedSectionKey] = useState('');
  const [selectedSectionTitle, setSelectedSectionTitle] = useState('');
  const [targetType, setTargetType] = useState<'text' | 'image'>('text');
  const [currentTextValue, setCurrentTextValue] = useState('');
  const [proposedTextValue, setProposedTextValue] = useState('');
  const [currentImageValue, setCurrentImageValue] = useState('');
  const [proposedImageValue, setProposedImageValue] = useState('');
  const [authorNameValue, setAuthorNameValue] = useState('');
  const [reasonValue, setReasonValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Instant apply toggle in modal (ON by default for 0-click convenience)
  const [instantApplyOnDrop, setInstantApplyOnDrop] = useState(true);

  // Image editing tab inside modal
  const [imageInputTab, setImageInputTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{ name: string; sizeKb: number; width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Portal tabs: 'control' | 'gallery' | 'backgrounds' | 'proposals' | 'versions' | 'logs' | 'admins'
  const [portalTab, setPortalTab] = useState<'control' | 'gallery' | 'backgrounds' | 'proposals' | 'versions' | 'logs' | 'admins'>('control');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'applied' | 'rejected'>('pending');

  // Sub-filters for Versions tab
  const [versionSubFilter, setVersionSubFilter] = useState<'all' | 'images' | 'texts' | 'reverts'>('all');

  // Sub-filters & search for Logs tab
  const [logSubFilter, setLogSubFilter] = useState<'all' | 'apply' | 'reject' | 'revert' | 'delete' | 'admin'>('all');
  const [logSearchQuery, setLogSearchQuery] = useState('');

  // Gallery (사진함) category filter & preview modal
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'hero' | 'product' | 'brand' | 'custom'>('all');
  const [customGalleryImages, setCustomGalleryImages] = useState<{ id: string; name: string; url: string; addedAt: string }[]>([]);
  const [galleryZoomImage, setGalleryZoomImage] = useState<{ name: string; url: string } | null>(null);
  const [galleryTargetSection, setGalleryTargetSection] = useState('image_heroSlide_company');
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Admin user management state
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'developer'>('admin');
  const [newAdminPermissions, setNewAdminPermissions] = useState<AdminPermissions>({ ...DEFAULT_ADMIN_PERMISSIONS });
  const [editingAdminEmail, setEditingAdminEmail] = useState<string | null>(null);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // Action in progress lock
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  // In-App Confirm Dialog (Always topmost z-[999999])
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmColor?: 'rose' | 'amber' | 'emerald' | 'blue';
    onConfirm: () => void;
  } | null>(null);

  // In-App Reject Reason Prompt (Always topmost z-[999999])
  const [rejectDialog, setRejectDialog] = useState<{
    isOpen: boolean;
    proposalId: string;
    targetTitle: string;
  } | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Domain auth help modal
  const [domainAuthHelpOpen, setDomainAuthHelpOpen] = useState(false);

  // Background direct upload
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [bgUploadKey, setBgUploadKey] = useState<string | null>(null);

  // Load custom gallery photos from localStorage for user convenience
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hkon_custom_gallery');
      if (saved) {
        setCustomGalleryImages(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveCustomGalleryPhoto = (name: string, url: string) => {
    const newItem = {
      id: `custom_${Date.now()}`,
      name,
      url,
      addedAt: new Date().toISOString()
    };
    setCustomGalleryImages(prev => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('hkon_custom_gallery', JSON.stringify(updated.slice(0, 30)));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeCustomGalleryPhoto = (id: string) => {
    setCustomGalleryImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      try {
        localStorage.setItem('hkon_custom_gallery', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('사진함에서 사진이 삭제되었습니다.');
  };

  // Toast notification helper
  const showToast = (text: string, type: 'info' | 'error' | 'success' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user?.displayName && !authorNameValue) {
        setAuthorNameValue(user.displayName);
      }
    });
    return () => unsubscribe();
  }, [authorNameValue]);

  // Firestore real-time subscriptions
  useEffect(() => {
    const unsubAdmins = subscribeAdminUsers((users) => {
      setAdminUsers(users);
    });
    const unsubVersions = subscribeSiteVersions((versions) => {
      setSiteVersions(versions);
    });
    const unsubLogs = subscribeActivityLogs((logs) => {
      setActivityLogs(logs);
    });
    const unsubProposals = subscribeProposals((data) => {
      setProposals(data);
    });

    return () => {
      unsubAdmins();
      unsubVersions();
      unsubLogs();
      unsubProposals();
    };
  }, []);

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
      showToast('성공적으로 로그인되었습니다.', 'success');
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      const errCode = errorObj?.code || '';
      const errMsg = errorObj?.message || '';

      if (errCode === 'auth/unauthorized-domain' || errMsg.includes('unauthorized domain')) {
        setDomainAuthHelpOpen(true);
      } else {
        showToast('로그인 실패: ' + (errMsg || '알 수 없는 오류'), 'error');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showToast('로그아웃되었습니다.');
      setIsAdminActive(false);
      setIsFeedbackModeActive(false);
      setIsAdminPortalOpen(false);
    } catch (err) {
      console.warn(err);
    }
  };

  // Direct 1-click apply helper
  const executeApplyLive = async (val: string, key: string, title: string, isImg: boolean) => {
    setIsSubmitting(true);
    const operatorName = currentUser?.displayName || userEmail.split('@')[0] || '관리자';
    const prev = activeOverrides[key];

    if (onDirectApplyOptimistic) {
      onDirectApplyOptimistic(key, val);
    }

    try {
      await directApplyOverride(
        key,
        title,
        val,
        userEmail,
        isImg ? 'image' : 'text',
        operatorName,
        prev
      );
      showToast(`🎉 '${title}' 사진이 사이트에 즉시 반영되었습니다!`, 'success');
      setIsSubmitModalOpen(false);
      setTargetSection(null);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      showToast('반영 실패: ' + msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Process dropped or selected image with 0-click instant apply support
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

      // Save to photo gallery
      saveCustomGalleryPhoto(result.fileName, result.dataUrl);

      // If instant apply is toggled on (default for admins), apply immediately in ZERO extra clicks!
      if (instantApplyOnDrop && effectivePermissions.canDirectApply && selectedSectionKey) {
        await executeApplyLive(result.dataUrl, selectedSectionKey, selectedSectionTitle, true);
      } else {
        showToast(`사진 파일 준비 완료 (${result.sizeKb}KB)`, 'info');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.';
      showToast(msg, 'error');
    }
  };

  // Immediate 1-click apply button handler in modal
  const handleDirectApply = async () => {
    const isImage = targetType === 'image';
    const valueToApply = isImage ? proposedImageValue.trim() : proposedTextValue.trim();

    if (!valueToApply) {
      showToast(isImage ? '새 이미지를 업로드하거나 선택해주세요.' : '수정할 문구를 입력해주세요.', 'error');
      return;
    }

    await executeApplyLive(valueToApply, selectedSectionKey, selectedSectionTitle, isImage);
  };

  // Direct Background Upload Handler from Admin Backgrounds Tab
  const handleBackgroundUpload = async (file: File, key: string, name: string) => {
    try {
      setActionInProgressId(key);
      const res = await processImageFile(file);
      const operatorName = currentUser?.displayName || userEmail.split('@')[0] || '관리자';
      const prev = activeOverrides[key];

      // Save to photo gallery
      saveCustomGalleryPhoto(name, res.dataUrl);

      if (onDirectApplyOptimistic) {
        onDirectApplyOptimistic(key, res.dataUrl);
      }

      await directApplyOverride(key, name, res.dataUrl, userEmail, 'image', operatorName, prev);
      showToast(`'${name}' 배경 사진이 즉시 업로드 및 반영되었습니다! (${res.sizeKb}KB)`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('배경 사진 업로드 실패: ' + msg, 'error');
    } finally {
      setActionInProgressId(null);
      setBgUploadKey(null);
    }
  };

  // Submit feedback proposal to review queue
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    const isImage = targetType === 'image';
    const finalProposed = isImage ? proposedImageValue.trim() : proposedTextValue.trim();
    const finalOriginal = isImage ? currentImageValue : currentTextValue;

    if (!finalProposed) {
      showToast('수정할 내용 또는 이미지를 입력해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedbackProposal({
        authorName: authorNameValue.trim() || currentUser?.displayName || '익명 담당자',
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

  // Proposal revert action (Always topmost confirm dialog)
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

  // Delete proposal action (Topmost confirm dialog)
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

  // Delete version snapshot
  const handleDeleteVersion = (versionId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '버전 기록 삭제',
      message: '해당 버전 기록을 삭제하시겠습니까? (사이트 현재 상태에는 영향이 없습니다)',
      confirmText: '삭제하기',
      confirmColor: 'rose',
      onConfirm: async () => {
        try {
          await deleteSiteVersion(versionId);
          showToast('버전 기록이 삭제되었습니다.');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          showToast('삭제 실패: ' + msg, 'error');
        }
      }
    });
  };

  // Delete activity log
  const handleDeleteLog = (logId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: '감사 로그 삭제',
      message: '해당 활동 로그 항목을 삭제하시겠습니까?',
      confirmText: '삭제하기',
      confirmColor: 'rose',
      onConfirm: async () => {
        try {
          await deleteActivityLog(logId);
          showToast('로그가 삭제되었습니다.');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          showToast('삭제 실패: ' + msg, 'error');
        }
      }
    });
  };

  // Filtered proposals
  const filteredProposals = proposals.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  const pendingCount = proposals.filter((p) => p.status === 'pending').length;

  // Filtered versions
  const filteredVersions = siteVersions.filter((v) => {
    if (versionSubFilter === 'all') return true;
    if (versionSubFilter === 'images') return v.targetType === 'image' || v.sectionKey.startsWith('image_');
    if (versionSubFilter === 'texts') return v.targetType === 'text' && !v.sectionKey.startsWith('image_') && !v.newValue.includes('복원됨');
    if (versionSubFilter === 'reverts') return v.newValue.includes('복원') || v.changeNote?.includes('롤백') || v.changeNote?.includes('원복');
    return true;
  });

  // Filtered activity logs
  const filteredLogs = activityLogs.filter((log) => {
    if (logSubFilter !== 'all') {
      if (logSubFilter === 'apply' && log.actionType !== 'apply') return false;
      if (logSubFilter === 'reject' && log.actionType !== 'reject') return false;
      if (logSubFilter === 'revert' && log.actionType !== 'revert') return false;
      if (logSubFilter === 'delete' && log.actionType !== 'delete') return false;
      if (logSubFilter === 'admin' && !log.actionType.startsWith('admin_')) return false;
    }
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      const matchTarget = (log.targetTitle || log.target).toLowerCase().includes(q);
      const matchUser = (log.userName || log.userEmail).toLowerCase().includes(q);
      const matchDetails = (log.details || '').toLowerCase().includes(q);
      return matchTarget || matchUser || matchDetails;
    }
    return true;
  });

  // Gallery filtered assets
  const filteredGalleryAssets = GLOBAL_SITE_ASSETS.filter((asset) => {
    if (galleryCategory === 'all') return true;
    return asset.category === galleryCategory;
  });

  // 1-click apply from Gallery to a Hero Slide
  const handleApplyGalleryAssetToSlide = async (assetUrl: string, assetName: string, targetKey: string) => {
    const foundMeta = HERO_SLIDES_META.find(s => s.id === targetKey);
    const targetTitle = foundMeta?.name || '히어로 슬라이드 배경';

    if (onDirectApplyOptimistic) {
      onDirectApplyOptimistic(targetKey, assetUrl);
    }

    try {
      await directApplyOverride(
        targetKey,
        targetTitle,
        assetUrl,
        userEmail,
        'image',
        currentUser?.displayName || userEmail.split('@')[0],
        activeOverrides[targetKey]
      );
      showToast(`'${assetName}' 사진이 [${targetTitle}]에 즉시 적용되었습니다!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast('적용 실패: ' + msg, 'error');
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-[99999] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold animate-slideUp backdrop-blur-md ${
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

      {/* Floating Bottom Admin Control Bar (Only for authenticated Admins) */}
      {hasAdminPrivileges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900/90 dark:bg-black/90 backdrop-blur-md text-white shadow-2xl border border-white/10 text-xs font-medium">
          <div className="flex items-center gap-1.5 mr-2">
            <ShieldCheck size={16} className="text-amber-400" />
            <span className="font-bold text-gray-200">
              {isDeveloper ? '최고 관리자' : (currentAdminRecord?.name || '운영 관리자')}
            </span>
          </div>

          <button
            onClick={() => setIsAdminActive(!isAdminActive)}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer font-bold ${
              isAdminActive ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30' : 'bg-white/10 hover:bg-white/20 text-gray-300'
            }`}
          >
            <Edit3 size={12} />
            <span>화면 수정 탭 {isAdminActive ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => {
              setPortalTab('gallery');
              setIsAdminPortalOpen(true);
            }}
            className="px-3 py-1.5 rounded-full bg-blue-600/80 hover:bg-blue-600 text-white transition-all flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <ImageIcon size={12} />
            <span>사진함</span>
          </button>

          <button
            onClick={() => setIsAdminPortalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 transition-all flex items-center gap-1.5 cursor-pointer relative"
          >
            <Sliders size={12} />
            <span>관리 센터</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="로그아웃"
          >
            <LogOut size={13} />
          </button>
        </div>
      )}

      {/* Domain Auth Help Modal */}
      {domainAuthHelpOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900 dark:text-white">
                    Firebase 도메인 승인 등록 안내
                  </h4>
                  <p className="text-xs text-gray-500 font-mono">
                    도메인: hkonkorea.com
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDomainAuthHelpOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <p className="font-bold text-sm flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                <AlertCircle size={16} />
                Google 로그인이 차단되었나요?
              </p>
              <p className="leading-relaxed text-amber-800/90 dark:text-amber-200/90">
                Google 보안 규정상, <strong>hkonkorea.com</strong>과 같은 커스텀 도메인은 Firebase 콘솔의 <strong>[승인된 도메인]</strong> 목록에 등록해야 Google 팝업 로그인이 안전하게 허용됩니다.
              </p>
            </div>

            <div className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
              <p className="font-bold text-gray-900 dark:text-white">
                📌 해결 방법 (1분 소요):
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-gray-600 dark:text-gray-300 pl-1">
                <li>아래 <strong>[Firebase 콘솔 설정 바로가기]</strong> 버튼 클릭</li>
                <li><strong>[승인된 도메인 (Authorized domains)]</strong> 섹션에서 <strong>[도메인 추가]</strong> 클릭</li>
                <li><code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono font-bold text-blue-600">hkonkorea.com</code> 및 <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono font-bold text-blue-600">www.hkonkorea.com</code> 입력 후 [추가]</li>
              </ol>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href="https://console.firebase.google.com/project/gen-lang-client-0502379401/authentication/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 cursor-pointer transition-all"
              >
                <span>Firebase 콘솔 설정 바로가기</span>
                <ExternalLink size={14} />
              </a>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-[11px] text-gray-500 space-y-1">
                <p className="font-bold text-gray-700 dark:text-gray-300">
                  💡 지금 즉시 수정하려면?
                </p>
                <p className="leading-relaxed">
                  이미 승인된 공식 프리뷰 주소(<a href="https://ais-pre-abfjej22zvyckbl2onsmra-231019268385.asia-northeast1.run.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold">여기 클릭</a>)에서 로그인하여 수정하시면, 동일한 Firestore DB를 공유하므로 <strong>hkonkorea.com에도 즉시 실시간 반영</strong>됩니다!
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setDomainAuthHelpOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          1. Comprehensive Admin Security & Control Portal
          ======================================================== */}
      {isAdminPortalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header: Clean, Security-Respecting (No developer email leak) */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/80">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  isDeveloper 
                    ? 'bg-purple-600/15 text-purple-600 dark:text-purple-400' 
                    : hasAdminPrivileges 
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <span>HKON 보안 관리 센터</span>
                    {isDeveloper && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        최고 관리자
                      </span>
                    )}
                    {isRegisteredAdmin && !isDeveloper && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {currentAdminRecord?.name || '운영 관리자'}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser ? (
                      <span>로그인 계정: <strong>{currentUser.email}</strong></span>
                    ) : (
                      <span>웹사이트 관리자 인증이 필요합니다</span>
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
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-200 space-y-2">
                  <p className="font-bold text-sm flex items-center gap-1.5 text-gray-900 dark:text-white">
                    <ShieldCheck size={18} className="text-amber-500" />
                    HKON 웹사이트 담당자 전용 인증
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    등록된 관리자 계정으로 로그인 시 <strong>수정 탭</strong>, <strong>사진함 및 배경 사진 실시간 업로드</strong>, <strong>버전 히스토리 롤백</strong> 기능이 활성화됩니다.
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
                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 px-1">
                    <span>도메인: <strong>hkonkorea.com</strong></span>
                    <button
                      type="button"
                      onClick={() => setDomainAuthHelpOpen(true)}
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <HelpCircle size={12} />
                      <span>도메인 승인 안내</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: LOGGED IN BUT NOT REGISTERED AS ADMIN */}
            {currentUser && !hasAdminPrivileges && (
              <div className="p-8 space-y-6">
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={20} className="text-rose-600 dark:text-rose-400" />
                    <h4 className="font-bold text-sm text-rose-950 dark:text-rose-200">
                      수정 권한이 없는 계정입니다
                    </h4>
                  </div>
                  <p className="leading-relaxed">
                    현재 로그인된 계정(<strong>{currentUser.email}</strong>)은 등록된 관리자 목록에 포함되어 있지 않습니다.
                  </p>
                  <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
                    관리자 권한 부여가 필요하신 경우 시스템 관리자에게 권한 등록을 요청해주세요.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="flex-1 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs shadow-md cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-2"
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
                {/* 7 Clean Tabs */}
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
                    onClick={() => setPortalTab('gallery')}
                    className={`px-3.5 py-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                      portalTab === 'gallery'
                        ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <ImageIcon size={14} />
                    <span>사진함 (미디어 보관함)</span>
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
                    <span>히어로 배경</span>
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
                            <strong>{isDeveloper ? '최고 관리자' : (currentAdminRecord?.name || '운영 관리자')}</strong> 권한이 활성화되어 있습니다.
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold">
                            정상 인증됨
                          </span>
                        </div>
                      </div>

                      {/* Main Toggle Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-5 rounded-2xl border transition-all ${
                          isAdminActive 
                            ? 'border-amber-400 bg-amber-50/40 dark:bg-amber-950/30 dark:border-amber-800' 
                            : 'border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                              <Edit3 size={18} className="text-amber-500" />
                              <span>실시간 화면 수정 탭</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsAdminActive(!isAdminActive)}
                              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                                isAdminActive ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'
                              }`}
                            >
                              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                isAdminActive ? 'translate-x-6' : ''
                              }`} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            활성화 시 웹사이트 모든 텍스트 문구와 사진에 <strong>연필/카메라 아이콘</strong>이 노출되어 1클릭으로 수정할 수 있습니다.
                          </p>
                        </div>

                        <div className={`p-5 rounded-2xl border transition-all ${
                          isFeedbackModeActive 
                            ? 'border-blue-400 bg-blue-50/40 dark:bg-blue-950/30 dark:border-blue-800' 
                            : 'border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                              <Layers size={18} className="text-blue-500" />
                              <span>임직원 제안 모드</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsFeedbackModeActive(!isFeedbackModeActive)}
                              className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${
                                isFeedbackModeActive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                              }`}
                            >
                              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                isFeedbackModeActive ? 'translate-x-6' : ''
                              }`} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            임직원이나 팀원이 오타, 이미지 교체 건을 제안함에 등록할 수 있는 모드입니다.
                          </p>
                        </div>
                      </div>

                      {/* Quick Navigation Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setPortalTab('gallery')}
                          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-bold hover:bg-cyan-100 transition-colors cursor-pointer"
                        >
                          <ImageIcon size={16} />
                          <span>사진함 (미디어 보관)</span>
                        </button>
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

                  {/* TAB 2: GLOBAL PHOTO GALLERY (사진함) */}
                  {portalTab === 'gallery' && (
                    <div className="space-y-5">
                      {/* Top Dropzone Banner */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsGalleryDragging(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          setIsGalleryDragging(false);
                        }}
                        onDrop={async (e) => {
                          e.preventDefault();
                          setIsGalleryDragging(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) {
                            try {
                              const res = await processImageFile(file);
                              saveCustomGalleryPhoto(res.fileName, res.dataUrl);
                              showToast(`'${res.fileName}' 사진이 사진함에 저장되었습니다! (${res.sizeKb}KB)`);
                              if (galleryTargetSection) {
                                await handleApplyGalleryAssetToSlide(res.dataUrl, res.fileName, galleryTargetSection);
                              }
                            } catch (err) {
                              showToast('사진 처리 실패', 'error');
                            }
                          }
                        }}
                        onClick={() => galleryFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
                          isGalleryDragging
                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 scale-[1.01]'
                            : 'border-cyan-300 dark:border-cyan-800 bg-cyan-50/30 dark:bg-cyan-950/20 hover:border-cyan-400'
                        }`}
                      >
                        <input
                          type="file"
                          ref={galleryFileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const res = await processImageFile(file);
                                saveCustomGalleryPhoto(res.fileName, res.dataUrl);
                                showToast(`'${res.fileName}' 사진이 사진함에 저장되었습니다! (${res.sizeKb}KB)`);
                                if (galleryTargetSection) {
                                  await handleApplyGalleryAssetToSlide(res.dataUrl, res.fileName, galleryTargetSection);
                                }
                              } catch (err) {
                                showToast('사진 처리 실패', 'error');
                              }
                            }
                            e.target.value = '';
                          }}
                        />
                        <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                          <UploadCloud size={26} />
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                          컴퓨터의 사진 파일을 여기로 드래그하거나 클릭하여 추가
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          드롭 시 전역 사진함에 자동 등록되며, 원하는 위치를 선택해두면 <strong>즉시 0클릭 자동 반영</strong>됩니다!
                        </p>

                        <div className="mt-3 flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">드롭 시 자동 적용할 대상:</span>
                          <select
                            value={galleryTargetSection}
                            onChange={(e) => setGalleryTargetSection(e.target.value)}
                            className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold outline-none"
                          >
                            <option value="">(자동 적용 안 함 - 사진함에만 보관)</option>
                            {HERO_SLIDES_META.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Category Filter Pills */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-xs">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                          {(['all', 'hero', 'product', 'brand', 'custom'] as const).map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setGalleryCategory(cat)}
                              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                                galleryCategory === cat
                                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {cat === 'all' && `전체 사진 (${filteredGalleryAssets.length + customGalleryImages.length})`}
                              {cat === 'hero' && `히어로 슬라이드 (${GLOBAL_SITE_ASSETS.filter(a => a.category === 'hero').length})`}
                              {cat === 'product' && `제품 및 브랜드 (${GLOBAL_SITE_ASSETS.filter(a => a.category === 'product').length})`}
                              {cat === 'brand' && `회사 자산 (${GLOBAL_SITE_ASSETS.filter(a => a.category === 'brand').length})`}
                              {cat === 'custom' && `직접 업로드 보관함 (${customGalleryImages.length})`}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Photo Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                        {/* Custom uploaded photos first if custom or all */}
                        {(galleryCategory === 'all' || galleryCategory === 'custom') && customGalleryImages.map((custom) => (
                          <div
                            key={custom.id}
                            className="p-3 rounded-2xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/20 dark:bg-cyan-950/20 flex flex-col justify-between group shadow-sm hover:shadow-md transition-all"
                          >
                            <div>
                              <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-900 border border-gray-200 dark:border-gray-700 mb-2">
                                <img
                                  src={custom.url}
                                  alt={custom.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-cyan-600 text-white text-[9px] font-bold">
                                  직접 업로드
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setGalleryZoomImage({ name: custom.name, url: custom.url })}
                                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                                  title="크게 보기"
                                >
                                  <Maximize2 size={12} />
                                </button>
                              </div>
                              <h5 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                {custom.name}
                              </h5>
                              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                                {new Date(custom.addedAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleApplyGalleryAssetToSlide(custom.url, custom.name, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                                className="flex-1 px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-bold outline-none cursor-pointer"
                                defaultValue=""
                              >
                                <option value="" disabled>1클릭 슬라이드 적용 ▼</option>
                                {HERO_SLIDES_META.map(s => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                              </select>

                              <button
                                type="button"
                                onClick={() => removeCustomGalleryPhoto(custom.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                                title="사진함에서 삭제"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Standard Global Assets */}
                        {galleryCategory !== 'custom' && filteredGalleryAssets.map((asset) => {
                          const liveOverride = asset.sectionKey ? activeOverrides[asset.sectionKey] : null;
                          const currentLive = liveOverride || asset.defaultUrl;
                          const isCustomized = Boolean(liveOverride);

                          return (
                            <div
                              key={asset.id}
                              className={`p-3 rounded-2xl border flex flex-col justify-between group shadow-sm hover:shadow-md transition-all ${
                                isCustomized
                                  ? 'border-blue-300 dark:border-blue-800/80 bg-blue-50/20 dark:bg-blue-950/20'
                                  : 'border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30'
                              }`}
                            >
                              <div>
                                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-900 border border-gray-200 dark:border-gray-700 mb-2">
                                  <img
                                    src={currentLive}
                                    alt={asset.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                  {isCustomized ? (
                                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                                      🔥 라이브 수정됨
                                    </span>
                                  ) : (
                                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-gray-800/80 text-gray-200 text-[9px] font-bold">
                                      기본 에셋
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setGalleryZoomImage({ name: asset.name, url: currentLive })}
                                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                                    title="크게 보기"
                                  >
                                    <Maximize2 size={12} />
                                  </button>
                                </div>
                                <h5 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                                  {asset.name}
                                </h5>
                                <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                  {asset.desc || asset.defaultUrl}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                                <select
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      handleApplyGalleryAssetToSlide(currentLive, asset.name, e.target.value);
                                      e.target.value = '';
                                    }
                                  }}
                                  className="flex-1 px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-bold outline-none cursor-pointer"
                                  defaultValue=""
                                >
                                  <option value="" disabled>1클릭 슬라이드 적용 ▼</option>
                                  {HERO_SLIDES_META.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                  ))}
                                </select>

                                {isCustomized && asset.sectionKey && effectivePermissions.canRevert && (
                                  <button
                                    type="button"
                                    onClick={() => handleRevertPrompt(asset.sectionKey!, asset.name)}
                                    className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-950/60 transition-colors"
                                    title="기본값으로 되돌리기"
                                  >
                                    <RotateCcw size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: BACKGROUND IMAGE UPLOAD (DRAG & DROP) */}
                  {portalTab === 'backgrounds' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                        <p className="font-bold flex items-center gap-1.5">
                          <UploadCloud size={16} className="text-blue-500" />
                          Hero 슬라이드 배경 사진 실시간 업로드 (원클릭 드롭)
                        </p>
                        <p className="text-blue-800/80 dark:text-blue-300/80">
                          각 슬라이드 카드 위에 사진을 <strong>바로 드래그 앤 드롭</strong>하면 추가 클릭 없이 <strong>0초 즉시 반영</strong>됩니다.
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
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files?.[0];
                                if (file) {
                                  handleBackgroundUpload(file, slide.id, slide.name);
                                }
                              }}
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
                                    {slide.desc} • <span className="text-blue-600 font-semibold">사진 파일을 이 카드로 바로 드롭 가능</span>
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
                                      <UploadCloud size={13} />
                                      <span>{isUpdating ? '업로드 중...' : '사진 선택'}</span>
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

                  {/* TAB 4: PROPOSALS & REVIEW HUB */}
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
                                    작성자: {prop.authorName} ({new Date(prop.createdAt).toLocaleDateString()})
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-3 text-xs">
                                  {/* Before */}
                                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                                    <span className="text-[10px] font-bold text-gray-400 block mb-1">수정 전 원본:</span>
                                    {isImage ? (
                                      prop.originalImage ? (
                                        <img src={prop.originalImage} alt="Original" className="w-full h-24 object-cover rounded-lg" />
                                      ) : (
                                        <span className="text-gray-400">(기본 원본 이미지)</span>
                                      )
                                    ) : (
                                      <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{prop.originalText || '(기본 문구)'}</p>
                                    )}
                                  </div>

                                  {/* After */}
                                  <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">제안된 수정 내용:</span>
                                    {isImage ? (
                                      <img src={prop.proposedImage || prop.proposedText} alt="Proposed" className="w-full h-24 object-cover rounded-lg" />
                                    ) : (
                                      <p className="text-gray-900 dark:text-white font-medium line-clamp-3">{prop.proposedText}</p>
                                    )}
                                  </div>
                                </div>

                                {prop.reason && (
                                  <div className="text-[11px] text-gray-500 mb-3 bg-white/60 dark:bg-black/20 p-2 rounded-lg">
                                    <strong>사유:</strong> {prop.reason}
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                                  {prop.status === 'pending' && effectivePermissions.canDirectApply && (
                                    <button
                                      type="button"
                                      disabled={actionInProgressId === prop.id}
                                      onClick={() => handleApply(prop)}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                                    >
                                      <CheckCircle size={13} />
                                      <span>승인 및 라이브 반영</span>
                                    </button>
                                  )}

                                  {prop.status === 'pending' && effectivePermissions.canReject && (
                                    <button
                                      type="button"
                                      disabled={actionInProgressId === prop.id}
                                      onClick={() => handleRejectPrompt(prop)}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold cursor-pointer"
                                    >
                                      <XCircle size={13} />
                                      <span>반려</span>
                                    </button>
                                  )}

                                  {isCurrentlyActive && effectivePermissions.canRevert && (
                                    <button
                                      type="button"
                                      disabled={actionInProgressId === prop.sectionKey}
                                      onClick={() => handleRevertPrompt(prop.sectionKey, prop.sectionTitle)}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold cursor-pointer"
                                    >
                                      <RotateCcw size={13} />
                                      <span>원복(되돌리기)</span>
                                    </button>
                                  )}

                                  {effectivePermissions.canDelete && (
                                    <button
                                      type="button"
                                      disabled={actionInProgressId === prop.id}
                                      onClick={() => handleDeletePrompt(prop)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                      title="제안 내역 삭제"
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

                  {/* TAB 5: VERSIONS & ROLLBACKS */}
                  {portalTab === 'versions' && (
                    <div className="space-y-4">
                      {/* Sub-Filters */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1.5">
                          {(['all', 'images', 'texts', 'reverts'] as const).map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setVersionSubFilter(sub)}
                              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                                versionSubFilter === sub
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {sub === 'all' && `전체 버전 (${siteVersions.length})`}
                              {sub === 'images' && `배경 사진 버전 (${siteVersions.filter(v => v.targetType === 'image' || v.sectionKey.startsWith('image_')).length})`}
                              {sub === 'texts' && `텍스트 문구 버전 (${siteVersions.filter(v => v.targetType === 'text' && !v.sectionKey.startsWith('image_')).length})`}
                              {sub === 'reverts' && `원복/롤백 이력 (${siteVersions.filter(v => v.newValue.includes('복원') || v.changeNote?.includes('롤백')).length})`}
                            </button>
                          ))}
                        </div>
                        <span className="text-[11px] text-gray-500">
                          실시간 스냅샷: <strong>{filteredVersions.length}건</strong>
                        </span>
                      </div>

                      {/* Versions List */}
                      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                        {filteredVersions.length === 0 ? (
                          <div className="py-12 text-center text-gray-400 text-xs">
                            해당 분류의 버전 기록이 없습니다.
                          </div>
                        ) : (
                          filteredVersions.map((ver) => {
                            const isImg = ver.targetType === 'image' || ver.sectionKey.startsWith('image_');
                            const isCurrent = activeOverrides[ver.sectionKey] === ver.newValue;

                            return (
                              <div
                                key={ver.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                  isCurrent
                                    ? 'border-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/20'
                                    : 'border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-800/30'
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-100 dark:border-gray-800 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[10px]">
                                      {isImg ? '배경 사진' : '문구'}
                                    </span>
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                                      {ver.sectionTitle || ver.sectionKey}
                                    </span>
                                    {isCurrent && (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white font-bold text-[9px]">
                                        현재 적용 중
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-gray-400 text-[11px]">
                                    {new Date(ver.createdAt).toLocaleString()} • {ver.authorName}
                                  </span>
                                </div>

                                <div className="py-2.5 text-xs">
                                  {isImg ? (
                                    <div className="flex items-center gap-3">
                                      <img
                                        src={ver.newValue}
                                        alt="Version Snapshot"
                                        className="w-24 h-16 object-cover rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-900 shadow-sm"
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                      <div className="text-[11px] text-gray-500">
                                        <p className="font-semibold text-gray-700 dark:text-gray-300">{ver.changeNote || '사진 변경'}</p>
                                        <p className="truncate max-w-xs">{ver.newValue.slice(0, 60)}...</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <p className="text-gray-700 dark:text-gray-300 bg-white/60 dark:bg-gray-900/60 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 line-clamp-2">
                                      {ver.newValue}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                                  {!isCurrent && (
                                    <button
                                      type="button"
                                      disabled={actionInProgressId === ver.id}
                                      onClick={() => handleRollbackPrompt(ver)}
                                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer transition-all shadow-sm"
                                    >
                                      <RotateCcw size={12} />
                                      <span>이 버전으로 롤백</span>
                                    </button>
                                  )}

                                  {effectivePermissions.canDelete && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteVersion(ver.id)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 transition-colors"
                                      title="버전 삭제"
                                    >
                                      <Trash2 size={13} />
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

                  {/* TAB 6: ACTIVITY LOGS */}
                  {portalTab === 'logs' && (
                    <div className="space-y-4">
                      {/* Search & Sub-Filter Bar */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs pb-2 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                          {(['all', 'apply', 'reject', 'revert', 'delete', 'admin'] as const).map((sub) => (
                            <button
                              key={sub}
                              onClick={() => setLogSubFilter(sub)}
                              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer shrink-0 ${
                                logSubFilter === sub
                                  ? 'bg-teal-600 text-white shadow-sm'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {sub === 'all' && `전체 (${activityLogs.length})`}
                              {sub === 'apply' && '반영/승인'}
                              {sub === 'reject' && '반려'}
                              {sub === 'revert' && '원복'}
                              {sub === 'delete' && '삭제'}
                              {sub === 'admin' && '권한/계정'}
                            </button>
                          ))}
                        </div>

                        <div className="relative min-w-[180px]">
                          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                          <input
                            type="text"
                            value={logSearchQuery}
                            onChange={(e) => setLogSearchQuery(e.target.value)}
                            placeholder="사용자/대상 검색..."
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs outline-none"
                          />
                        </div>
                      </div>

                      {/* Logs List */}
                      <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                        {filteredLogs.length === 0 ? (
                          <div className="py-12 text-center text-gray-400 text-xs">
                            조회된 활동 로그가 없습니다.
                          </div>
                        ) : (
                          filteredLogs.map((log) => {
                            const badgeColor = 
                              log.actionType === 'apply' ? 'bg-emerald-100 text-emerald-700' :
                              log.actionType === 'reject' ? 'bg-rose-100 text-rose-700' :
                              log.actionType === 'revert' ? 'bg-amber-100 text-amber-700' :
                              log.actionType === 'delete' ? 'bg-red-100 text-red-700' :
                              log.actionType === 'rollback' ? 'bg-indigo-100 text-indigo-700' :
                              'bg-purple-100 text-purple-700';

                            const badgeText =
                              log.actionType === 'apply' ? '라이브 반영' :
                              log.actionType === 'reject' ? '제안 반려' :
                              log.actionType === 'revert' ? '코드 원복' :
                              log.actionType === 'delete' ? '기록 삭제' :
                              log.actionType === 'rollback' ? '버전 롤백' :
                              '권한 변경';

                            return (
                              <div
                                key={log.id}
                                className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] shrink-0 ${badgeColor}`}>
                                    {badgeText}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-bold text-gray-900 dark:text-white truncate">
                                      {log.targetTitle || log.target}
                                    </p>
                                    <p className="text-[11px] text-gray-500 truncate">
                                      {log.details || log.actionType}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 text-right">
                                  <div className="text-[11px] text-gray-400">
                                    <p className="font-medium text-gray-700 dark:text-gray-300">{log.userName || log.userEmail.split('@')[0]}</p>
                                    <p>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                  </div>

                                  {effectivePermissions.canDelete && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLog(log.id)}
                                      className="p-1 rounded text-gray-300 hover:text-rose-600 transition-colors"
                                      title="로그 삭제"
                                    >
                                      <Trash2 size={12} />
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

                  {/* TAB 7: ADMINS & GRANULAR PERMISSIONS */}
                  {portalTab === 'admins' && (
                    <div className="space-y-6">
                      {/* Master Super Admin Card (No dangerous email leak) */}
                      <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" />
                            <h4 className="font-bold text-sm text-purple-950 dark:text-purple-100">
                              최고 시스템 관리자 권한
                            </h4>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold text-[10px]">
                            전체 권한 상속
                          </span>
                        </div>
                        <p className="leading-relaxed text-purple-800/80 dark:text-purple-300/80">
                          모든 관리 권한(즉시 승인, 제안 반려, 코드 기본값 원복, 영구 삭제, 배경 사진 관리, 관리자 계정 추가 및 권한 설정)이 부여되어 있습니다.
                        </p>
                      </div>

                      {/* Add or Edit Admin Form */}
                      <form onSubmit={handleSaveAdmin} className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-4">
                        <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                          <Plus size={14} className="text-purple-600" />
                          <span>{editingAdminEmail ? '관리자 상세 권한 수정' : '새 관리자 이메일 등록 및 권한 설정'}</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              관리자 이메일 <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={newAdminEmail}
                              onChange={(e) => setNewAdminEmail(e.target.value)}
                              placeholder="admin@hkonkorea.com"
                              disabled={Boolean(editingAdminEmail)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                              관리자 이름 / 직책
                            </label>
                            <input
                              type="text"
                              value={newAdminName}
                              onChange={(e) => setNewAdminName(e.target.value)}
                              placeholder="홍길동 팀장"
                              className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs outline-none"
                            />
                          </div>
                        </div>

                        {/* Granular Permission Checkboxes */}
                        <div className="pt-2">
                          <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                            상세 권한 설정 (체크 시 활성화):
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                            <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newAdminPermissions.canDirectApply}
                                onChange={(e) => setNewAdminPermissions(p => ({ ...p, canDirectApply: e.target.checked }))}
                                className="rounded text-purple-600"
                              />
                              <span className="font-semibold text-gray-800 dark:text-gray-200">즉시 승인/반영</span>
                            </label>

                            <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newAdminPermissions.canReject}
                                onChange={(e) => setNewAdminPermissions(p => ({ ...p, canReject: e.target.checked }))}
                                className="rounded text-purple-600"
                              />
                              <span className="font-semibold text-gray-800 dark:text-gray-200">제안 반려/거절</span>
                            </label>

                            <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newAdminPermissions.canRevert}
                                onChange={(e) => setNewAdminPermissions(p => ({ ...p, canRevert: e.target.checked }))}
                                className="rounded text-purple-600"
                              />
                              <span className="font-semibold text-gray-800 dark:text-gray-200">코드 기본값 원복</span>
                            </label>

                            <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newAdminPermissions.canDelete}
                                onChange={(e) => setNewAdminPermissions(p => ({ ...p, canDelete: e.target.checked }))}
                                className="rounded text-purple-600"
                              />
                              <span className="font-semibold text-gray-800 dark:text-gray-200">기록 영구 삭제</span>
                            </label>

                            <label className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newAdminPermissions.canManageBackgrounds}
                                onChange={(e) => setNewAdminPermissions(p => ({ ...p, canManageBackgrounds: e.target.checked }))}
                                className="rounded text-purple-600"
                              />
                              <span className="font-semibold text-gray-800 dark:text-gray-200">배경 및 사진함 관리</span>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          {editingAdminEmail && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAdminEmail(null);
                                setNewAdminEmail('');
                                setNewAdminName('');
                                setNewAdminPermissions({ ...DEFAULT_ADMIN_PERMISSIONS });
                              }}
                              className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              취소
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={isAddingAdmin}
                            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                          >
                            {isAddingAdmin ? '저장 중...' : editingAdminEmail ? '권한 변경 저장' : '관리자 등록'}
                          </button>
                        </div>
                      </form>

                      {/* Admin List */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-xs text-gray-700 dark:text-gray-300">
                          등록된 운영 관리자 목록 ({adminUsers.length}명)
                        </h4>

                        {adminUsers.length === 0 ? (
                          <div className="p-6 text-center text-xs text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                            아직 추가된 보조 관리자가 없습니다.
                          </div>
                        ) : (
                          adminUsers.map((admin) => (
                            <div
                              key={admin.email}
                              className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                                    {admin.name || admin.email.split('@')[0]}
                                  </span>
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[10px]">
                                    운영 관리자
                                  </span>
                                </div>
                                <p className="text-gray-500 text-[11px] font-mono mt-0.5">
                                  {admin.email}
                                </p>
                                
                                {/* Permissions pill list */}
                                <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px]">
                                  <span className={admin.permissions?.canDirectApply ? 'text-emerald-600 font-bold' : 'line-through text-gray-300'}>즉시승인</span>
                                  <span className="text-gray-300">•</span>
                                  <span className={admin.permissions?.canReject ? 'text-rose-600 font-bold' : 'line-through text-gray-300'}>반려</span>
                                  <span className="text-gray-300">•</span>
                                  <span className={admin.permissions?.canRevert ? 'text-amber-600 font-bold' : 'line-through text-gray-300'}>원복</span>
                                  <span className="text-gray-300">•</span>
                                  <span className={admin.permissions?.canDelete ? 'text-rose-600 font-bold' : 'line-through text-gray-300'}>삭제</span>
                                  <span className="text-gray-300">•</span>
                                  <span className={admin.permissions?.canManageBackgrounds ? 'text-blue-600 font-bold' : 'line-through text-gray-300'}>배경사진</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingAdminEmail(admin.email);
                                    setNewAdminEmail(admin.email);
                                    setNewAdminName(admin.name || '');
                                    setNewAdminPermissions(admin.permissions || { ...DEFAULT_ADMIN_PERMISSIONS });
                                  }}
                                  className="px-3 py-1.5 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold text-xs cursor-pointer"
                                >
                                  권한 수정
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAdminConfirm(admin.email)}
                                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                  title="관리자 삭제"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}

            {/* Portal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex items-center justify-between text-xs text-gray-500">
              <span className="font-mono">HKON Cloud v3.8</span>
              <button
                type="button"
                onClick={() => setIsAdminPortalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-xs cursor-pointer hover:opacity-90"
              >
                닫기
              </button>
            </div>
          </div>
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
                    <span>{targetType === 'image' ? '사진 업로드 & 실시간 변경' : '화면 문구(텍스트) 수정'}</span>
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
                  
                  {/* Instant Auto-Apply Toggle (Eliminates extra clicks!) */}
                  {effectivePermissions.canDirectApply && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Zap size={16} className="text-emerald-600 dark:text-emerald-400 fill-emerald-500" />
                        <div>
                          <p className="font-bold text-emerald-950 dark:text-emerald-200">
                            드롭 즉시 실시간 사이트 자동 반영 (원클릭)
                          </p>
                          <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                            사진을 떨어뜨리는 즉시 추가 클릭 없이 웹사이트에 바로 적용됩니다.
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={instantApplyOnDrop}
                        onChange={(e) => setInstantApplyOnDrop(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                      />
                    </div>
                  )}

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
                        e.target.value = '';
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

                  {/* Live Preview & Prominent 1-Click Replace Button */}
                  {proposedImageValue && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
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

                      {/* Immediate Apply Banner Button (1-Click) */}
                      {effectivePermissions.canDirectApply && (
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={handleDirectApply}
                          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Zap size={15} className="fill-amber-300 text-amber-300" />
                          <span>{isSubmitting ? '사이트 반영 중...' : '🚀 지금 이 사진으로 즉시 교체 (원클릭)'}</span>
                        </button>
                      )}
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

      {/* Gallery Zoom Modal */}
      {galleryZoomImage && (
        <div 
          onClick={() => setGalleryZoomImage(null)}
          className="fixed inset-0 z-[99998] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer animate-fadeIn"
        >
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img 
              src={galleryZoomImage.url} 
              alt={galleryZoomImage.name} 
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/20" 
            />
            <p className="mt-3 text-white text-sm font-bold bg-black/60 px-4 py-1.5 rounded-full">
              {galleryZoomImage.name}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          3. Topmost In-App Confirmation Dialog (z-[999999])
          Guaranteed to display on top of ALL windows and portals
          ======================================================== */}
      {confirmDialog?.isOpen && (
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setConfirmDialog(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 border-2 border-amber-500/50 dark:border-amber-500/40 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${
                confirmDialog.confirmColor === 'rose'
                  ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400'
                  : confirmDialog.confirmColor === 'amber'
                  ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400'
                  : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400'
              }`}>
                <Shield size={22} />
              </div>
              <h4 className="font-bold text-base text-gray-900 dark:text-white">
                {confirmDialog.title}
              </h4>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              {confirmDialog.message}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                  confirmDialog.confirmColor === 'rose'
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                    : confirmDialog.confirmColor === 'amber'
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                }`}
              >
                {confirmDialog.confirmText || '확인'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          4. Topmost Reject Reason Dialog (z-[999999])
          Guaranteed to display on top of ALL windows and portals
          ======================================================== */}
      {rejectDialog?.isOpen && (
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setRejectDialog(null)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 border-2 border-rose-500/50 dark:border-rose-500/40 rounded-3xl p-6 sm:p-7 w-full max-w-md shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
                <XCircle size={22} />
              </div>
              <div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">
                  제안 반려 처리
                </h4>
                <p className="text-xs text-gray-500">
                  대상: {rejectDialog.targetTitle}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                반려 사유 입력:
              </label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="예: 최신 브랜드 가이드라인과 맞지 않음"
                className="w-full p-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectDialog(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30 cursor-pointer transition-all"
              >
                반려 확정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal backwards compatibility redirect */}
      {isAdminReviewOpen && (
        <div className="hidden">
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
