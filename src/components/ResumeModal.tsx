import React, { useRef } from "react";
import { X, Printer, Phone, Mail, MapPin, Award, User, Briefcase, GraduationCap, Globe, CheckSquare, Shield } from "lucide-react";
import { PortfolioData } from "../types";

interface ResumeModalProps {
  portfolio: PortfolioData;
  onClose: () => void;
}

export default function ResumeModal({ portfolio, onClose }: ResumeModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  // Exact resume data from the PDF
  const resumeData = {
    name: "Imran Ansari",
    summary: "Dedicated equipment maintenance professional with expertise in safety protocols and lockout/tagout procedures, ensuring operational efficiency and workplace safety.",
    contact: {
      address: "Amaura Ghazipur, India 232333",
      phone: "7237873558",
      email: "Imranansari399605@gmail.com"
    },
    experience: {
      role: "Assistant",
      company: "Active Engineers",
      subInfo: "Date Entry, Maintenance and Repair (Railway staff appointed)",
      period: "Jun 2025 - Present",
      points: [
        "Track relaying train operation and maintenance work has been and assist to supervisor and technicians on working jobs on maintenance work handling tools, equipment and machinery items inspection and all checking work.",
        "Maintenance ledger history store handle attendance log book etc.",
        "Work on computer on daily basis."
      ]
    },
    education: [
      {
        degree: "Graduate (B.Com | Commerce)",
        school: "Veer Bahadur Sing Purvanchal University",
        year: "2024"
      },
      {
        degree: "Intermediate (12th | UP Board)",
        school: "S.K.B.M. Inter College",
        year: "2021"
      },
      {
        degree: "High School (10th | UP Board)",
        school: "S.K.B.M. Inter College",
        year: "2019"
      }
    ],
    otherCourses: [
      "E-Learning course of 30-Days Excel Crash Course"
    ],
    skills: [
      "HTML, CSS, JavaScript",
      "React & Node.js Web Development",
      "Python Programming (Learning)",
      "MS Excel & Advanced Analytics",
      "MS Word & Document Automation",
      "Computer Literacy & Operations"
    ],
    languages: ["Hindi", "English"],
    personalDetails: {
      dob: "07.09.2005",
      fatherName: "Md Ahsan Ansari",
      motherName: "Hadishun Nesha",
      aadharNo: "7*9*5*******",
      panNo: "D*B*A*6***A",
      gender: "Male",
      nationality: "Indian",
      maritalStatus: "Unmarried"
    },
    declaration: "I hereby declared that the above information given by me is true to best of my Knowledge.",
    place: "Ghazipur, UP"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      {/* Screen view card */}
      <div className="bg-white dark:bg-[#0c0d21] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 border border-slate-200 dark:border-[#1e204c] max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-[#1e204c] flex items-center justify-between bg-slate-50 dark:bg-[#11122a] shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider font-mono">Professional Resume Suite</h2>
              <p className="text-[10px] text-slate-500 dark:text-indigo-300">Ready for corporate application pipelines</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold uppercase tracking-wide px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Download / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-150 dark:hover:bg-[#18193d] rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-indigo-300 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 bg-slate-100 dark:bg-[#070817] flex-1">
          <p className="text-xs text-slate-500 dark:text-indigo-300 text-center font-mono max-w-lg mx-auto">
            Below is a beautiful visual rendering of your official resume. Use the <strong>Download / Save PDF</strong> button above to save it as a high-quality PDF.
          </p>

          {/* Interactive Screen Preview */}
          <div className="bg-white text-slate-800 w-full rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[1050px]">
            
            {/* LEFT COLUMN: Deep Corporate Blue Accent */}
            <div className="md:col-span-4 bg-[#2b3a51] text-white p-6 sm:p-8 flex flex-col justify-between space-y-8">
              <div className="space-y-8">
                {/* Profile Circle with Photo Placeholder */}
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden bg-[#1b2737] flex items-center justify-center relative shadow-lg">
                    <img
                      src={portfolio.avatarUrl}
                      alt={portfolio.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-base tracking-wide uppercase">{resumeData.name}</h3>
                    <span className="text-[10px] text-slate-300 font-mono tracking-wider uppercase font-medium">Mechanical Maintenance</span>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-300">Contact</h4>
                  <div className="space-y-3 text-[11px] leading-relaxed font-sans text-slate-250">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
                      <span>{resumeData.contact.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-indigo-300 shrink-0" />
                      <span>{resumeData.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-indigo-300 shrink-0" />
                      <span className="break-all">{resumeData.contact.email}</span>
                    </div>
                  </div>
                </div>

                {/* Summary Section (Mobile/Sidebar only) */}
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-300">Summary</h4>
                  <p className="text-[11px] leading-relaxed text-slate-200 font-sans">
                    {resumeData.summary}
                  </p>
                </div>

                {/* Skills Section */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-300">Skills</h4>
                  <ul className="space-y-2.5">
                    {resumeData.skills.map((skill, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-200 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shrink-0"></span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Languages */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-300">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.languages.map((lang, idx) => (
                    <span key={idx} className="bg-white/10 px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider font-mono">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Modern White Styled Experience & Academic Info */}
            <div className="md:col-span-8 p-8 sm:p-10 flex flex-col justify-between space-y-8 bg-white">
              
              <div className="space-y-8">
                {/* Title block */}
                <div className="border-b border-slate-200 pb-5 text-center">
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 mb-1">RESUME</p>
                  <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight font-display">{resumeData.name}</h1>
                </div>

                {/* Experience section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Briefcase className="w-5 h-5 text-[#2b3a51]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">Experience</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm font-sans">{resumeData.experience.role} at {resumeData.experience.company}</h4>
                        <p className="text-xs text-slate-500 font-medium italic mt-0.5">{resumeData.experience.subInfo}</p>
                      </div>
                      <span className="bg-[#2b3a51]/5 text-[#2b3a51] px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono tracking-wider shrink-0 self-start">
                        {resumeData.experience.period}
                      </span>
                    </div>
                    <ul className="space-y-2 pt-2.5">
                      {resumeData.experience.points.map((pt, idx) => (
                        <li key={idx} className="text-xs leading-relaxed text-slate-650 flex items-start gap-2 font-sans">
                          <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Education section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <GraduationCap className="w-5 h-5 text-[#2b3a51]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">Education</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {resumeData.education.map((edu, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{edu.degree}</h4>
                          <p className="text-xs text-slate-500">{edu.school}</p>
                        </div>
                        <span className="text-xs font-bold font-mono text-indigo-600 tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                          {edu.year}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide font-mono">Additional Certifications</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-sans">
                      {resumeData.otherCourses.map((course, idx) => (
                        <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Projects section */}
                {portfolio.projects && portfolio.projects.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Briefcase className="w-5 h-5 text-[#2b3a51]" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">Key Projects</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {portfolio.projects.map((proj, idx) => (
                        <div key={proj.id || idx} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                            <h4 className="font-bold text-slate-950 text-xs sm:text-sm font-sans flex items-center gap-2">
                              {proj.title}
                            </h4>
                            {proj.link && (
                              <a 
                                href={proj.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 font-mono"
                              >
                                Live Link →
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-slate-650 leading-relaxed font-sans">{proj.description}</p>
                          {proj.tags && proj.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {proj.tags.map((tag, tIdx) => (
                                <span key={tIdx} className="text-[9px] font-mono font-semibold bg-indigo-50/80 text-indigo-700 px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal Details section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User className="w-5 h-5 text-[#2b3a51]" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 font-mono">Personal Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-700 font-sans bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                      <span className="text-slate-400 font-medium">DOB:</span>
                      <span className="font-semibold text-slate-800">{resumeData.personalDetails.dob}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                      <span className="text-slate-400 font-medium">Father's Name:</span>
                      <span className="font-semibold text-slate-800">{resumeData.personalDetails.fatherName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                      <span className="text-slate-400 font-medium">Mother's Name:</span>
                      <span className="font-semibold text-slate-800">{resumeData.personalDetails.motherName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100/50 pb-1.5">
                      <span className="text-slate-400 font-medium">Nationality:</span>
                      <span className="font-semibold text-slate-800">{resumeData.personalDetails.nationality}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100/50 pb-1.5 sm:border-0 sm:pb-0">
                      <span className="text-slate-400 font-medium">Gender:</span>
                      <span className="font-semibold text-slate-800">{resumeData.personalDetails.gender}</span>
                    </div>
                    <div className="flex justify-between sm:border-0 pb-1.5 sm:pb-0">
                      <span className="text-slate-400 font-medium">Marital Status:</span>
                      <span className="font-semibold text-slate-800">{resumeData.personalDetails.maritalStatus}</span>
                    </div>
                    <div className="flex justify-between col-span-1 sm:col-span-2 border-t border-slate-100 pt-2">
                      <div className="flex justify-between w-full sm:w-1/2 pr-0 sm:pr-3">
                        <span className="text-slate-400 font-medium">Aadhar No:</span>
                        <span className="font-mono font-semibold text-slate-800">{resumeData.personalDetails.aadharNo}</span>
                      </div>
                      <div className="flex justify-between w-full sm:w-1/2 pl-0 sm:pl-3 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0">
                        <span className="text-slate-400 font-medium">PAN No:</span>
                        <span className="font-mono font-semibold text-slate-800">{resumeData.personalDetails.panNo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Declaration section */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Declaration</h4>
                  <p className="text-[11px] leading-relaxed text-slate-500 italic">
                    "{resumeData.declaration}"
                  </p>
                </div>
              </div>

              {/* Signature Row */}
              <div className="flex justify-between items-end border-t border-slate-100 pt-6 text-[10px] font-mono text-slate-400">
                <div className="space-y-1">
                  <p>Place: {resumeData.place}</p>
                </div>
                <div className="text-right space-y-2">
                  <div className="font-sans font-bold text-slate-800 tracking-wide text-xs italic uppercase border-b border-slate-300 pb-1 px-4">
                    {resumeData.name}
                  </div>
                  <p className="mr-4">Signature</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* FULL-PAGE PRINT-ONLY DUAL COLUMN RESUME (Pixel-perfect rendered during window.print()) */}
      <div 
        ref={printRef}
        className="hidden print:block print-target fixed inset-0 bg-white text-slate-900 z-[999999] overflow-y-auto p-0 font-sans"
        style={{ width: "210mm", minHeight: "297mm" }} // Standard A4 limits
      >
        <div className="grid grid-cols-12 min-h-screen">
          {/* Print Sidebar (Col 4) */}
          <div className="col-span-4 bg-[#1b2737] text-white p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-24 h-24 rounded-full border-2 border-white/20 overflow-hidden bg-[#0e1722]">
                  <img
                    src={portfolio.avatarUrl}
                    alt={portfolio.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide uppercase">{resumeData.name}</h3>
                  <p className="text-[9px] text-slate-300 font-mono uppercase tracking-wider">Mechanical Maintenance</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-300">Contact</h4>
                <div className="space-y-2 text-[10px] text-slate-200">
                  <p className="leading-relaxed"><strong>Addr:</strong> {resumeData.contact.address}</p>
                  <p><strong>Phone:</strong> {resumeData.contact.phone}</p>
                  <p className="break-all"><strong>Email:</strong> {resumeData.contact.email}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-300">Summary</h4>
                <p className="text-[10px] leading-relaxed text-slate-200">
                  {resumeData.summary}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-300">Skills</h4>
                <ul className="space-y-1.5 text-[10px] text-slate-200">
                  {resumeData.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-indigo-300 shrink-0"></span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <h4 className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-300">Languages</h4>
              <p className="text-[10px] text-slate-200 font-semibold">{resumeData.languages.join(", ")}</p>
            </div>
          </div>

          {/* Print Main Body (Col 8) */}
          <div className="col-span-8 p-8 flex flex-col justify-between space-y-6 bg-white">
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3 text-center">
                <p className="text-[9px] font-mono font-bold text-indigo-600 uppercase tracking-widest mb-1">Curriculum Vitae / Resume</p>
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">{resumeData.name}</h1>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono border-b border-slate-100 pb-1">Experience</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start text-[10px]">
                    <div>
                      <strong className="text-slate-900">{resumeData.experience.role} at {resumeData.experience.company}</strong>
                      <p className="text-slate-500 italic">{resumeData.experience.subInfo}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-600">{resumeData.experience.period}</span>
                  </div>
                  <ul className="space-y-1 text-[10px] text-slate-700">
                    {resumeData.experience.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-slate-400 shrink-0 mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono border-b border-slate-100 pb-1">Education</h3>
                <div className="space-y-2">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start text-[10px]">
                      <div>
                        <strong className="text-slate-900">{edu.degree}</strong>
                        <p className="text-slate-500">{edu.school}</p>
                      </div>
                      <span className="font-mono font-bold text-slate-600">{edu.year}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <h4 className="text-[9px] font-bold text-slate-600 uppercase tracking-wide font-mono">Other Certifications</h4>
                  <p className="text-[10px] text-slate-700 leading-relaxed font-medium">
                    {resumeData.otherCourses.join(" | ")}
                  </p>
                </div>
              </div>

              {portfolio.projects && portfolio.projects.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono border-b border-slate-100 pb-1">Key Projects</h3>
                  <div className="space-y-2">
                    {portfolio.projects.slice(0, 3).map((proj, idx) => (
                      <div key={proj.id || idx} className="text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100/50">
                        <div className="flex justify-between items-center font-bold text-slate-900">
                          <span>{proj.title}</span>
                          {proj.link && <span className="text-[8px] text-indigo-600 font-mono italic">{proj.link.replace("https://", "").replace("www.", "").substring(0, 40)}</span>}
                        </div>
                        <p className="text-slate-650 leading-tight mt-0.5">{proj.description}</p>
                        {proj.tags && proj.tags.length > 0 && (
                          <p className="text-slate-400 text-[8px] font-mono mt-0.5">Tags: {proj.tags.join(", ")}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono border-b border-slate-100 pb-1">Personal Details</h3>
                <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-[10px] text-slate-700">
                  <p><strong>DOB:</strong> {resumeData.personalDetails.dob}</p>
                  <p><strong>Father's Name:</strong> {resumeData.personalDetails.fatherName}</p>
                  <p><strong>Mother's Name:</strong> {resumeData.personalDetails.motherName}</p>
                  <p><strong>Nationality:</strong> {resumeData.personalDetails.nationality}</p>
                  <p><strong>Gender:</strong> {resumeData.personalDetails.gender}</p>
                  <p><strong>Marital Status:</strong> {resumeData.personalDetails.maritalStatus}</p>
                  <p><strong>Aadhar No:</strong> {resumeData.personalDetails.aadharNo}</p>
                  <p><strong>PAN No:</strong> {resumeData.personalDetails.panNo}</p>
                </div>
              </div>

              <div className="space-y-1">
                <strong className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">Declaration</strong>
                <p className="text-[9px] text-slate-500 italic leading-relaxed">
                  "{resumeData.declaration}"
                </p>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-slate-100 pt-4 text-[9px] font-mono text-slate-400">
              <div className="space-y-0.5">
                <p>Place: {resumeData.place}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-800 italic uppercase underline mb-1">{resumeData.name}</p>
                <p className="mr-2">Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
