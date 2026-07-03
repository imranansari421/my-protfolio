import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Linkedin, 
  Github, 
  Mail, 
  Cpu, 
  FileSpreadsheet, 
  FileText, 
  Code2, 
  Brain, 
  ArrowRight, 
  Briefcase, 
  Check, 
  Settings,
  ShieldCheck,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  Award,
  Instagram,
  Facebook,
  Phone,
  Bell,
  Inbox,
  Trash2,
  X,
  Send,
  Lock,
  Unlock,
  LogOut,
  Layout
} from "lucide-react";
import { PortfolioData, Project, Inquiry } from "./types";
import { 
  getPortfolioData, 
  savePortfolioData, 
  submitInquiry, 
  fetchInquiries, 
  updateInquiryStatus,
  deleteInquiry,
  clearAllInquiries,
  optimizePortfolioForFirestore
} from "./lib/firebase";
import AIAssistant from "./components/AIAssistant";
import AIAppStudio from "./components/AIAppStudio";
import ExcelStudio from "./components/ExcelStudio";
import WordBuilder from "./components/WordBuilder";
import ProfileCustomizer from "./components/ProfileCustomizer";
import ResumeModal from "./components/ResumeModal";
import ProjectCard from "./components/ProjectCard";

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
};

export default function App() {
  // Preset Default Profile Values (Preloaded for Imran Ansari from CV)
  const defaultPortfolio: PortfolioData = {
    name: "Imran Ansari",
    title: "Assistant at Active Engineers | Technical Operations & Software Developer",
    bio: "Technical Operations Specialist and Assistant at Active Engineers. Expert in integrating Google Gemini AI models directly into corporate Office workflows to build automated Excel reporting workbooks and Word compliance pipelines. Bridging industrial machinery logistics experience with advanced React, Tailwind, and Python engineering, I create robust enterprise integration solutions that accelerate quarterly reporting speeds and eliminate manual operational hours.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80",
    avatarFilters: {
      brightness: 105,
      contrast: 105,
      saturate: 110,
      grayscale: 0,
      blur: 0,
      sepia: 0
    },
    linkedinUrl: "https://linkedin.com/in/imran-ansari-99a",
    githubUrl: "https://github.com/imranansari421",
    email: "imranansari399605@gmail.com",
    instagramUrl: "https://www.instagram.com/imran_ansari000_?igsh=MTRqdGpuNDc2OHV1bA==",
    facebookUrl: "https://www.facebook.com/share/19u6U4CPNy/",
    phone: "7237873558",
    projects: [
      {
        id: "proj-railway",
        title: "Railway Machine Management System",
        description: "An enterprise-grade asset monitoring and machine scheduling platform designed for contract staff. Engineered with role-based access control, interactive checklists, and real-time maintenance logs.",
        tags: ["React", "Enterprise", "Logistics", "Machine Management"],
        link: "https://railway-machine-management-system.netlify.app/#/login",
        images: [
          "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&h=400&q=80"
        ]
      },
      {
        id: "proj-coaching",
        title: "Royal Coaching Center",
        description: "An immersive e-learning and institutional landing portal designed for Royal Coaching Center. Features custom course curriculum planners, batch schedulers, and rich interactive visual widgets.",
        tags: ["HTML5", "CSS3", "JavaScript", "E-Learning"],
        link: "https://imranansari421.github.io/Royal-Coaching-Center/",
        images: [
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&h=400&q=80",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&h=400&q=80"
        ]
      }
    ]
  };

  const [portfolio, setPortfolio] = useState<PortfolioData>(defaultPortfolio);
  const filters = portfolio.avatarFilters || {
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    blur: 0,
    sepia: 0
  };
  const filterStyle = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) blur(${filters.blur}px) sepia(${filters.sepia}%)`;
  const [activeTab, setActiveTab] = useState<"ai" | "code" | "excel" | "word">("ai");
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Admin Login States
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return safeLocalStorage.getItem("admin_is_logged_in") === "true";
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === "7995619382" && loginPassword === "Ansari@#1234509876") {
      setIsAdmin(true);
      safeLocalStorage.setItem("admin_is_logged_in", "true");
      setShowLoginModal(false);
      setLoginId("");
      setLoginPassword("");
      setLoginError("");
      // Immediately open customizer upon successful login
      setIsCustomizing(true);
    } else {
      setLoginError("Invalid Login ID or Password. Please try again!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    safeLocalStorage.removeItem("admin_is_logged_in");
    setIsCustomizing(false);
  };

  // Inquiries / Leads state
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = safeLocalStorage.getItem("portfolio_inquiries");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showAdminInbox, setShowAdminInbox] = useState(false);
  const [newInquiryCount, setNewInquiryCount] = useState(0);

  useEffect(() => {
    safeLocalStorage.setItem("portfolio_inquiries", JSON.stringify(inquiries));
    const unread = inquiries.filter(i => i.status === "unread").length;
    setNewInquiryCount(unread);
  }, [inquiries]);

  // Contact Form states
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formProjectType, setFormProjectType] = useState<string>("E-commerce website");
  const [customProjectType, setCustomProjectType] = useState("");
  const [formDetails, setFormDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim() || !formDetails.trim()) {
      alert("Please fill out all required fields!");
      return;
    }
    setIsSubmitting(true);

    const finalProjectType = formProjectType === "Other" ? (customProjectType.trim() || "Other") : formProjectType;

    const newInquiry: Inquiry = {
      id: "inquiry-" + Date.now(),
      name: formName,
      email: formEmail,
      phone: formPhone,
      projectType: finalProjectType,
      details: formDetails,
      submittedAt: new Date().toLocaleString(),
      status: "unread"
    };

    // Store in Firestore in the background
    submitInquiry(newInquiry).then((success) => {
      if (success) {
        // Sync with the actual IDs from firestore
        fetchInquiries().then(latest => {
          if (latest && latest.length > 0) {
            setInquiries(latest);
          }
        });
      }
    });

    setTimeout(() => {
      setInquiries(prev => [newInquiry, ...prev]);
      setIsSubmitting(false);
      setFormSubmitted(true);

      // Construct a pre-formatted email redirect
      const subject = encodeURIComponent(`Portfolio Project Request from ${formName}`);
      const body = encodeURIComponent(
        `Hi Imran,\n\nYou received a new project inquiry on your Portfolio Studio:\n\n` +
        `👤 Client Name: ${formName}\n` +
        `✉️ Email Address: ${formEmail}\n` +
        `📞 Phone Number: ${formPhone}\n` +
        `🌐 Requested Project Type: ${finalProjectType}\n` +
        `📝 Project Requirements & Details:\n${formDetails}\n\n` +
        `Submitted on: ${new Date().toLocaleString()}`
      );
      
      const mailtoUrl = `mailto:imranansari399605@gmail.com?subject=${subject}&body=${body}`;
      
      // Update browser location to send the pre-filled email draft
      window.location.href = mailtoUrl;

      // Clear the form fields
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormProjectType("E-commerce website");
      setCustomProjectType("");
      setFormDetails("");

      // Automatically reset formSubmitted notice after 7 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 7000);
    }, 800);
  };

  // Global Theme Toggle State ('light' or 'dark' Midnight Indigo)
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (safeLocalStorage.getItem("global_theme") as "light" | "dark") || "light";
  });

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    safeLocalStorage.setItem("global_theme", theme);
  }, [theme]);

  // Page template layout selection
  const [pageTemplate, setPageTemplate] = useState<"modern" | "futuristic" | "editorial">(() => {
    return (safeLocalStorage.getItem("page_template") as "modern" | "futuristic" | "editorial") || "modern";
  });

  const changeTemplate = (newTemplate: "modern" | "futuristic" | "editorial") => {
    setPageTemplate(newTemplate);
    safeLocalStorage.setItem("page_template", newTemplate);
  };

  const getBodyFont = () => {
    switch (pageTemplate) {
      case "futuristic":
        return "font-mono";
      case "editorial":
        return "font-serif";
      default:
        return "font-sans";
    }
  };

  // Load from Firestore with local storage fallbacks
  useEffect(() => {
    async function loadFirebaseData() {
      // 1. Check if we have local storage data first
      const saved = safeLocalStorage.getItem("portfolio_studio_data");
      let localData: PortfolioData | null = null;
      if (saved) {
        try {
          localData = JSON.parse(saved);
        } catch (err) {
          console.error("Failed to parse saved portfolio:", err);
        }
      }

      // Fetch Portfolio Data from Firestore
      const dbPortfolio = await getPortfolioData(defaultPortfolio);
      
      if (dbPortfolio) {
        let chosenPortfolio = dbPortfolio;
        
        const isDbDefault = dbPortfolio.bio === defaultPortfolio.bio && dbPortfolio.name === defaultPortfolio.name;
        const isLocalCustom = localData && (localData.bio !== defaultPortfolio.bio || localData.name !== defaultPortfolio.name || localData.avatarUrl !== defaultPortfolio.avatarUrl || (localData.projects && localData.projects.length !== defaultPortfolio.projects.length));

        if (isLocalCustom && isDbDefault) {
          // Local storage has custom changes, but Firestore has default. Let's sync local storage to Firestore (it will be optimized on save!)
          chosenPortfolio = localData!;
          await savePortfolioData(chosenPortfolio);
        }

        let mergedProjects = [...(chosenPortfolio.projects || [])];
        mergedProjects = mergedProjects.filter(p => p.id !== "proj-1" && p.id !== "proj-2");

        defaultPortfolio.projects.forEach(defProj => {
          if (!mergedProjects.some(p => p.id === defProj.id || (defProj.link && p.link === defProj.link))) {
            mergedProjects.push(defProj);
          }
        });
        
        // Optimize the chosen portfolio for local state & storage as well
        const optimized = await optimizePortfolioForFirestore({
          ...chosenPortfolio,
          projects: mergedProjects
        });
        
        setPortfolio(optimized);
        safeLocalStorage.setItem("portfolio_studio_data", JSON.stringify(optimized));
      } else {
        // Fallback to local storage if Firestore failed or is offline
        if (localData) {
          let mergedProjects = [...(localData.projects || [])];
          mergedProjects = mergedProjects.filter(p => p.id !== "proj-1" && p.id !== "proj-2");

          defaultPortfolio.projects.forEach(defProj => {
            if (!mergedProjects.some(p => p.id === defProj.id || (defProj.link && p.link === defProj.link))) {
              mergedProjects.push(defProj);
            }
          });
          
          const optimized = await optimizePortfolioForFirestore({
            ...localData,
            projects: mergedProjects
          });
          setPortfolio(optimized);
          safeLocalStorage.setItem("portfolio_studio_data", JSON.stringify(optimized));
        }
      }

      // 2. Fetch Inquiries from Firestore
      const dbInquiries = await fetchInquiries();
      if (dbInquiries && dbInquiries.length > 0) {
        setInquiries(dbInquiries);
      }
    }
    loadFirebaseData();
  }, []);

  const handleSavePortfolio = async (newData: PortfolioData) => {
    // Compress and optimize large base64 images to prevent Firestore and LocalStorage size crashes
    const optimized = await optimizePortfolioForFirestore(newData);
    setPortfolio(optimized);
    safeLocalStorage.setItem("portfolio_studio_data", JSON.stringify(optimized));
    
    // Save to Firestore
    await savePortfolioData(optimized);

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2500);
  };

  const scrollToWorkspaces = () => {
    const el = document.getElementById("workspaces-anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact-section-anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-[#070817] text-slate-800 dark:text-[#cbd4ff] selection:bg-indigo-500 selection:text-white overflow-x-hidden transition-colors duration-300 ${getBodyFont()}`}>
      
      {/* Dynamic Success Notification */}
      {showNotification && (
        <div className="fixed top-5 right-5 bg-white border border-emerald-500 text-emerald-600 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span className="text-xs font-semibold">Portfolio details updated successfully!</span>
        </div>
      )}

       {/* Top Header Navigation Line */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-[#1e204c]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">{portfolio.name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="font-display font-bold tracking-wide text-sm text-slate-900 dark:text-white">{portfolio.name}</h1>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold tracking-wider uppercase">Web Developer & Assistant</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-wider uppercase text-slate-600 dark:text-indigo-200">
          <button onClick={scrollToWorkspaces} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">Interactive Integrations</button>
          <button onClick={scrollToContact} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">Get In Touch</button>
        </nav>

        <div className="flex items-center gap-2">
          {/* Global Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center bg-white dark:bg-[#11122a] hover:bg-slate-50 dark:hover:bg-[#18193d] border border-slate-200 dark:border-[#202256] text-slate-700 dark:text-indigo-200 w-9.5 h-9.5 rounded-full transition cursor-pointer shadow-sm"
            title={theme === "light" ? "Switch to Midnight Indigo" : "Switch to Light Mode"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Admin Notifications Bell Icon */}
          {isAdmin && (
            <button
              onClick={() => setShowAdminInbox(true)}
              className="relative flex items-center justify-center bg-white dark:bg-[#11122a] hover:bg-slate-50 dark:hover:bg-[#18193d] border border-slate-200 dark:border-[#202256] text-slate-700 dark:text-indigo-200 w-9.5 h-9.5 rounded-full transition cursor-pointer shadow-sm"
              title="Admin Lead Inbox & Notifications"
            >
              <Bell className={`w-4 h-4 ${newInquiryCount > 0 ? "text-indigo-600 dark:text-indigo-400 animate-pulse font-bold" : "text-slate-500 dark:text-indigo-300"}`} />
              {newInquiryCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white ring-2 ring-white dark:ring-[#11122a]">
                  {newInquiryCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setShowResumeModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold px-4 py-2 rounded-full transition cursor-pointer shadow-sm border border-transparent"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Professional CV (PDF)</span>
          </button>

          {isAdmin ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <button
                onClick={() => setIsCustomizing(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-bold px-4 py-2 rounded-full transition cursor-pointer shadow-sm border border-transparent"
                title="Full portfolio customizer is active"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-xs text-white font-bold px-3 py-2 rounded-full transition cursor-pointer shadow-sm border border-transparent"
                title="Exit Admin Mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 bg-white dark:bg-[#11122a] hover:bg-slate-50 dark:hover:bg-[#18193d] border border-slate-200 dark:border-[#202256] text-xs text-slate-700 dark:text-indigo-200 font-medium px-4 py-2 rounded-full transition cursor-pointer shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Dynamic Page Layout Template Selector */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2 no-print">
        <div className="bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl">
              <Layout className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-white block">Visual Layout Template</span>
              <span className="text-[10px] text-slate-500 dark:text-indigo-300">Instantly switch between gorgeous pre-configured page template presets</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => changeTemplate("modern")}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer ${
                pageTemplate === "modern"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : "bg-slate-50 dark:bg-[#18193d] text-slate-600 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-[#202256] border border-slate-200 dark:border-transparent"
              }`}
            >
              💼 Modern
            </button>
            <button
              onClick={() => changeTemplate("futuristic")}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer ${
                pageTemplate === "futuristic"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : "bg-slate-50 dark:bg-[#18193d] text-slate-600 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-[#202256] border border-slate-200 dark:border-transparent"
              }`}
            >
              👾 Futuristic
            </button>
            <button
              onClick={() => changeTemplate("editorial")}
              className={`px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-250 cursor-pointer ${
                pageTemplate === "editorial"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : "bg-slate-50 dark:bg-[#18193d] text-slate-600 dark:text-indigo-200 hover:bg-slate-100 dark:hover:bg-[#202256] border border-slate-200 dark:border-transparent"
              }`}
            >
              📚 Editorial
            </button>
          </div>
        </div>
      </div>

      {/* Stunning Hero Section Recreating the curves from Mockup */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-indigo-950 text-white rounded-3xl overflow-hidden relative shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[500px]"
        >
          
          {/* Hero Left Content Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 xl:p-16 flex flex-col justify-center space-y-6 z-10">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-indigo-200 font-mono text-xs font-semibold uppercase tracking-widest bg-white/10 border border-white/20 px-3 py-1.5 rounded-full inline-block self-start"
            >
              {portfolio.title}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="font-display text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Hello, my name is <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-100 to-white font-black">
                {portfolio.name}
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-sm text-indigo-200 leading-relaxed max-w-xl font-sans font-normal"
            >
              {portfolio.bio}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap gap-3 py-1"
            >
              <button
                onClick={() => setShowResumeModal(true)}
                className="bg-white hover:bg-slate-150 text-indigo-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer hover:scale-102 shadow-lg shadow-white/5"
              >
                <Award className="w-4 h-4 text-indigo-650" />
                <span>Professional CV (PDF)</span>
              </button>

              {portfolio.phone && (
                <a
                  href={`tel:${portfolio.phone}`}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/20 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition hover:scale-102"
                >
                  <Phone className="w-4 h-4 text-indigo-200" />
                  <span>Call: {portfolio.phone}</span>
                </a>
              )}
              
              {portfolio.linkedinUrl && (
                <a
                  href={portfolio.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition hover:scale-102"
                >
                  <Linkedin className="w-4 h-4 text-indigo-300" />
                  <span>LinkedIn</span>
                </a>
              )}

              {portfolio.githubUrl && (
                <a
                  href={portfolio.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition hover:scale-102"
                >
                  <Github className="w-4 h-4 text-white" />
                  <span>GitHub</span>
                </a>
              )}

              {portfolio.instagramUrl && (
                <a
                  href={portfolio.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition hover:scale-102"
                >
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram</span>
                </a>
              )}

              {portfolio.facebookUrl && (
                <a
                  href={portfolio.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition hover:scale-102"
                >
                  <Facebook className="w-4 h-4 text-sky-400" />
                  <span>Facebook</span>
                </a>
              )}
            </motion.div>

            {/* Quick Badges of Integrations */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="border-t border-indigo-900/60 pt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-indigo-300"
            >
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-400" /> AI Knowledge</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-400" /> AI Web & App Studio</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-400" /> Excel Integration</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-indigo-400" /> Word Integration</span>
            </motion.div>
          </div>

          {/* Hero Right Media Column Recreating organic mockup waves */}
          <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-0 overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 flex items-center justify-center">
            
            {/* Organic curve backdrop overlay */}
            <div className="absolute inset-0 bg-indigo-950/20 z-0"></div>
            <div 
              className="absolute left-0 top-0 bottom-0 w-32 bg-slate-900/0 z-10 hidden lg:block"
              style={{
                clipPath: "polygon(0 0, 100% 0, 30% 50%, 100% 100%, 0 100%)",
                background: "rgb(30, 27, 75)"
              }}
            ></div>

            {/* Simulated wavy frame borders */}
            <svg 
              className="absolute left-0 h-full w-48 text-indigo-950 pointer-events-none z-10 hidden lg:block -ml-24" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0,0 Q60,50 0,100 L0,100 Z" />
            </svg>

            {/* Profile Avatar Image styled dynamically */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-indigo-950 shadow-2xl overflow-hidden z-10 group transition-all duration-300 hover:scale-105"
            >
              <img
                src={portfolio.avatarUrl}
                alt={portfolio.name}
                referrerPolicy="no-referrer"
                style={{ filter: filterStyle }}
                className="w-full h-full object-cover object-top transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/60 to-transparent"></div>
            </motion.div>

            {/* Abstract background floating ornaments */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute top-8 right-8 w-12 h-12 rounded-full border-4 border-white/10 animate-bounce" 
              style={{ animationDuration: "3s" }}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute bottom-8 left-8 w-16 h-16 rounded-full border-4 border-white/15 animate-pulse" 
              style={{ animationDuration: "5s" }}
            ></motion.div>
          </div>

        </motion.div>
      </section>

      {/* Anchor point for interactive integrations section */}
      <section id="workspaces-anchor" className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Workspace Title & Intro */}
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-[#15163d] border border-indigo-100 dark:border-[#22245c] text-xs font-mono text-indigo-600 dark:text-indigo-300">
            <Cpu className="w-3.5 h-3.5 animate-spin-slow text-indigo-600 dark:text-indigo-400" />
            Interactive Portfolio Playground
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Knowledge & Code Workspace Integrations
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-200 leading-relaxed font-sans font-normal">
            Interact with Imran's digital double, compile and generate custom responsive layouts via his AI App Studio, generate advanced Excel spreadsheet grids with live charts, or auto-draft styled corporate Word documents.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap gap-2.5 max-w-4xl mx-auto mb-8 justify-center">
          {/* AI Knowledge Chat */}
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
              activeTab === "ai"
                ? "bg-indigo-600 text-white border-indigo-500 font-bold shadow-lg shadow-indigo-600/15"
                : "bg-white dark:bg-[#11122a] hover:bg-slate-50 dark:hover:bg-[#18193d] text-slate-600 dark:text-indigo-200 border-slate-200 dark:border-[#202256]"
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>AI Knowledge Assistant</span>
          </button>

          {/* AI App & Web Studio */}
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
              activeTab === "code"
                ? "bg-indigo-600 text-white border-indigo-500 font-bold shadow-lg shadow-indigo-600/15"
                : "bg-white dark:bg-[#11122a] hover:bg-slate-50 dark:hover:bg-[#18193d] text-slate-600 dark:text-indigo-200 border-slate-200 dark:border-[#202256]"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>AI App & Web Studio</span>
          </button>

          {/* Excel spreadsheet and charts */}
          <button
            onClick={() => setActiveTab("excel")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
              activeTab === "excel"
                ? "bg-indigo-600 text-white border-indigo-500 font-bold shadow-lg shadow-indigo-600/15"
                : "bg-white dark:bg-[#11122a] hover:bg-slate-50 dark:hover:bg-[#18193d] text-slate-600 dark:text-indigo-200 border-slate-200 dark:border-[#202256]"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Integration</span>
          </button>

          {/* Word document builder */}
          <button
            onClick={() => setActiveTab("word")}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
              activeTab === "word"
                ? "bg-indigo-600 text-white border-indigo-500 font-bold shadow-lg shadow-indigo-600/15"
                : "bg-white dark:bg-[#11122a] hover:bg-slate-50 dark:hover:bg-[#18193d] text-slate-600 dark:text-indigo-200 border-slate-200 dark:border-[#202256]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Word Integration</span>
          </button>
        </div>

        {/* Workspace Display Area with smooth transitions */}
        <div className="max-w-7xl mx-auto transition-all duration-300">
          {activeTab === "ai" && <AIAssistant portfolio={portfolio} />}
          {activeTab === "code" && <AIAppStudio />}
          {activeTab === "excel" && <ExcelStudio />}
          {activeTab === "word" && <WordBuilder />}
        </div>

      </section>

      {/* Beautiful Featured Work Experience Cards */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-[#1e204c] mt-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-[#1e204c] pb-5">
          <div>
            <h3 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Imran's Featured Integration Projects</h3>
            <p className="text-xs text-slate-500 dark:text-indigo-300 font-mono">Real systems compiled for corporate pipelines</p>
          </div>
          <a
            href={`mailto:${portfolio.email}`}
            className="text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 transition select-none"
          >
            Request custom integration services
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolio.projects.map((proj) => (
            <ProjectCard 
              key={proj.id} 
              proj={proj} 
              email={portfolio.email} 
            />
          ))}
        </div>
      </section>

      {/* Interactive Project Inquiry Contact Section */}
      <section id="contact-section-anchor" className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-[#1e204c] mt-12 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Info Column (Left) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-[#15163c] border border-indigo-100 dark:border-[#22245c] px-3 py-1 rounded-full inline-block">
                Start Collaboration
              </span>
              <h3 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Connect Directly with Imran
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-indigo-200 leading-relaxed font-sans">
                Looking to build a custom web experience, optimize digital operations, or set up modern office templates? Fill out this inquiry. Your details will be instantly stored in Imran's **Admin Notification Center** and trigger a direct email draft.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] rounded-2xl shadow-sm hover:border-indigo-100 transition">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-[#15163c] text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <a href={`tel:${portfolio.phone}`} className="text-sm font-bold text-slate-800 dark:text-white hover:text-indigo-600 transition font-mono">
                    +91 {portfolio.phone || "7237873558"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] rounded-2xl shadow-sm hover:border-indigo-100 transition">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-[#15163c] text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <a href={`mailto:${portfolio.email}`} className="text-sm font-bold text-slate-800 dark:text-white hover:text-indigo-600 transition font-mono">
                    {portfolio.email || "imranansari399605@gmail.com"}
                  </a>
                </div>
              </div>
            </div>

            {/* Professional Ethics Badges */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono text-slate-500 dark:text-indigo-300">
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-[#16173d] px-3 py-1 rounded-lg border border-slate-200/50 dark:border-[#22245c]">
                <Check className="w-3 h-3 text-indigo-500" /> Fast Response
              </span>
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-[#16173d] px-3 py-1 rounded-lg border border-slate-200/50 dark:border-[#22245c]">
                <Check className="w-3 h-3 text-indigo-500" /> Direct Admin Logging
              </span>
              <span className="flex items-center gap-1 bg-slate-100 dark:bg-[#16173d] px-3 py-1 rounded-lg border border-slate-200/50 dark:border-[#22245c]">
                <Check className="w-3 h-3 text-indigo-500" /> Complete Transparency
              </span>
            </div>
          </div>

          {/* Form Column (Right) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
            
            {/* Visual glow on form header */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            {formSubmitted ? (
              <div className="py-10 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-[#102b1c] text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-[#153e28] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <ShieldCheck className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-extrabold text-xl text-slate-900 dark:text-white">Inquiry Logged Successfully!</h4>
                  <p className="text-xs text-slate-500 dark:text-indigo-200 max-w-md mx-auto leading-relaxed">
                    Thank you! Your details have been recorded in Imran's **Admin Notifications (check the Bell icon at the top of the page)** and your email client has been opened to send the message.
                  </p>
                </div>
                <div className="pt-2 text-xs text-slate-400 dark:text-indigo-400 font-mono">
                  PROFESSIONAL DISPATCH PIPELINE SECURE
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-widest font-mono">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#15163c] border border-slate-200 dark:border-[#22245c] rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans transition-all duration-200"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-widest font-mono">
                      Your Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. client@example.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#15163c] border border-slate-200 dark:border-[#22245c] rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone number field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-widest font-mono">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 7237873558"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#15163c] border border-slate-200 dark:border-[#22245c] rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans transition-all duration-200"
                    />
                  </div>

                  {/* Select type field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-widest font-mono">
                      Project Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formProjectType === "E-commerce website" || formProjectType === "Industry portal" || formProjectType === "Education Website" ? formProjectType : "Other"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormProjectType(val);
                      }}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#15163c] border border-slate-200 dark:border-[#22245c] rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans transition-all duration-200 text-slate-850"
                    >
                      <option value="E-commerce website">E-commerce website</option>
                      <option value="Industry portal">Industry portal</option>
                      <option value="Education Website">Education Website</option>
                      <option value="Other">Other</option>
                    </select>

                    {/* Show custom project type input if "Other" is selected */}
                    {formProjectType === "Other" && (
                      <div className="pt-2">
                        <input
                          type="text"
                          required
                          placeholder="Please specify your project type..."
                          value={customProjectType}
                          onChange={(e) => setCustomProjectType(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#15163c] border border-indigo-400 dark:border-[#22245c] rounded-xl text-slate-850 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans transition-all duration-200"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Details text area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-widest font-mono">
                    Project Requirements / Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    maxLength={100000000}
                    placeholder="Briefly describe what you'd like to build or automate with Imran... (Supports unlimited detailed text up to 100M characters)"
                    value={formDetails}
                    onChange={(e) => setFormDetails(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#15163c] border border-slate-200 dark:border-[#22245c] rounded-xl text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans transition-all duration-200 resize-y min-h-[120px]"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer hover:scale-101 shadow-md shadow-indigo-600/10 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Logging Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Request & Launch Email</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Styled Minimalist Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-slate-200 dark:border-[#1e204c] mt-16 text-center text-xs space-y-3">
        <div className="flex justify-center space-x-6 text-slate-500 dark:text-indigo-300 font-mono">
          {portfolio.linkedinUrl && <a href={portfolio.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">LinkedIn</a>}
          {portfolio.githubUrl && <a href={portfolio.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">GitHub</a>}
          <a href={`mailto:${portfolio.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Email</a>
        </div>
        <div>
          <span className="font-glitch text-[11px] sm:text-xs tracking-wider" data-text={`© 2026 ${portfolio.name}. React, Tailwind, and Node.js.`}>
            © 2026 {portfolio.name}. React, Tailwind, and Node.js.
          </span>
        </div>
      </footer>

      {/* Profile Settings Drawer Modal */}
      {isCustomizing && (
        <ProfileCustomizer
          portfolio={portfolio}
          onSave={handleSavePortfolio}
          onClose={() => setIsCustomizing(false)}
        />
      )}

      {/* Professional Resume / CV Modal */}
      {showResumeModal && (
        <ResumeModal
          portfolio={portfolio}
          onClose={() => setShowResumeModal(false)}
        />
      )}

      {/* Admin Notification Center / Leads Inbox Modal */}
      {showAdminInbox && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#202256] rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-slide-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1e204c] bg-slate-50 dark:bg-[#16173d] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-[#15163c] text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-slate-950 dark:text-white text-sm tracking-wide">
                    Admin Notification Center
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-indigo-300 font-mono uppercase tracking-wider">
                    Customer Project Inquiries & Leads Inbox
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAdminInbox(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - List of inquiries */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-[#070817]/30">
              {inquiries.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-[#15163c] text-slate-400 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">No inquiries logged yet</p>
                    <p className="text-[11px] text-slate-400 dark:text-indigo-300 max-w-xs mx-auto leading-relaxed">
                      Customer submissions from the contact form below the projects section will show up here as active notifications.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-100 dark:border-[#1e204c] pb-2">
                    <span>{inquiries.length} TOTAL INQUIRIES</span>
                    <button 
                      onClick={async () => {
                        if (confirm("Are you sure you want to clear all notifications?")) {
                          setInquiries([]);
                          await clearAllInquiries();
                        }
                      }}
                      className="text-rose-500 hover:text-rose-600 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear All
                    </button>
                  </div>

                  {inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className={`p-4 border rounded-2xl transition duration-200 ${
                        inq.status === "unread" 
                          ? "bg-indigo-50/40 dark:bg-[#15163c]/30 border-indigo-200 dark:border-indigo-500/50" 
                          : "bg-white dark:bg-[#11122a] border-slate-200 dark:border-[#1e204c]"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 dark:border-[#1e204c]/60 pb-2.5 mb-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{inq.name}</h4>
                            <span className="text-[9px] font-mono bg-indigo-50 dark:bg-[#15163c] text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-[#22245c] uppercase">
                              {inq.projectType}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-slate-500 dark:text-indigo-300">
                            <a href={`mailto:${inq.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-0.5">
                              <Mail className="w-3 h-3 text-indigo-500" /> {inq.email}
                            </a>
                            <a href={`tel:${inq.phone}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-0.5">
                              <Phone className="w-3 h-3 text-indigo-500" /> {inq.phone}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-slate-400">{inq.submittedAt}</span>
                          
                          {/* Toggle read status */}
                          <button
                            onClick={async () => {
                              const nextStatus = inq.status === "unread" ? "read" : "unread";
                              setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, status: nextStatus } : i));
                              if (inq.id) {
                                await updateInquiryStatus(inq.id, nextStatus);
                              }
                            }}
                            className={`text-[9px] font-mono px-2 py-0.5 rounded border transition cursor-pointer font-bold ${
                              inq.status === "unread"
                                ? "bg-emerald-50 dark:bg-[#102b1c] text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-[#153e28] hover:bg-emerald-100"
                                : "bg-slate-100 dark:bg-[#1a1b3d] text-slate-500 dark:text-indigo-200 border-slate-200 dark:border-[#2b2d6a] hover:bg-slate-200"
                            }`}
                          >
                            {inq.status === "unread" ? "Mark Read" : "Mark Unread"}
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={async () => {
                              setInquiries(prev => prev.filter(i => i.id !== inq.id));
                              if (inq.id) {
                                await deleteInquiry(inq.id);
                              }
                            }}
                            className="text-rose-500 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Request Details */}
                      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-indigo-200 bg-slate-50 dark:bg-[#070817]/60 p-3 rounded-xl border border-slate-100 dark:border-[#1e204c] whitespace-pre-wrap font-sans">
                        {inq.details}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-[#16173d] border-t border-slate-100 dark:border-[#1e204c] flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>ACTIVE ADMIN SECURE LEAD MANAGEMENT</span>
              <button
                onClick={() => setShowAdminInbox(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-lg text-[10px] uppercase cursor-pointer transition"
              >
                Close Inbox
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in font-sans">
          <div className="bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#202256] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-slide-up relative">
            {/* Design header glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {/* Close button */}
            <button
              onClick={() => {
                setShowLoginModal(false);
                setLoginId("");
                setLoginPassword("");
                setLoginError("");
              }}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-[#1c1d42] text-slate-400 hover:text-slate-600 dark:hover:text-indigo-300 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Icon & Heading */}
              <div className="space-y-2 text-center pt-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-[#15163c] text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-xl text-slate-900 dark:text-white tracking-tight">
                  Admin System Access
                </h3>
                <p className="text-xs text-slate-500 dark:text-indigo-300 leading-normal max-w-xs mx-auto">
                  Provide credentials below to unlock dynamic website customization and administrative controls.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-3 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-widest font-mono">
                    Login ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Login ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#15163c] border border-slate-200 dark:border-[#22245c] rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-mono transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-indigo-400 uppercase tracking-widest font-mono">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#15163c] border border-slate-200 dark:border-[#22245c] rounded-xl text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer hover:scale-101 shadow-md shadow-indigo-600/10"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Authenticate & Edit Site</span>
                </button>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-[#16173d] border-t border-slate-100 dark:border-[#1e204c] text-center text-[10px] font-mono text-slate-400">
              SECURE SECRETS CONTROL SYSTEM ACTIVE
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
