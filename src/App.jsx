import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Medal, Settings, UserPlus, Trash2, Edit2, 
  RefreshCcw, Moon, Sun, MonitorPlay, PartyPopper, 
  FileSpreadsheet, X, Minus, Plus, Printer
} from 'lucide-react';

// คอมโพเนนต์กราฟิกเด็กนักเรียน
const StudentMascot = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      <path d="M25 55 C 15 45, 10 25, 20 15" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
      <path d="M75 55 C 85 45, 90 25, 80 15" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
      <circle cx="20" cy="15" r="5" fill="#FDBA74" />
      <circle cx="80" cy="15" r="5" fill="#FDBA74" />
      <path d="M30 45 Q 50 35 70 45 L 75 80 Q 50 90 25 80 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
      <path d="M38 43 L 50 55 L 62 43" stroke="#CBD5E1" strokeWidth="2" fill="#F1F5F9" strokeLinejoin="round" />
      <path d="M47 55 L 53 55 L 55 75 L 50 82 L 45 75 Z" fill="#1D4ED8" />
      <circle cx="50" cy="28" r="21" fill="#FDBA74" />
      <path d="M26 28 C 26 -5, 74 -5, 74 28 C 74 15, 26 15, 26 28 Z" fill="#1E293B" />
      <path d="M26 25 Q 30 15 40 12" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      <path d="M39 25 Q 42.5 20 46 25" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M54 25 Q 57.5 20 61 25" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M42 32 Q 50 44 58 32" fill="#EF4444" />
      <path d="M45 32 Q 50 38 55 32" fill="#FCA5A5" />
      <circle cx="36" cy="32" r="4.5" fill="#F87171" opacity="0.6" />
      <circle cx="64" cy="32" r="4.5" fill="#F87171" opacity="0.6" />
    </g>
  </svg>
);

const App = () => {
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('bmpn_teams');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'โรงเรียนเดชะปัตตนยานุกูล', score: 0 },
      { id: '2', name: 'สายบุรีแจ้งประชาคาร', score: 0 },
      { id: '3', name: 'นักปราชญ์ล้านนา', score: 0 },
      { id: '4', name: 'อยุธยารุ่งเรือง', score: 0 },
      { id: '5', name: 'คณะกรรมการนักเรียน', score: 0 },
      { id: '6', name: 'ยุคทองของไทย', score: 0 },
      { id: '7', name: 'ตำนานบรรพชน', score: 0 },
      { id: '8', name: 'จารึกสุโขทัย', score: 0 },
      { id: '9', name: 'วีรกรรมกู้ชาติ', score: 0 },
      { id: '10', name: 'ศิลปวัฒนธรรม', score: 0 }
    ];
  });

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('bmpn_theme') === 'dark');
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [customPoint, setCustomPoint] = useState(1);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editName, setEditName] = useState('');
  
  const [currentQuestion, setCurrentQuestion] = useState(() => {
    const saved = localStorage.getItem('bmpn_curr_q');
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [scoreLogs, setScoreLogs] = useState(() => {
    const saved = localStorage.getItem('bmpn_score_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCelebrating, setIsCelebrating] = useState(() => localStorage.getItem('bmpn_celebrate') === 'true');
  const [animatingTeams, setAnimatingTeams] = useState(new Set());
  const prevTeamsRef = useRef(teams);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  useEffect(() => {
    let interval;
    if (isCelebrating) {
      localStorage.setItem('bmpn_celebrate', 'true');
      const randomInRange = (min, max) => Math.random() * (max - min) + min;
      interval = setInterval(() => {
        if (window.confetti) {
          window.confetti({
            startVelocity: 30, spread: 360, ticks: 60, zIndex: 100,
            particleCount: Math.floor(randomInRange(50, 100)),
            colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
            origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
          });
        }
      }, 400);
    } else {
      localStorage.setItem('bmpn_celebrate', 'false');
      if (window.confetti) window.confetti.reset();
    }
    return () => clearInterval(interval);
  }, [isCelebrating]);

  useEffect(() => {
    localStorage.setItem('bmpn_teams', JSON.stringify(teams));
    localStorage.setItem('bmpn_score_logs', JSON.stringify(scoreLogs));
    localStorage.setItem('bmpn_curr_q', currentQuestion.toString());
  }, [teams, scoreLogs, currentQuestion]);

  useEffect(() => {
    const syncAcrossWindows = (e) => {
      if (e.key === 'bmpn_teams' && e.newValue) setTeams(JSON.parse(e.newValue));
      if (e.key === 'bmpn_theme') setDarkMode(e.newValue === 'dark');
      if (e.key === 'bmpn_celebrate') setIsCelebrating(e.newValue === 'true');
      if (e.key === 'bmpn_score_logs' && e.newValue) setScoreLogs(JSON.parse(e.newValue));
      if (e.key === 'bmpn_curr_q' && e.newValue) setCurrentQuestion(parseInt(e.newValue, 10));
    };
    window.addEventListener('storage', syncAcrossWindows);
    return () => window.removeEventListener('storage', syncAcrossWindows);
  }, []);

  useEffect(() => {
    const prevTeams = prevTeamsRef.current;
    const sortedNow = [...teams].sort((a, b) => b.score - a.score);
    const top3Ids = sortedNow.slice(0, 3).map(t => t.id);

    const scoredTeams = teams.filter(newTeam => {
      const oldTeam = prevTeams.find(t => t.id === newTeam.id);
      return oldTeam && newTeam.score > oldTeam.score && top3Ids.includes(newTeam.id);
    });

    if (scoredTeams.length > 0) {
      setAnimatingTeams(prev => {
        const next = new Set(prev);
        scoredTeams.forEach(t => next.add(t.id));
        return next;
      });
      setTimeout(() => {
        setAnimatingTeams(prev => {
          const next = new Set(prev);
          scoredTeams.forEach(t => next.delete(t.id));
          return next;
        });
      }, 2500); // ระยะเวลาแอนิเมชันกระโดด
    }
    prevTeamsRef.current = teams;
  }, [teams]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bmpn_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bmpn_theme', 'light');
    }
  }, [darkMode]);

  const sortedTeams = [...teams].sort((a, b) => {
    if (b.score === a.score) return a.name.localeCompare(b.name, 'th');
    return b.score - a.score;
  });

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setTeams([...teams, { id: Date.now().toString(), name: newTeamName.trim(), score: 0 }]);
    setNewTeamName('');
  };

  const handleDeleteTeam = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบทีมนี้? (ประวัติคะแนนในข้อที่ผ่านมาจะยังคงอยู่)')) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const startEditing = (team) => {
    setEditingTeam(team.id);
    setEditName(team.name);
  };

  const saveEditing = () => {
    if (!editName.trim()) { setEditingTeam(null); return; }
    setTeams(teams.map(t => t.id === editingTeam ? { ...t, name: editName.trim() } : t));
    setEditingTeam(null);
  };

  const updateScore = (id, amount) => {
    let actualAmount = 0;
    const newTeams = teams.map(t => {
      if (t.id === id) {
        const newScore = Math.max(0, t.score + amount);
        actualAmount = newScore - t.score;
        return { ...t, score: newScore };
      }
      return t;
    });

    setTeams(newTeams);

    if (actualAmount !== 0) {
      setScoreLogs(prev => [...prev, {
        id: Date.now().toString(),
        teamId: id,
        amount: actualAmount,
        question: currentQuestion,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const confirmReset = () => {
    setTeams(teams.map(t => ({ ...t, score: 0 })));
    setScoreLogs([]);
    setCurrentQuestion(1);
    setIsCelebrating(false);
    setShowResetModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const getRankedTeamsData = () => {
    const teamsWithRank = sortedTeams.map((team, index, arr) => {
      if (team.score === 0) return { ...team, displayRank: '-' };
      const actualRank = arr.findIndex(t => t.score === team.score) + 1;
      return { ...team, displayRank: actualRank };
    });

    const rankedTeams = teamsWithRank.filter(t => t.score > 0);
    const unrankedTeams = teamsWithRank.filter(t => t.score === 0);

    return {
      rank1: rankedTeams[0],
      rank2: rankedTeams[1],
      rank3: rankedTeams[2],
      bottomTeams: [...rankedTeams.slice(3), ...unrankedTeams]
    };
  };

  const customStyles = `
    .glass-panel { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }
    .dark .glass-panel { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    /* แอนิเมชันกระโดดเด้งจากด้านหลัง (Jump Behind) */
    @keyframes jumpUp {
      0% { transform: translate(-50%, 50%); opacity: 0; }
      15% { transform: translate(-50%, -100%) scale(1.1); opacity: 1; }
      30% { transform: translate(-50%, -60%) scale(1); opacity: 1; }
      45% { transform: translate(-50%, -80%) scale(1.05); opacity: 1; }
      65% { transform: translate(-50%, -60%) scale(1); opacity: 1; }
      85% { transform: translate(-50%, -60%); opacity: 1; }
      100% { transform: translate(-50%, 50%); opacity: 0; }
    }
    
    .student-jump { 
      position: absolute; 
      left: 50%; 
      top: 0; 
      transform: translate(-50%, 50%); 
      z-index: 0; /* ซ่อนไว้หลังป้ายคะแนน */
      opacity: 0; 
      pointer-events: none; 
    }
    
    .is-animating .student-jump { 
      animation: jumpUp 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
    }

    /* --- รูปแบบสำหรับการพิมพ์ (Print) --- */
    @media print {
      @page {
        size: A4 landscape;
        margin: 15mm;
      }
      body * { visibility: hidden; }
      #print-area, #print-area * { visibility: visible; }
      #print-area { position: absolute; left: 0; top: 0; width: 100%; color: black !important; background: white !important; }
      .print-hide { display: none !important; }
      table { width: 100% !important; border-collapse: collapse !important; }
      thead { display: table-header-group !important; }
      tfoot { display: table-footer-group !important; }
      tr { page-break-inside: avoid !important; }
      th, td { border: 1px solid #000 !important; color: #000 !important; padding: 6px !important; }
      .print-text-emerald { color: #059669 !important; font-weight: bold; }
      .print-text-red { color: #DC2626 !important; font-weight: bold; }
      .print-text-black { color: #000 !important; }
    }
  `;

  // คอมโพเนนต์สำหรับแท่นรางวัล รองรับทั้งจอ TV และจอ Preview
  const PodiumView = ({ rank1, rank2, rank3, isPreview = false }) => (
    <div className={`flex flex-row justify-center items-end gap-2 sm:gap-4 lg:gap-8 px-2 w-full max-w-6xl mx-auto ${
      isPreview ? 'mt-4 mb-2' : 'mt-16 lg:mt-24 2xl:mt-32 mb-8 lg:mb-12' 
    }`}>
      
      {/* แท่นอันดับ 2 */}
      {rank2 ? (
        <div className={`flex flex-col items-center w-[30%] ${isPreview ? 'max-w-[120px]' : 'max-w-[300px]'} animate-fade-in-up relative ${animatingTeams.has(rank2.id) ? 'is-animating' : ''}`} style={{ animationDelay: '0.1s' }}>
          
          <div className="student-jump">
            <StudentMascot className={isPreview ? "w-12 h-12 drop-shadow-lg" : "w-24 h-24 lg:w-32 lg:h-32 2xl:w-40 2xl:h-40 drop-shadow-xl"} />
          </div>

          <div className={`flex flex-col items-center justify-center mb-2 bg-gradient-to-r from-slate-200 to-gray-100 dark:from-slate-700 dark:to-gray-800 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-500 w-full relative z-10 text-center transition-transform hover:-translate-y-1 scale-[1.01] ${
            isPreview ? 'p-2 min-h-[60px]' : 'p-3 lg:p-5 min-h-[100px] lg:min-h-[140px]'
          }`}>
            <Medal className={`${isPreview ? 'w-4 h-4 mb-0.5' : 'w-8 h-8 lg:w-12 lg:h-12 mb-1 lg:mb-2'} text-slate-500 dark:text-slate-300 drop-shadow-md flex-shrink-0`} />
            <span className={`font-bold break-words line-clamp-2 w-full text-slate-800 dark:text-white leading-snug ${isPreview ? 'text-[9px]' : 'text-xs lg:text-lg 2xl:text-xl'}`}>{rank2.name}</span>
            <div className="flex items-baseline gap-1 mt-1 justify-center w-full">
              <span className={`font-black text-slate-700 dark:text-slate-200 tracking-tighter ${isPreview ? 'text-xs' : 'text-2xl lg:text-4xl 2xl:text-5xl'}`}>{rank2.score.toLocaleString()}</span>
              <span className={`font-bold text-slate-400 dark:text-slate-500 ${isPreview ? 'text-[7px]' : 'text-[10px] lg:text-sm'}`}>คะแนน</span>
            </div>
          </div>
          <div className={`w-full bg-gradient-to-t from-slate-300 to-slate-100 dark:from-slate-700 dark:to-slate-500 rounded-t-xl shadow-inner flex justify-center pt-2 border-t-4 border-slate-400 relative z-10 ${
            isPreview ? 'h-12' : 'h-24 sm:h-32 lg:h-44 2xl:h-52 pt-4 lg:pt-6'
          }`}>
            <span className={`font-black text-slate-400/50 dark:text-slate-900/30 ${isPreview ? 'text-2xl' : 'text-5xl lg:text-7xl 2xl:text-8xl'}`}>2</span>
          </div>
        </div>
      ) : <div className={`w-[30%] ${isPreview ? 'max-w-[120px]' : 'max-w-[300px]'}`}></div>}

      {/* แท่นอันดับ 1 */}
      <div className={`flex flex-col items-center w-[38%] ${isPreview ? 'max-w-[150px]' : 'max-w-[400px]'} animate-fade-in-up relative ${animatingTeams.has(rank1.id) ? 'is-animating' : ''}`}>
          
          <div className="student-jump">
            <StudentMascot className={isPreview ? "w-16 h-16 drop-shadow-xl" : "w-32 h-32 lg:w-40 lg:h-40 2xl:w-48 2xl:h-48 drop-shadow-2xl"} />
          </div>

          <div className={`flex flex-col items-center justify-center mb-2 bg-gradient-to-br from-yellow-100 to-amber-50 dark:from-yellow-900/60 dark:to-amber-900/30 rounded-2xl shadow-2xl border-2 border-yellow-400 dark:border-yellow-500 w-full relative z-10 text-center transition-transform hover:-translate-y-2 scale-105 ${
            isPreview ? 'p-2 min-h-[70px]' : 'p-4 lg:p-6 min-h-[120px] lg:min-h-[160px]'
          }`}>
            <Trophy className={`${isPreview ? 'w-5 h-5 mb-0.5' : 'w-10 h-10 lg:w-16 lg:h-16 mb-1 lg:mb-2'} text-yellow-500 drop-shadow-lg flex-shrink-0`} />
            <span className={`font-extrabold break-words line-clamp-2 w-full text-slate-800 dark:text-white leading-snug ${isPreview ? 'text-[10px]' : 'text-sm lg:text-xl 2xl:text-2xl'}`}>{rank1.name}</span>
            <div className="flex items-baseline gap-1 mt-1 justify-center w-full">
              <span className={`font-black text-yellow-600 dark:text-yellow-400 tracking-tighter ${isPreview ? 'text-sm' : 'text-3xl lg:text-5xl 2xl:text-6xl'}`}>{rank1.score.toLocaleString()}</span>
              <span className={`font-bold text-yellow-700/60 dark:text-yellow-500/80 ${isPreview ? 'text-[8px]' : 'text-xs lg:text-sm'}`}>คะแนน</span>
            </div>
          </div>
          <div className={`w-full bg-gradient-to-t from-yellow-500 to-yellow-300 dark:from-yellow-700 dark:to-yellow-500 rounded-t-xl shadow-[0_-10px_40px_rgba(234,179,8,0.3)] flex justify-center pt-2 border-t-4 border-yellow-200 relative z-10 ${
            isPreview ? 'h-16' : 'h-32 sm:h-48 lg:h-60 2xl:h-72 pt-6 lg:pt-8'
          }`}>
            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-t-xl pointer-events-none"></div>
            <span className={`font-black text-yellow-700/40 dark:text-yellow-900/40 relative z-10 ${isPreview ? 'text-3xl' : 'text-6xl lg:text-8xl 2xl:text-9xl'}`}>1</span>
          </div>
      </div>

      {/* แท่นอันดับ 3 */}
      {rank3 ? (
        <div className={`flex flex-col items-center w-[30%] ${isPreview ? 'max-w-[120px]' : 'max-w-[300px]'} animate-fade-in-up relative ${animatingTeams.has(rank3.id) ? 'is-animating' : ''}`} style={{ animationDelay: '0.2s' }}>
          
          <div className="student-jump">
            <StudentMascot className={isPreview ? "w-12 h-12 drop-shadow-lg" : "w-24 h-24 lg:w-32 lg:h-32 2xl:w-40 2xl:h-40 drop-shadow-xl"} />
          </div>

          <div className={`flex flex-col items-center justify-center mb-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-amber-300 dark:border-amber-900/50 w-full relative z-10 text-center transition-transform hover:-translate-y-1 ${
            isPreview ? 'p-2 min-h-[60px]' : 'p-3 lg:p-5 min-h-[100px] lg:min-h-[140px]'
          }`}>
            <Medal className={`${isPreview ? 'w-4 h-4 mb-0.5' : 'w-8 h-8 lg:w-12 lg:h-12 mb-1 lg:mb-2'} text-amber-600 drop-shadow-sm flex-shrink-0`} />
            <span className={`font-bold break-words line-clamp-2 w-full text-slate-700 dark:text-slate-200 leading-snug ${isPreview ? 'text-[9px]' : 'text-xs lg:text-lg 2xl:text-xl'}`}>{rank3.name}</span>
            <div className="flex items-baseline gap-1 mt-1 justify-center w-full">
              <span className={`font-black text-amber-600 dark:text-amber-500 tracking-tighter ${isPreview ? 'text-xs' : 'text-2xl lg:text-4xl 2xl:text-5xl'}`}>{rank3.score.toLocaleString()}</span>
              <span className={`font-bold text-amber-700/50 dark:text-amber-500/80 ${isPreview ? 'text-[7px]' : 'text-[10px] lg:text-sm'}`}>คะแนน</span>
            </div>
          </div>
          <div className={`w-full bg-gradient-to-t from-orange-300 to-amber-200 dark:from-amber-800 dark:to-orange-700 rounded-t-xl shadow-inner flex justify-center pt-2 border-t-4 border-amber-400 relative z-10 ${
            isPreview ? 'h-8' : 'h-16 sm:h-24 lg:h-32 2xl:h-40 pt-2 lg:pt-4'
          }`}>
            <span className={`font-black text-amber-700/30 dark:text-amber-900/30 ${isPreview ? 'text-xl' : 'text-4xl lg:text-6xl 2xl:text-7xl'}`}>3</span>
          </div>
        </div>
      ) : <div className={`w-[30%] ${isPreview ? 'max-w-[120px]' : 'max-w-[300px]'}`}></div>}

    </div>
  );

  return (
    <div className={`min-h-[calc(100vh)] flex flex-col transition-colors duration-300 font-sans ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      <style>{customStyles}</style>

      {/* --- Top Navigation --- */}
      <nav className="glass-panel sticky top-0 z-40 px-4 py-3 flex justify-between items-center shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <Trophy className="text-yellow-500 w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
          <h1 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 leading-tight">
            <span className="block text-sm sm:text-base md:text-xl">กิจกรรมตอบปัญหาประวัติศาสตร์</span>
            <span className="block text-xs sm:text-sm md:text-lg mt-0.5">จุลมงกุฎคุณานุสรณ์ ครั้งที่ 4 ประจำปีการศึกษา 2569</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 print-hide">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="สลับโหมดหน้าจอ"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>
          
          <button
            onClick={() => setIsAdmin(!isAdmin)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
              isAdmin 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            {isAdmin ? <><MonitorPlay className="w-4 h-4" /> <span className="hidden sm:inline">โหมดรับชม (Live)</span></> : <><Settings className="w-4 h-4" /> <span className="hidden sm:inline">จัดการแอดมิน</span></>}
          </button>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main className={`flex-1 flex flex-col justify-center container mx-auto px-4 py-4 overflow-hidden ${isAdmin ? 'max-w-7xl' : 'max-w-[1800px] w-full'}`}>
        
        {}
        {/* =========================================================================
            VIEW 1: PUBLIC LEADERBOARD (หน้าจอสำหรับผู้ชม Live View สำหรับ TV 80-90 นิ้ว)
            ========================================================================= */}
        {!isAdmin && (
          <div className="flex-1 flex flex-col justify-center w-full min-h-[calc(100vh-120px)] pb-10">
            {(() => {
              if (teams.length === 0) {
                return (
                  <div className="text-center py-10 glass-panel rounded-xl">
                    <p className="text-slate-500 text-2xl">ยังไม่มีทีมในระบบ</p>
                  </div>
                );
              }

              const { rank1, rank2, rank3, bottomTeams } = getRankedTeamsData();

              return (
                <div className="flex flex-col items-center w-full mx-auto">
                  
                  {/* --- แท่นรางวัล (Podium) --- */}
                  {rank1 && <PodiumView rank1={rank1} rank2={rank2} rank3={rank3} />}

                  {/* --- ตารางรายชื่อทีมที่เหลือ --- */}
                  {bottomTeams.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-8 mt-4 w-full px-2 lg:px-4 max-w-7xl mx-auto">
                      {bottomTeams.map((team) => {
                        const isRanked = team.score > 0;
                        return (
                          <div 
                            key={team.id} 
                            className={`flex items-center justify-between p-4 lg:p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 ${
                              isRanked 
                                ? 'glass-panel border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-slate-800/80' 
                                : 'bg-slate-100/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 grayscale-[20%]'
                            }`}
                          >
                            <div className="flex items-center gap-3 lg:gap-4 overflow-hidden pr-2">
                              <div className={`w-10 h-10 lg:w-14 lg:h-14 flex-shrink-0 rounded-full flex items-center justify-center font-black text-lg lg:text-2xl shadow-inner ${
                                isRanked 
                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                              }`}>
                                {team.displayRank}
                              </div>
                              <h4 className={`font-bold text-lg lg:text-xl 2xl:text-2xl break-words line-clamp-2 leading-snug ${
                                isRanked ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                              }`}>
                                {team.name}
                              </h4>
                            </div>
                            <div className="flex items-baseline gap-1 ml-auto flex-shrink-0">
                              <span className={`text-3xl lg:text-4xl 2xl:text-5xl font-black tabular-nums tracking-tighter ${
                                isRanked ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                              }`}>
                                {isRanked ? team.score.toLocaleString() : '-'}
                              </span>
                              {isRanked && (
                                <span className="font-bold text-slate-400 dark:text-slate-400 text-xs lg:text-sm">คะแนน</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {}
        {/* =========================================================================
            VIEW 2: ADMIN CONTROL PANEL (พร้อม Live Preview)
            ========================================================================= */}
        {isAdmin && (
          <div className="space-y-6 animate-fade-in-up py-2 max-w-7xl mx-auto w-full">
            
            {/* Header ควบคุมหลัก */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                  <Settings className="text-blue-500" /> แผงควบคุม (Admin Panel)
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                  จอจำลองด้านล่างจะแสดงผลเหมือนกับหน้าจอโปรเจกเตอร์ของผู้ชม (Live View)
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg font-bold transition-colors text-sm"
                >
                  <FileSpreadsheet className="w-4 h-4" /> ตารางตรวจสอบ
                </button>
                <button
                  onClick={() => setIsCelebrating(!isCelebrating)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-colors text-sm ${
                    isCelebrating 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50'
                  }`}
                >
                  <PartyPopper className="w-4 h-4" />
                  {isCelebrating ? 'หยุดพลุฉลอง' : 'ยิงพลุฉลอง'}
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg font-bold transition-colors text-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  ล้างคะแนน
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* คอลัมน์ซ้าย (Live Preview + ตั้งค่าข้อ) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* 1. Live Preview จำลองจอผู้ชม */}
                <div className="glass-panel p-4 rounded-2xl shadow-sm relative overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                  <div className="absolute top-2 left-3 flex items-center gap-2 text-xs font-bold text-red-500 animate-pulse bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full border border-red-200 dark:border-red-800 z-50">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Live Preview
                  </div>
                  
                  {(() => {
                    const { rank1, rank2, rank3 } = getRankedTeamsData();
                    if (!rank1) return <div className="h-[200px] flex items-center justify-center text-slate-400">ยังไม่มีข้อมูล</div>;
                    return (
                      <div className="mt-6 flex justify-center scale-95 origin-top pt-6">
                        <PodiumView rank1={rank1} rank2={rank2} rank3={rank3} isPreview={true} />
                      </div>
                    );
                  })()}
                </div>

                {/* 2. ส่วนตั้งค่าข้อการแข่งขัน */}
                <div className="glass-panel p-5 rounded-2xl shadow-sm">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" /> การแข่งขันปัจจุบัน
                  </h3>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center shadow-sm">
                    <label className="text-sm font-medium text-slate-500 mb-2">กำลังบันทึกคะแนนในข้อที่</label>
                    <div className="flex items-center justify-between w-full max-w-[200px]">
                      <button onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="text-3xl font-black text-blue-600 dark:text-blue-400 w-16 text-center">{currentQuestion}</div>
                      <button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. ส่วนกำหนดคะแนนด่วน & เพิ่มทีม */}
                <div className="glass-panel p-5 rounded-2xl shadow-sm grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">คะแนน Custom</h3>
                    <input type="number" min="1" value={customPoint} onChange={(e) => setCustomPoint(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold text-lg outline-none focus:border-blue-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">เพิ่มทีมใหม่</h3>
                    <form onSubmit={handleAddTeam} className="flex gap-2">
                      <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="ชื่อทีม..." className="w-full px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none" required />
                      <button type="submit" className="bg-slate-800 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-3 rounded-lg font-medium shadow-sm"><Plus className="w-4 h-4"/></button>
                    </form>
                  </div>
                </div>

              </div>

              {/* คอลัมน์ขวา (รายชื่อทีมและปุ่มจัดการคะแนน) */}
              <div className="lg:col-span-7 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 pb-4">
                {teams.length === 0 ? (
                  <div className="text-center py-10 glass-panel rounded-xl">
                    <p className="text-slate-500">ยังไม่มีทีม กรุณาเพิ่มทีมทางซ้ายมือ</p>
                  </div>
                ) : (
                  teams.map((team, index) => (
                    <div key={team.id} className="glass-panel p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors">
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        {editingTeam === team.id ? (
                          <div className="flex items-center gap-2 flex-1 w-full">
                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="px-2 py-1 border rounded bg-white dark:bg-slate-800 text-sm w-full" autoFocus onBlur={saveEditing} onKeyDown={(e) => e.key === 'Enter' && saveEditing()} />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1 w-full overflow-hidden">
                            <span className="font-bold text-base sm:text-lg break-words line-clamp-2 leading-tight">{team.name}</span>
                            <button onClick={() => startEditing(team)} className="text-slate-400 hover:text-blue-500 p-1 flex-shrink-0">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums w-16 text-center shrink-0 bg-blue-50 dark:bg-blue-900/20 py-1 rounded-lg border border-blue-100 dark:border-blue-800">
                          {team.score}
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
                           <div className="flex flex-col mr-1">
                             <button onClick={() => updateScore(team.id, -customPoint)} className="px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-bold transition-colors">
                               -{customPoint}
                             </button>
                           </div>
                           
                           <button onClick={() => updateScore(team.id, 1)} className="px-2 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">+1</button>
                           <button onClick={() => updateScore(team.id, 5)} className="px-2 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">+5</button>
                           <button onClick={() => updateScore(team.id, 10)} className="px-2 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">+10</button>
                           <button onClick={() => updateScore(team.id, customPoint)} className="px-2 sm:px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">+{customPoint}</button>
                           
                           <button onClick={() => handleDeleteTeam(team.id)} className="ml-1 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors shrink-0" title="ลบทีมนี้">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        )}
      </main>

      {}
      {/* =========================================================================
          MODALS & OVERLAYS
          ========================================================================= */}
      
      {/* 1. Modal ยืนยันการรีเซ็ตคะแนน */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print-hide">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up border border-slate-200 dark:border-slate-700">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <RefreshCcw className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">ยืนยันการรีเซ็ตข้อมูล?</h3>
            <p className="text-slate-500 text-center mb-6 text-sm">
              การกระทำนี้จะเปลี่ยนคะแนนของทุกทีมให้เป็น 0 และลบตารางตรวจสอบประวัติคะแนนที่ผ่านมาทั้งหมด คุณไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={confirmReset}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                ยืนยันการล้างข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal ตารางตรวจสอบคะแนน (Audit Log) */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0 print:block">
          <div id="print-area" className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-8 w-full max-w-[95vw] sm:max-w-7xl shadow-2xl relative my-auto animate-fade-in-up border border-slate-200 dark:border-slate-700 print:shadow-none print:border-none print:rounded-none">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print-hide">
              <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                <FileSpreadsheet className="text-emerald-500 w-6 h-6 sm:w-8 sm:h-8" /> ตารางตรวจสอบคะแนนรายข้อ
              </h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={handlePrint} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg font-bold transition-colors">
                  <Printer className="w-4 h-4" /> พิมพ์ตาราง (PDF)
                </button>
                <button onClick={() => setShowHistoryModal(false)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="hidden print:block mb-6 text-center text-black">
              <h2 className="text-2xl font-bold">สรุปผลคะแนน กิจกรรมตอบปัญหาประวัติศาสตร์</h2>
              <p>จุลมงกุฎคุณานุสรณ์ ครั้งที่ 4 ประจำปีการศึกษา 2569</p>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[60vh] rounded-xl border border-slate-200 dark:border-slate-700 print:max-h-none print:overflow-visible print:border-none shadow-inner">
              <table className="w-full text-sm text-left border-collapse relative">
                <thead className="sticky top-0 z-20 shadow-md">
                  <tr>
                    <th className="p-3 border-b-2 border-r dark:border-slate-600 font-bold whitespace-nowrap text-center bg-slate-200 dark:bg-slate-700 print:bg-slate-300">ข้อที่</th>
                    {teams.map((t, idx) => (
                      <th key={t.id} className="p-3 border-b-2 border-r dark:border-slate-600 font-bold text-center whitespace-nowrap min-w-[100px] bg-slate-200 dark:bg-slate-700 print:bg-slate-300">
                        <span className="block text-xs text-slate-500 dark:text-slate-400 font-normal print:text-black">ทีม {idx + 1}</span>
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({length: currentQuestion}, (_, i) => i + 1).map(qNum => (
                    <tr key={qNum} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 border-b border-r dark:border-slate-700 text-center font-bold bg-slate-50/80 dark:bg-slate-800/80 print:bg-white">{qNum}</td>
                      {teams.map(t => {
                        const scoreForQ = scoreLogs
                          .filter(log => log.question === qNum && log.teamId === t.id)
                          .reduce((sum, log) => sum + log.amount, 0);
                        
                        return (
                          <td key={t.id} className={`p-3 border-b border-r dark:border-slate-700 text-center text-base ${
                            scoreForQ > 0 ? 'text-emerald-600 font-bold print-text-emerald' : 
                            scoreForQ < 0 ? 'text-red-500 font-bold print-text-red' : 
                            'text-slate-300 dark:text-slate-600 print-text-black'
                          }`}>
                            {scoreForQ !== 0 ? (scoreForQ > 0 ? `+${scoreForQ}` : scoreForQ) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                  <tr>
                    <td className="p-3 border-t-2 border-r dark:border-slate-600 text-center font-black bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-200 print:bg-blue-200 print:text-black">รวม</td>
                    {teams.map(t => (
                      <td key={t.id} className="p-3 border-t-2 border-r dark:border-slate-600 text-center text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/80 text-xl font-black print:bg-blue-100 print:text-black">
                        {t.score}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 print:text-black">
              <p>* ข้อมูลอัปเดตแบบเรียลไทม์จากการบันทึกของคณะกรรมการ</p>
              <p className="hidden print:block">พิมพ์เมื่อ: {new Date().toLocaleString('th-TH')}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default App;