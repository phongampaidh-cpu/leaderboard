import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Medal, Settings, UserPlus, Trash2, Edit2, 
  RefreshCcw, Moon, Sun, ArrowLeft, PartyPopper, 
  FileSpreadsheet, X, Minus, Plus, Printer
} from 'lucide-react';

// คอมโพเนนต์กราฟิกเด็กนักเรียน (ปรับให้มีความน่ารักสมจริง และใส่ชุดนักเรียน)
const StudentMascot = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(0, 5)">
      {/* Arms (Raised up for celebration) */}
      <path d="M25 55 C 15 45, 10 25, 20 15" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
      <path d="M75 55 C 85 45, 90 25, 80 15" stroke="#FDBA74" strokeWidth="7" strokeLinecap="round" />
      
      {/* Hands */}
      <circle cx="20" cy="15" r="5" fill="#FDBA74" />
      <circle cx="80" cy="15" r="5" fill="#FDBA74" />

      {/* Shirt */}
      <path d="M30 45 Q 50 35 70 45 L 75 80 Q 50 90 25 80 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
      
      {/* Shirt Collar */}
      <path d="M38 43 L 50 55 L 62 43" stroke="#CBD5E1" strokeWidth="2" fill="#F1F5F9" strokeLinejoin="round" />
      
      {/* Tie */}
      <path d="M47 55 L 53 55 L 55 75 L 50 82 L 45 75 Z" fill="#1D4ED8" />
      
      {/* Head */}
      <circle cx="50" cy="28" r="21" fill="#FDBA74" />
      
      {/* Hair (Neat student haircut) */}
      <path d="M26 28 C 26 -5, 74 -5, 74 28 C 74 15, 26 15, 26 28 Z" fill="#1E293B" />
      <path d="M26 25 Q 30 15 40 12" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
      
      {/* Eyes (Sparkly happy eyes) */}
      <path d="M39 25 Q 42.5 20 46 25" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M54 25 Q 57.5 20 61 25" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
      
      {/* Mouth (Happy open mouth) */}
      <path d="M42 32 Q 50 44 58 32" fill="#EF4444" />
      <path d="M45 32 Q 50 38 55 32" fill="#FCA5A5" /> {/* Tongue */}
      
      {/* Cheeks */}
      <circle cx="36" cy="32" r="4.5" fill="#F87171" opacity="0.6" />
      <circle cx="64" cy="32" r="4.5" fill="#F87171" opacity="0.6" />
    </g>
  </svg>
);

const App = () => {
  // === State Management ===
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('bmpn_teams');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'ประวัติศาสตร์ยุคต้น', score: 0 },
      { id: '2', name: 'สยามประเทศ', score: 0 },
      { id: '3', name: 'นักปราชญ์ล้านนา', score: 0 },
      { id: '4', name: 'อยุธยารุ่งเรือง', score: 0 },
      { id: '5', name: 'รัตนโกสินทร์ศก', score: 0 },
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
  const [showHistoryModal, setShowHistoryModal] = useState(false); // สำหรับเปิดหน้าตารางตรวจสอบ
  const [editingTeam, setEditingTeam] = useState(null);
  const [editName, setEditName] = useState('');
  
  // ระบบเก็บประวัติคะแนน
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

  // === Effects ===
  // นำเข้าไลบรารีพลุ
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // จัดการการแสดงผลพลุ
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

  // บันทึกข้อมูลต่างๆ ลง localStorage
  useEffect(() => {
    localStorage.setItem('bmpn_teams', JSON.stringify(teams));
    localStorage.setItem('bmpn_score_logs', JSON.stringify(scoreLogs));
    localStorage.setItem('bmpn_curr_q', currentQuestion.toString());
  }, [teams, scoreLogs, currentQuestion]);

  // ซิงค์ข้อมูลข้ามหน้าต่าง (Real-time updates)
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

  // Effect สำหรับเล่นแอนิเมชันเด็กนักเรียนแอบมอง (Peeking) เฉพาะ Top 3
  useEffect(() => {
    if (isAdmin) return;
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
      }, 2500);
    }
    prevTeamsRef.current = teams;
  }, [teams, isAdmin]);

  // จัดการโหมดมืด/สว่าง
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bmpn_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bmpn_theme', 'light');
    }
  }, [darkMode]);

  // === Helper Functions ===
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
    
    // คำนวณคะแนนและบันทึกลง Log เพื่อการตรวจสอบ
    const newTeams = teams.map(t => {
      if (t.id === id) {
        const newScore = Math.max(0, t.score + amount);
        actualAmount = newScore - t.score;
        return { ...t, score: newScore };
      }
      return t;
    });

    setTeams(newTeams);

    // บันทึกลง Log เฉพาะเมื่อมีการเปลี่ยนแปลงคะแนนจริงๆ
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
    setScoreLogs([]); // ล้างประวัติทั้งหมด
    setCurrentQuestion(1); // กลับไปข้อ 1 ใหม่
    setIsCelebrating(false);
    setShowResetModal(false);
  };

  // พิมพ์หน้าตาราง
  const handlePrint = () => {
    window.print();
  };

  // === สไตล์ CSS เพิ่มเติม ===
  const customStyles = `
    .flip-list-move {
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .glass-panel {
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    .dark .glass-panel {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes peekLeft {
      0% { transform: translateX(30%) rotate(0deg) scale(0.5); opacity: 0; }
      15% { transform: translateX(-65%) rotate(-20deg) scale(1); opacity: 1; }
      85% { transform: translateX(-65%) rotate(-20deg) scale(1); opacity: 1; }
      100% { transform: translateX(30%) rotate(0deg) scale(0.5); opacity: 0; }
    }
    @keyframes peekRight {
      0% { transform: translateX(-30%) rotate(0deg) scale(0.5); opacity: 0; }
      15% { transform: translateX(65%) rotate(20deg) scale(1); opacity: 1; }
      85% { transform: translateX(65%) rotate(20deg) scale(1); opacity: 1; }
      100% { transform: translateX(-30%) rotate(0deg) scale(0.5); opacity: 0; }
    }
    .student-peek-left, .student-peek-right {
      position: absolute;
      z-index: 0;
      opacity: 0;
      pointer-events: none;
    }
    .student-peek-left { left: 0; }
    .student-peek-right { right: 0; }
    
    .is-animating .student-peek-left {
      animation: peekLeft 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    .is-animating .student-peek-right {
      animation: peekRight 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    /* ซ่อนส่วนที่ไม่ต้องการตอนพิมพ์ PDF (Print Mode) */
    @media print {
      body * { visibility: hidden; }
      #print-area, #print-area * { visibility: visible; }
      #print-area { position: absolute; left: 0; top: 0; width: 100%; color: black !important; }
      .dark #print-area { color: black !important; background: white !important; }
      .print-hide { display: none !important; }
      th, td { border-color: #000 !important; }
    }
  `;

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
        
        <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
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
            {isAdmin ? <><ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">กลับหน้ารวม</span></> : <><Settings className="w-4 h-4" /> <span className="hidden sm:inline">จัดการแอดมิน</span></>}
          </button>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col justify-center container mx-auto px-4 py-4 max-w-7xl overflow-hidden">
        
        {/* =========================================================================
            VIEW 1: PUBLIC LEADERBOARD (เมื่อไม่ได้อยู่ในโหมด Admin)
            ========================================================================= */}
        {!isAdmin && (
          <div className="flex-1 flex flex-col justify-center w-full min-h-[calc(100vh-120px)]">

            {(() => {
              if (teams.length === 0) {
                return (
                  <div className="text-center py-10 glass-panel rounded-xl">
                    <p className="text-slate-500">ยังไม่มีทีมในระบบ</p>
                  </div>
                );
              }

              // คำนวณอันดับ
              const teamsWithRank = sortedTeams.map((team, index, arr) => {
                if (team.score === 0) return { ...team, displayRank: '-' };
                const actualRank = arr.findIndex(t => t.score === team.score) + 1;
                return { ...team, displayRank: actualRank };
              });

              const rankedTeams = teamsWithRank.filter(t => t.score > 0);
              const unrankedTeams = teamsWithRank.filter(t => t.score === 0);

              const rank1 = rankedTeams[0];
              const rank2 = rankedTeams[1];
              const rank3 = rankedTeams[2];
              const bottomTeams = [...rankedTeams.slice(3), ...unrankedTeams];

              return (
                <div className="flex flex-col items-center w-full max-w-5xl mx-auto -mt-6">
                  
                  {/* --- แท่นรางวัล (Podium) --- */}
                  {rank1 && (
                    <div className="flex flex-row justify-center items-end gap-2 sm:gap-6 mt-4 sm:mt-6 mb-6 h-[260px] sm:h-[320px] px-2 w-full max-w-4xl">
                      
                      {/* แท่นอันดับ 2 (ซ้าย) */}
                      {rank2 ? (
                        <div className={`flex flex-col items-center w-28 sm:w-48 animate-fade-in-up relative ${animatingTeams.has(rank2.id) ? 'is-animating' : ''}`} style={{ animationDelay: '0.1s' }}>
                          <div className="student-peek-left top-1/4 sm:top-1/3">
                            <StudentMascot className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-xl" />
                          </div>
                          <div className="flex flex-col items-center mb-2 bg-gradient-to-r from-slate-200 to-gray-100 dark:from-slate-700 dark:to-gray-800 p-2 sm:p-4 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-500 w-full relative z-10 text-center transition-transform hover:-translate-y-1 scale-[1.01]">
                            <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500 dark:text-slate-300 mb-1 drop-shadow-md" />
                            <span className="font-bold text-xs sm:text-sm truncate w-full text-slate-800 dark:text-white">{rank2.name}</span>
                            <span className="text-lg sm:text-2xl font-black text-slate-700 dark:text-slate-200 tracking-tighter">{rank2.score.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-24 sm:h-36 bg-gradient-to-t from-slate-300 to-slate-100 dark:from-slate-700 dark:to-slate-500 rounded-t-xl shadow-inner flex justify-center pt-4 sm:pt-6 border-t-4 border-slate-400 relative">
                            <span className="text-4xl sm:text-6xl font-black text-slate-400/50 dark:text-slate-900/30">2</span>
                          </div>
                        </div>
                      ) : <div className="w-28 sm:w-48"></div>}

                      {/* แท่นอันดับ 1 (ตรงกลาง) */}
                      <div className={`flex flex-col items-center w-36 sm:w-60 animate-fade-in-up z-20 relative ${animatingTeams.has(rank1.id) ? 'is-animating' : ''}`}>
                          <div className="student-peek-right top-[15%] sm:top-[20%]">
                            <StudentMascot className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-2xl" />
                          </div>
                          <div className="flex flex-col items-center mb-2 bg-gradient-to-br from-yellow-100 to-amber-50 dark:from-yellow-900/60 dark:to-amber-900/30 p-3 sm:p-5 rounded-2xl shadow-2xl border-2 border-yellow-400 dark:border-yellow-500 w-full relative z-10 text-center transition-transform hover:-translate-y-2 scale-105">
                            <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-500 mb-1 drop-shadow-lg" />
                            <span className="font-extrabold text-sm sm:text-base truncate w-full text-slate-800 dark:text-white">{rank1.name}</span>
                            <span className="text-2xl sm:text-3xl font-black text-yellow-600 dark:text-yellow-400 tracking-tighter">{rank1.score.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-36 sm:h-48 bg-gradient-to-t from-yellow-500 to-yellow-300 dark:from-yellow-700 dark:to-yellow-500 rounded-t-xl shadow-[0_-10px_40px_rgba(234,179,8,0.3)] flex justify-center pt-6 sm:pt-8 border-t-4 border-yellow-200 relative">
                            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-t-xl pointer-events-none"></div>
                            <span className="text-5xl sm:text-7xl font-black text-yellow-700/40 dark:text-yellow-900/40 relative z-10">1</span>
                          </div>
                      </div>

                      {/* แท่นอันดับ 3 (ขวา) */}
                      {rank3 ? (
                        <div className={`flex flex-col items-center w-28 sm:w-48 animate-fade-in-up relative ${animatingTeams.has(rank3.id) ? 'is-animating' : ''}`} style={{ animationDelay: '0.2s' }}>
                          <div className="student-peek-right top-1/4 sm:top-1/3">
                            <StudentMascot className="w-16 h-16 sm:w-24 sm:h-24 drop-shadow-xl" />
                          </div>
                          <div className="flex flex-col items-center mb-2 bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-2xl shadow-lg border border-amber-300 dark:border-amber-900/50 w-full relative z-10 text-center transition-transform hover:-translate-y-1">
                            <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 mb-1 drop-shadow-sm" />
                            <span className="font-bold text-xs sm:text-sm truncate w-full text-slate-700 dark:text-slate-200">{rank3.name}</span>
                            <span className="text-lg sm:text-2xl font-black text-amber-600 dark:text-amber-500 tracking-tighter">{rank3.score.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-16 sm:h-24 bg-gradient-to-t from-orange-300 to-amber-200 dark:from-amber-800 dark:to-orange-700 rounded-t-xl shadow-inner flex justify-center pt-3 sm:pt-4 border-t-4 border-amber-400 relative">
                            <span className="text-4xl sm:text-6xl font-black text-amber-700/30 dark:text-amber-900/30">3</span>
                          </div>
                        </div>
                      ) : <div className="w-28 sm:w-48"></div>}

                    </div>
                  )}

                  {/* --- ตารางรายชื่อทีมที่เหลือแบบคอลัมน์ (Grid 4 Columns) --- */}
                  {bottomTeams.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-4 w-full">
                      {bottomTeams.map((team) => {
                        const isRanked = team.score > 0;
                        return (
                          <div 
                            key={team.id} 
                            className={`flex items-center justify-between p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 ${
                              isRanked 
                                ? 'glass-panel border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-slate-800/80' 
                                : 'bg-slate-100/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 grayscale-[20%]'
                            }`}
                          >
                            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                              <div className={`w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full flex items-center justify-center font-black text-base sm:text-lg shadow-inner ${
                                isRanked 
                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                              }`}>
                                {team.displayRank}
                              </div>
                              <h4 className={`font-bold text-base sm:text-lg md:text-xl truncate ${
                                isRanked ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                              }`}>
                                {team.name}
                              </h4>
                            </div>
                            <div className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tighter ml-3 flex-shrink-0 ${
                              isRanked ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                            }`}>
                              {isRanked ? team.score.toLocaleString() : '-'}
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

        {/* =========================================================================
            VIEW 2: ADMIN CONTROL PANEL
            ========================================================================= */}
        {isAdmin && (
          <div className="space-y-8 animate-fade-in-up py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Settings className="text-blue-500" /> แผงควบคุมระบบ (Admin Panel)
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">จัดการคะแนน รายชื่อทีม และตรวจสอบการให้คะแนน</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 rounded-lg font-bold transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4" /> ตารางตรวจสอบคะแนน
                </button>
                <button
                  onClick={() => setIsCelebrating(!isCelebrating)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${
                    isCelebrating 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md animate-pulse'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50'
                  }`}
                >
                  <PartyPopper className="w-4 h-4" />
                  {isCelebrating ? 'หยุดพลุฉลอง' : 'เปิดพลุฉลอง'}
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg font-bold transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  ล้างคะแนนทั้งหมด
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* แผงตั้งค่าและจัดการข้อ (คอลัมน์ซ้าย) */}
              <div className="glass-panel p-6 rounded-2xl shadow-sm lg:col-span-1 h-fit flex flex-col gap-8">
                
                {/* 1. ส่วนตั้งค่าข้อการแข่งขัน */}
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" /> การแข่งขันปัจจุบัน
                  </h3>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center shadow-sm">
                    <label className="text-sm font-medium text-slate-500 mb-2">กำลังบันทึกคะแนนในข้อที่</label>
                    <div className="flex items-center justify-between w-full gap-4">
                      <button 
                        onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
                        className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="text-4xl font-black text-blue-600 dark:text-blue-400 w-16 text-center">
                        {currentQuestion}
                      </div>
                      <button 
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. ส่วนกำหนดคะแนนด่วน */}
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> การตั้งค่าคะแนน
                  </h3>
                  <div className="flex flex-col gap-2">
                     <label className="text-sm">กำหนดคะแนนที่จะบวก/ลบ (Custom Point):</label>
                     <input
                        type="number"
                        min="1"
                        value={customPoint}
                        onChange={(e) => setCustomPoint(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-bold text-xl outline-none focus:border-blue-500 transition-colors"
                      />
                  </div>
                </div>

                {/* 3. เพิ่มทีมใหม่ */}
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" /> เพิ่มทีมใหม่
                  </h3>
                  <form onSubmit={handleAddTeam} className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="กรอกชื่อทีม..."
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                    <button 
                      type="submit"
                      className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm"
                    >
                      เพิ่มทีม
                    </button>
                  </form>
                </div>
                
              </div>

              {/* รายชื่อทีมและปุ่มจัดการคะแนน (คอลัมน์ขวา) */}
              <div className="lg:col-span-2 space-y-3">
                {teams.length === 0 ? (
                  <div className="text-center py-10 glass-panel rounded-xl">
                    <p className="text-slate-500">ยังไม่มีทีม กรุณาเพิ่มทีมทางซ้ายมือ</p>
                  </div>
                ) : (
                  teams.map((team, index) => (
                    <div key={team.id} className="glass-panel p-3 sm:p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors">
                      
                      {/* ข้อมูลทีม & แก้ไขชื่อ */}
                      <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        {editingTeam === team.id ? (
                          <div className="flex items-center gap-2 flex-1 w-full">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="px-2 py-1 border rounded bg-white dark:bg-slate-800 text-sm w-full"
                              autoFocus
                              onBlur={saveEditing}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditing()}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 flex-1 w-full overflow-hidden">
                            <span className="font-bold text-lg truncate">{team.name}</span>
                            <button onClick={() => startEditing(team)} className="text-slate-400 hover:text-blue-500 p-1 flex-shrink-0">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* ตัวควบคุมคะแนน */}
                      <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums w-16 text-center shrink-0 bg-blue-50 dark:bg-blue-900/20 py-1 rounded-lg">
                          {team.score}
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
                           <div className="flex flex-col gap-1 mr-1 sm:mr-2">
                             <button onClick={() => updateScore(team.id, -customPoint)} className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-bold transition-colors">
                               -{customPoint}
                             </button>
                           </div>
                           
                           <button onClick={() => updateScore(team.id, 1)} className="px-2 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">
                             +1
                           </button>
                           <button onClick={() => updateScore(team.id, 5)} className="px-2 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">
                             +5
                           </button>
                           <button onClick={() => updateScore(team.id, 10)} className="px-2 sm:px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">
                             +10
                           </button>
                           <button onClick={() => updateScore(team.id, customPoint)} className="px-2 sm:px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">
                             +{customPoint}
                           </button>
                           
                           <button onClick={() => handleDeleteTeam(team.id)} className="ml-1 sm:ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors shrink-0" title="ลบทีมนี้">
                             <Trash2 className="w-5 h-5" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:bg-white print:p-0 print:block">
          <div id="print-area" className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-8 w-full max-w-6xl shadow-2xl relative my-auto animate-fade-in-up border border-slate-200 dark:border-slate-700 print:shadow-none print:border-none print:rounded-none">
            
            {/* ส่วนหัว Modal */}
            <div className="flex justify-between items-start mb-6 print-hide">
              <h3 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                <FileSpreadsheet className="text-emerald-500 w-8 h-8" /> ตารางตรวจสอบคะแนนรายข้อ
              </h3>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg font-bold transition-colors">
                  <Printer className="w-4 h-4" /> <span className="hidden sm:inline">พิมพ์ตาราง (PDF)</span>
                </button>
                <button onClick={() => setShowHistoryModal(false)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* ส่วนหัวสำหรับ Print */}
            <div className="hidden print:block mb-6 text-center text-black">
              <h2 className="text-2xl font-bold">สรุปผลคะแนน กิจกรรมตอบปัญหาประวัติศาสตร์</h2>
              <p>จุลมงกุฎคุณานุสรณ์ ครั้งที่ 4 ประจำปีการศึกษา 2569</p>
            </div>

            {/* ตารางข้อมูล */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 print:border-none">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 print:bg-slate-200">
                    <th className="p-3 border dark:border-slate-700 font-bold whitespace-nowrap text-center bg-slate-200 dark:bg-slate-700 print:bg-slate-300">ข้อที่</th>
                    {teams.map((t, idx) => (
                      <th key={t.id} className="p-3 border dark:border-slate-700 font-bold text-center whitespace-nowrap min-w-[100px]">
                        <span className="block text-xs text-slate-500 dark:text-slate-400 font-normal print:text-black">ทีม {idx + 1}</span>
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* วนลูปสร้างแถวตามจำนวนข้อที่กำลังแข่งถึงปัจจุบัน */}
                  {Array.from({length: currentQuestion}, (_, i) => i + 1).map(qNum => (
                    <tr key={qNum} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 border dark:border-slate-700 text-center font-bold bg-slate-50 dark:bg-slate-800/30 print:bg-white">{qNum}</td>
                      {teams.map(t => {
                        // คำนวณผลรวมคะแนนของทีม t ในข้อ qNum
                        const scoreForQ = scoreLogs
                          .filter(log => log.question === qNum && log.teamId === t.id)
                          .reduce((sum, log) => sum + log.amount, 0);
                        
                        return (
                          <td key={t.id} className={`p-3 border dark:border-slate-700 text-center text-base ${
                            scoreForQ > 0 ? 'text-emerald-600 font-bold print:text-black' : 
                            scoreForQ < 0 ? 'text-red-500 font-bold print:text-black' : 
                            'text-slate-300 dark:text-slate-600 print:text-gray-300'
                          }`}>
                            {scoreForQ !== 0 ? (scoreForQ > 0 ? `+${scoreForQ}` : scoreForQ) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50 dark:bg-blue-900/20 font-bold print:bg-blue-100">
                    <td className="p-3 border dark:border-slate-700 text-center font-black text-blue-800 dark:text-blue-300 print:text-black">รวม</td>
                    {teams.map(t => (
                      <td key={t.id} className="p-3 border dark:border-slate-700 text-center text-blue-700 dark:text-blue-400 text-xl font-black print:text-black">
                        {t.score}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <p className="mt-4 text-xs text-slate-400 text-center print:text-black">
              * ข้อมูลอัปเดตแบบเรียลไทม์จากการบันทึกของคณะกรรมการ
            </p>

          </div>
        </div>
      )}

    </div>
  );
};

export default App;