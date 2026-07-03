import React, { useState, useEffect } from "react";
import { ExternalLink, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Project } from "../types";

interface ProjectCardProps {
  proj: Project;
  email: string;
  key?: any;
}

export default function ProjectCard({ proj, email }: ProjectCardProps) {
  const images = proj.images || [];
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Auto-rotating status player effect (8 seconds per status image)
  useEffect(() => {
    if (images.length <= 1) {
      setProgress(0);
      return;
    }
    
    setProgress(0);
    const totalTimeMs = 8000;
    const intervalTimeMs = 100;
    const step = (100 * intervalTimeMs) / totalTimeMs; // adds 1.25% every 100ms
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveImgIdx((currentIdx) => (currentIdx + 1) % images.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTimeMs);

    return () => clearInterval(interval);
  }, [activeImgIdx, images.length]);

  const mainImage = images.length > 0 
    ? images[activeImgIdx] 
    : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&h=400&q=80"; // fallback

  return (
    <div
      className="bg-white dark:bg-[#11122a] border border-slate-200 dark:border-[#1e204c] hover:border-indigo-300 dark:hover:border-indigo-500 rounded-3xl p-5 flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-xl group"
    >
      <div className="space-y-4">
        {/* Project Gallery Viewer */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-100 dark:border-[#1e204c] group-hover:shadow-md transition duration-300">
          
          {/* Status-style progress bars */}
          {images.length > 1 && (
            <div className="absolute top-2.5 inset-x-3.5 flex gap-1 z-20">
              {images.map((_, idx) => {
                let widthVal = "0%";
                if (idx < activeImgIdx) {
                  widthVal = "100%";
                } else if (idx === activeImgIdx) {
                  widthVal = `${progress}%`;
                }
                return (
                  <div key={idx} className="h-1 flex-1 bg-black/45 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-100 ease-linear"
                      style={{ width: widthVal }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <img 
            src={mainImage} 
            alt={proj.title}
            onClick={() => {
              window.open(mainImage, "_blank");
            }}
            title="Click to view image in a new tab"
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102 cursor-pointer"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&h=400&q=80";
            }}
          />
          
          {/* Subtle image count badge */}
          {images.length > 0 && (
            <span className="absolute bottom-3 right-3 bg-slate-950/70 backdrop-blur-md text-[9px] font-mono font-bold text-white px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-widest z-10">
              {activeImgIdx + 1} / {images.length}
            </span>
          )}

          {/* Icon overlay if no custom images */}
          {images.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/45 text-indigo-200 p-4 text-center">
              <ImageIcon className="w-8 h-8 text-indigo-400 mb-1.5 opacity-80" />
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-300">Enterprise Blueprint Mode</span>
            </div>
          )}
        </div>

        {/* Thumbnail Selector Dots/Bar if multiple images exist */}
        {images.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar justify-start">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImgIdx(idx)}
                className={`relative w-12 h-8 rounded-md overflow-hidden border transition shrink-0 cursor-pointer ${
                  idx === activeImgIdx 
                    ? "border-indigo-600 dark:border-indigo-400 ring-2 ring-indigo-500/20" 
                    : "border-slate-200 dark:border-[#202256] hover:border-slate-400"
                }`}
              >
                <img 
                  src={img} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&h=400&q=80";
                  }}
                />
              </button>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {proj.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="text-[9px] font-mono bg-indigo-50 dark:bg-[#15163c] text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-100 dark:border-[#22245c] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          <h4 className="font-display font-black text-slate-900 dark:text-white text-base tracking-tight leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {proj.title}
          </h4>
          
          <p className="text-xs text-slate-500 dark:text-indigo-200 leading-relaxed font-sans line-clamp-3">
            {proj.description}
          </p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-[#1e204c]">
        {proj.link ? (
          <a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 flex items-center gap-1 transition"
          >
            Visit Live App
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-[10px] font-mono text-slate-400 dark:text-indigo-500 font-medium">Enterprise System</span>
        )}
        
        <a
          href={`mailto:${email}?subject=Inquiry about ${proj.title}`}
          className="text-[11px] font-mono font-medium text-slate-600 dark:text-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition"
        >
          Inquire
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
