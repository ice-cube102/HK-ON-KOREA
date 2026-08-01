const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetStr = `  const openModal = (title: string, content: React.ReactNode, images?: string[]) => setModal({ isOpen: true, title, content, images });`;

if (code.includes(targetStr)) {
  const insertContent = `
export default function App() {
  const [currentLang, setCurrentLang] = useState('ko');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; content: React.ReactNode; images?: string[] }>({ isOpen: false, title: '', content: null });
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeDetailSlide, setActiveDetailSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLang as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

`;

  code = code.replace(targetStr, insertContent + targetStr);
  fs.writeFileSync('src/App.tsx', code, 'utf-8');
  console.log("App start restored.");
} else {
  console.log("Could not find target string.");
}
