import React, { useState } from "react";
import { PortfolioData } from "../types";
import { Settings, Save, RefreshCw, X, User, Briefcase, Mail, Linkedin, Github, FileText, Upload, Image, Plus, Trash2, ExternalLink, Instagram, Facebook, Phone } from "lucide-react";

interface ProfileCustomizerProps {
  portfolio: PortfolioData;
  onSave: (newData: PortfolioData) => void;
  onClose: () => void;
}

export default function ProfileCustomizer({ portfolio, onSave, onClose }: ProfileCustomizerProps) {
  const [formData, setFormData] = useState<PortfolioData>(() => {
    const data = { ...portfolio };
    if (!data.avatarFilters) {
      data.avatarFilters = {
        brightness: 105,
        contrast: 105,
        saturate: 110,
        grayscale: 0,
        blur: 0,
        sepia: 0
      };
    }
    return data;
  });
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }
    // limit size to 4.5MB for browser state performance
    if (file.size > 4.5 * 1024 * 1024) {
      setUploadError("Image size should be less than 4.5MB.");
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: e.target!.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    const original: PortfolioData = {
      name: "Imran Ansari",
      title: "Assistant at Active Engineers | Web & App Developer",
      bio: "Dedicated equipment maintenance professional and Assistant at Active Engineers. In addition to handling track relaying train operations, logbooks, and daily ledgers, I design and build highly polished, professional websites and applications using HTML, CSS, JavaScript, React, and Node.js (with Python learning in progress). I combine on-site logistics expertise with modern web development to streamline workflows and boost productivity.",
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
      projects: portfolio.projects, // keep existing projects
    };
    setFormData(original);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600 animate-spin-slow" />
            <h2 className="font-display font-bold text-slate-800 text-lg">Customize Portfolio Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <p className="text-xs text-slate-500 leading-relaxed">
            Customize the global variables for this portfolio. Your changes will immediately populate the visual hero sections, links, and train the local AI chatbot double.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-sans focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Professional Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                Professional Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-sans focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Biography / Professional Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              required
              rows={3}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-sans focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-sans focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Avatar Photo Uploader */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Profile Photo / Avatar
              </label>
              
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-4 transition text-center flex flex-col items-center justify-center cursor-pointer ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/50"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
                }`}
                onClick={() => document.getElementById("avatar-file-upload")?.click()}
              >
                <input
                  id="avatar-file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Upload className="w-6 h-6 text-indigo-500 mb-1.5" />
                <p className="text-xs font-semibold text-slate-700">
                  Drag & drop your picture here
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  or <span className="text-indigo-600 underline font-medium">browse device files</span>
                </p>
              </div>

              {/* Upload error display */}
              {uploadError && (
                <p className="text-[10px] font-mono text-rose-600">{uploadError}</p>
              )}

              {/* Optional URL manual override */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-400 font-mono">Or paste image URL instead</span>
                  {formData.avatarUrl.startsWith("data:") && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&h=600&q=80" }))}
                      className="text-[9px] text-indigo-600 font-bold uppercase tracking-wider font-mono hover:underline cursor-pointer"
                    >
                      Use Default
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={formData.avatarUrl.startsWith("data:") ? "Local Uploaded Base64 Image Asset" : formData.avatarUrl}
                  onChange={(e) => {
                    if (e.target.value !== "Local Uploaded Base64 Image Asset") {
                      setFormData((prev) => ({ ...prev, avatarUrl: e.target.value }));
                    }
                  }}
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-[10px] font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Real-time Image Enhancer Tool */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Live Portrait Enhancement Suite
                </span>
              </div>
              <span className="text-[9px] font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                CSS Filters
              </span>
            </div>

            {/* Live Preview & Quick Presets */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Dynamic Enhanced Preview Circle */}
              <div className="relative w-24 h-24 rounded-full border-4 border-indigo-100 shadow-md overflow-hidden shrink-0 bg-slate-100">
                <img
                  src={formData.avatarUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  style={{
                    filter: `brightness(${formData.avatarFilters?.brightness || 100}%) contrast(${formData.avatarFilters?.contrast || 100}%) saturate(${formData.avatarFilters?.saturate || 100}%) grayscale(${formData.avatarFilters?.grayscale || 0}%) blur(${formData.avatarFilters?.blur || 0}px) sepia(${formData.avatarFilters?.sepia || 0}%)`
                  }}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex-1 space-y-1.5 w-full">
                <label className="text-[10px] font-semibold text-slate-500 font-mono">Quick Enhancement Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      avatarFilters: { brightness: 105, contrast: 108, saturate: 112, grayscale: 0, blur: 0, sepia: 0 }
                    }))}
                    className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition cursor-pointer"
                  >
                    ✨ Studio Enhanced
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      avatarFilters: { brightness: 110, contrast: 120, saturate: 100, grayscale: 0, blur: 0, sepia: 0 }
                    }))}
                    className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition cursor-pointer"
                  >
                    ⚡ High Contrast
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      avatarFilters: { brightness: 100, contrast: 95, saturate: 105, grayscale: 0, blur: 0, sepia: 12 }
                    }))}
                    className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition cursor-pointer"
                  >
                    🌅 Soft Warmth
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      avatarFilters: { brightness: 102, contrast: 110, saturate: 0, grayscale: 100, blur: 0, sepia: 0 }
                    }))}
                    className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg hover:border-indigo-500 hover:text-indigo-600 transition cursor-pointer"
                  >
                    🏁 Monochrome
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      avatarFilters: { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0 }
                    }))}
                    className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg hover:bg-slate-200 transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Slider Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 pt-2 border-t border-slate-100">
              {/* Brightness slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Brightness</span>
                  <span>{formData.avatarFilters?.brightness || 100}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={formData.avatarFilters?.brightness || 100}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    avatarFilters: { ...(prev.avatarFilters || { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0 }), brightness: parseInt(e.target.value) }
                  }))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Contrast slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Contrast</span>
                  <span>{formData.avatarFilters?.contrast || 100}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={formData.avatarFilters?.contrast || 100}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    avatarFilters: { ...(prev.avatarFilters || { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0 }), contrast: parseInt(e.target.value) }
                  }))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Saturation slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Saturation</span>
                  <span>{formData.avatarFilters?.saturate || 100}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={formData.avatarFilters?.saturate || 100}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    avatarFilters: { ...(prev.avatarFilters || { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0 }), saturate: parseInt(e.target.value) }
                  }))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              {/* Blur slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Soft Focus / Blur</span>
                  <span>{formData.avatarFilters?.blur || 0}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={formData.avatarFilters?.blur || 0}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    avatarFilters: { ...(prev.avatarFilters || { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, blur: 0, sepia: 0 }), blur: parseInt(e.target.value) }
                  }))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LinkedIn Profile link */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-indigo-600" />
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* GitHub profile link */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <Github className="w-3.5 h-3.5 text-indigo-600" />
                GitHub Profile URL
              </label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-855 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                Phone Number
              </label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Instagram link */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-indigo-600" />
                Instagram URL
              </label>
              <input
                type="text"
                value={formData.instagramUrl || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, instagramUrl: e.target.value }))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Facebook link */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono flex items-center gap-1">
                <Facebook className="w-3.5 h-3.5 text-indigo-600" />
                Facebook URL
              </label>
              <input
                type="text"
                value={formData.facebookUrl || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, facebookUrl: e.target.value }))}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Manage Projects Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Manage Featured Projects ({formData.projects.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  projects: [
                    ...prev.projects,
                    {
                      id: `proj-${Date.now()}`,
                      title: "New Custom Project",
                      description: "Enter a concise description of your portfolio integration project.",
                      tags: ["React", "API Integration"],
                      link: ""
                    }
                  ]
                }))}
                className="text-[10px] font-mono bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 transition font-bold uppercase tracking-wide cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
              {formData.projects.map((proj, idx) => (
                <div key={proj.id} className="bg-white border border-slate-100 rounded-xl p-3 space-y-2 relative group shadow-sm">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      projects: prev.projects.filter(p => p.id !== proj.id)
                    }))}
                    className="absolute top-2.5 right-2.5 p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Project Title */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-400 font-bold uppercase">Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => setFormData(prev => {
                          const updated = [...prev.projects];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          return { ...prev, projects: updated };
                        })}
                        required
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 text-xs font-sans focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    {/* Project Live Link */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-400 font-bold uppercase">Live URL (Optional)</label>
                      <input
                        type="url"
                        value={proj.link || ""}
                        onChange={(e) => setFormData(prev => {
                          const updated = [...prev.projects];
                          updated[idx] = { ...updated[idx], link: e.target.value };
                          return { ...prev, projects: updated };
                        })}
                        placeholder="https://..."
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 text-[11px] font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 font-bold uppercase">Description</label>
                    <textarea
                      value={proj.description}
                      onChange={(e) => setFormData(prev => {
                        const updated = [...prev.projects];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        return { ...prev, projects: updated };
                      })}
                      required
                      rows={2}
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 text-xs font-sans focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Project Tags */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-400 font-bold uppercase">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={proj.tags.join(", ")}
                      onChange={(e) => setFormData(prev => {
                        const updated = [...prev.projects];
                        updated[idx] = { 
                          ...updated[idx], 
                          tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) 
                        };
                        return { ...prev, projects: updated };
                      })}
                      required
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 text-xs font-sans focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Project Gallery Images (Up to 5) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[9px] font-mono text-indigo-600 font-bold uppercase flex items-center justify-between">
                      <span>Gallery Images (Up to 5 Uploads)</span>
                      <span className="text-[8px] text-slate-400 normal-case">{(proj.images || []).length} / 5 Images</span>
                    </label>

                    {/* File Upload Trigger */}
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        id={`file-upload-proj-${idx}`}
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            const filesArray = Array.from(e.target.files);
                            filesArray.forEach(file => {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                if (ev.target?.result && typeof ev.target.result === "string") {
                                  setFormData(prev => {
                                    const nextProjList = [...prev.projects];
                                    const nextImgList = [...(nextProjList[idx].images || [])];
                                    if (nextImgList.length < 5) {
                                      nextImgList.push(ev.target!.result as string);
                                      nextProjList[idx] = { ...nextProjList[idx], images: nextImgList };
                                    }
                                    return { ...prev, projects: nextProjList };
                                  });
                                }
                              };
                              reader.readAsDataURL(file as Blob);
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={`file-upload-proj-${idx}`}
                        className="flex flex-col items-center justify-center border border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition text-center"
                      >
                        <Upload className="w-4.5 h-4.5 text-indigo-500 mb-1" />
                        <span className="text-[10px] font-semibold text-slate-600">Choose Images to Upload</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Drag & Drop or Select files (Max 5)</span>
                      </label>
                    </div>
                    
                    {/* Thumbnail previews */}
                    {proj.images && proj.images.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.images.map((imgUrl, imgIdx) => (
                          <div key={imgIdx} className="relative w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden group/thumb shadow-xs">
                            <img src={imgUrl} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=100&h=100&q=80'; }} />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => {
                                const updated = [...prev.projects];
                                const currentImages = [...(updated[idx].images || [])];
                                currentImages.splice(imgIdx, 1);
                                updated[idx] = { ...updated[idx], images: currentImages };
                                return { ...prev, projects: updated };
                              })}
                              className="absolute inset-0 bg-rose-600/95 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition duration-150 text-[9px] font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Add Beautiful Dev Image Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => {
                          const updated = [...prev.projects];
                          const currentImages = [...(updated[idx].images || [])];
                          if (currentImages.length < 5) {
                            const sampleImages = [
                              "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&h=400&q=80",
                              "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&h=400&q=80",
                              "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&h=400&q=80",
                              "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&h=400&q=80",
                              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400&q=80"
                            ];
                            const nextIndex = currentImages.length;
                            currentImages.push(sampleImages[nextIndex % sampleImages.length]);
                            updated[idx] = { ...updated[idx], images: currentImages };
                          }
                          return { ...prev, projects: updated };
                        })}
                        disabled={(proj.images || []).length >= 5}
                        className="text-[8px] font-mono bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-2 py-1 rounded border border-indigo-100 disabled:opacity-50 disabled:pointer-events-none transition cursor-pointer font-bold uppercase tracking-wider"
                      >
                        + Use Sample Tech Image ({(proj.images || []).length}/5)
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {formData.projects.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400 font-mono">
                  No projects added yet. Click 'Add Project' to showcase your integrations!
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-5 mt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-mono text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Save className="w-4 h-4 text-white" />
                Save Profile
              </button>
            </div>
          </div>
        </form>

        {/* Success toast indicator inside form */}
        {success && (
          <div className="bg-indigo-600 text-white text-xs font-semibold text-center py-2.5 animate-pulse font-sans">
            🎉 Profile custom details saved successfully! Updating UI modules...
          </div>
        )}
      </div>
    </div>
  );
}
