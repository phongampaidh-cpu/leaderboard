import React, { useState, useEffect } from 'react';
import { 
  Trophy, Medal, Settings, UserPlus, Trash2, Edit2, 
  RefreshCcw, Moon, Sun, ArrowLeft, PartyPopper
} from 'lucide-react';

const App = () => {
  // === State Management ===
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('bmpn_teams');
    if (saved) {
      return JSON.parse(saved);
    }
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

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('bmpn_theme');
    return savedTheme === 'dark';
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [customPoint, setCustomPoint] = useState(1);
  const [showResetModal, setShowResetModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editName, setEditName] = useState('');
  
  const [isCelebrating, setIsCelebrating] = useState(() => {
    return localStorage.getItem('bmpn_celebrate') === 'true';
  });

  // === Effects ===
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
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            zIndex: 100,
            particleCount: Math.floor(randomInRange(50, 100)),
            colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
            origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
          });
        }
      }, 400);
    } else {
      localStorage.setItem('bmpn_celebrate', 'false');
      if (window.confetti) {
        window.confetti.reset();
      }
    }
    return () => clearInterval(interval);
  }, [isCelebrating]);

  useEffect(() => {
    localStorage.setItem('bmpn_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    const syncAcrossWindows = (e) => {
      if (e.key === 'bmpn_teams' && e.newValue) {
        setTeams(JSON.parse(e.newValue));
      }
      if (e.key === 'bmpn_theme') {
        setDarkMode(e.newValue === 'dark');
      }
      if (e.key === 'bmpn_celebrate') {
        setIsCelebrating(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', syncAcrossWindows);
    return () => window.removeEventListener('storage', syncAcrossWindows);
  }, []);

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
    if (b.score === a.score) {
      return a.name.localeCompare(b.name, 'th');
    }
    return b.score - a.score;
  });

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    const newTeam = {
      id: Date.now().toString(),
      name: newTeamName.trim(),
      score: 0
    };
    setTeams([...teams, newTeam]);
    setNewTeamName('');
  };

  const handleDeleteTeam = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบทีมนี้?')) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  const startEditing = (team) => {
    setEditingTeam(team.id);
    setEditName(team.name);
  };

  const saveEditing = () => {
    if (!editName.trim()) {
      setEditingTeam(null);
      return;
    }
    setTeams(teams.map(t => t.id === editingTeam ? { ...t, name: editName.trim() } : t));
    setEditingTeam(null);
  };

  const updateScore = (id, amount) => {
    setTeams(teams.map(t => {
      if (t.id === id) {
        return { ...t, score: Math.max(0, t.score + amount) }; // ป้องกันคะแนนติดลบ
      }
      return t;
    }));
  };

  const confirmReset = () => {
    setTeams(teams.map(t => ({ ...t, score: 0 })));
    setIsCelebrating(false);
    setShowResetModal(false);
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
  `;

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}>
      <style>{customStyles}</style>

      {/* --- Top Navigation --- */}
      <nav className="glass-panel sticky top-0 z-40 px-4 py-3 flex justify-between items-center shadow-sm">
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
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* =========================================================================
            VIEW 1: PUBLIC LEADERBOARD (เมื่อไม่ได้อยู่ในโหมด Admin)
            ========================================================================= */}
        {!isAdmin && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                กระดานจัดอันดับคะแนน
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                อัปเดตสถานการณ์แบบเรียลไทม์ ร่วมลุ้นและเป็นกำลังใจให้ทุกทีม
              </p>
            </div>

            {(() => {
              if (teams.length === 0) {
                return (
                  <div className="text-center py-10 glass-panel rounded-xl">
                    <p className="text-slate-500">ยังไม่มีทีมในระบบ</p>
                  </div>
                );
              }

              // ประมวลผลอันดับ (ถ้าคะแนนเท่ากัน ให้อันดับเดียวกัน)
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

              // ทีมที่เหลือจับไปรวมไว้ใน Grid ด้านล่าง
              const bottomTeams = [...rankedTeams.slice(3), ...unrankedTeams];

              return (
                <div className="flex flex-col gap-4 sm:gap-6 w-full">
                  
                  {/* --- แท่นรางวัล (Podium) สำหรับ Top 3 --- */}
                  {rank1 && (
                    <div className="flex flex-row justify-center items-end gap-2 sm:gap-6 mt-2 sm:mt-4 mb-2 h-[280px] sm:h-[350px] px-2 w-full max-w-4xl mx-auto">
                      
                      {/* แท่นอันดับ 2 (ซ้าย) */}
                      {rank2 ? (
                        <div className="flex flex-col items-center w-28 sm:w-48 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                          <div className="flex flex-col items-center mb-2 bg-gradient-to-r from-slate-200 to-gray-100 dark:from-slate-700 dark:to-gray-800 p-2 sm:p-4 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-500 w-full relative z-10 text-center transition-transform hover:-translate-y-1 scale-[1.01]">
                            <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500 dark:text-slate-300 mb-1 drop-shadow-md" />
                            <span className="font-bold text-xs sm:text-sm truncate w-full text-slate-800 dark:text-white">{rank2.name}</span>
                            <span className="text-lg sm:text-2xl font-black text-slate-700 dark:text-slate-200 tracking-tighter">{rank2.score.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-28 sm:h-40 bg-gradient-to-t from-slate-300 to-slate-100 dark:from-slate-700 dark:to-slate-500 rounded-t-xl shadow-inner flex justify-center pt-4 sm:pt-6 border-t-4 border-slate-400 relative">
                            <span className="text-4xl sm:text-6xl font-black text-slate-400/50 dark:text-slate-900/30">2</span>
                          </div>
                        </div>
                      ) : <div className="w-28 sm:w-48"></div>}

                      {/* แท่นอันดับ 1 (ตรงกลาง) */}
                      <div className="flex flex-col items-center w-36 sm:w-60 animate-fade-in-up z-20">
                          <div className="flex flex-col items-center mb-2 bg-gradient-to-br from-yellow-100 to-amber-50 dark:from-yellow-900/60 dark:to-amber-900/30 p-3 sm:p-5 rounded-2xl shadow-2xl border-2 border-yellow-400 dark:border-yellow-500 w-full relative text-center transition-transform hover:-translate-y-2 scale-105">
                            <Trophy className="w-10 h-10 sm:w-14 sm:h-14 text-yellow-500 mb-1 drop-shadow-lg" />
                            <span className="font-extrabold text-sm sm:text-base truncate w-full text-slate-800 dark:text-white">{rank1.name}</span>
                            <span className="text-2xl sm:text-3xl font-black text-yellow-600 dark:text-yellow-400 tracking-tighter">{rank1.score.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-40 sm:h-56 bg-gradient-to-t from-yellow-500 to-yellow-300 dark:from-yellow-700 dark:to-yellow-500 rounded-t-xl shadow-[0_-10px_40px_rgba(234,179,8,0.3)] flex justify-center pt-6 sm:pt-8 border-t-4 border-yellow-200 relative">
                            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-t-xl pointer-events-none"></div>
                            <span className="text-5xl sm:text-7xl font-black text-yellow-700/40 dark:text-yellow-900/40 relative z-10">1</span>
                          </div>
                      </div>

                      {/* แท่นอันดับ 3 (ขวา) */}
                      {rank3 ? (
                        <div className="flex flex-col items-center w-28 sm:w-48 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                          <div className="flex flex-col items-center mb-2 bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-2xl shadow-lg border border-amber-300 dark:border-amber-900/50 w-full relative z-10 text-center transition-transform hover:-translate-y-1">
                            <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 mb-1 drop-shadow-sm" />
                            <span className="font-bold text-xs sm:text-sm truncate w-full text-slate-700 dark:text-slate-200">{rank3.name}</span>
                            <span className="text-lg sm:text-2xl font-black text-amber-600 dark:text-amber-500 tracking-tighter">{rank3.score.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-20 sm:h-28 bg-gradient-to-t from-orange-300 to-amber-200 dark:from-amber-800 dark:to-orange-700 rounded-t-xl shadow-inner flex justify-center pt-3 sm:pt-4 border-t-4 border-amber-400 relative">
                            <span className="text-4xl sm:text-6xl font-black text-amber-700/30 dark:text-amber-900/30">3</span>
                          </div>
                        </div>
                      ) : <div className="w-28 sm:w-48"></div>}

                    </div>
                  )}

                  {/* --- ตารางรายชื่อทีมที่เหลือแบบคอลัมน์ (Grid) --- */}
                  {bottomTeams.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 mt-2 w-full px-2 max-w-full">
                      {bottomTeams.map((team) => {
                        const isRanked = team.score > 0;
                        return (
                          <div 
                            key={team.id} 
                            className={`flex items-center justify-between p-2 sm:p-3 rounded-xl border transition-all duration-300 hover:shadow-md ${
                              isRanked 
                                ? 'glass-panel border-blue-200 dark:border-blue-900/50 hover:border-blue-400' 
                                : 'bg-white/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 grayscale-[40%]'
                            }`}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                              <div className={`w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner ${
                                isRanked 
                                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              }`}>
                                {team.displayRank}
                              </div>
                              <h4 className={`font-bold text-xs sm:text-sm truncate ${
                                isRanked ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                              }`}>
                                {team.name}
                              </h4>
                            </div>
                            <div className={`text-lg sm:text-xl font-black tabular-nums tracking-tighter ml-2 flex-shrink-0 ${
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
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Settings className="text-blue-500" /> แผงควบคุมระบบ (Admin Panel)
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">จัดการคะแนนและรายชื่อทีม</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCelebrating(!isCelebrating)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isCelebrating 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md animate-pulse'
                      : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50'
                  }`}
                >
                  <PartyPopper className="w-4 h-4" />
                  {isCelebrating ? 'หยุดพลุฉลอง' : 'เปิดพลุฉลอง'}
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  ล้างคะแนนทั้งหมด
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* แผงจัดการทีม (คอลัมน์ซ้าย) */}
              <div className="glass-panel p-6 rounded-2xl shadow-sm lg:col-span-1 h-fit">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" /> เพิ่มทีมใหม่
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    เพิ่มทีม
                  </button>
                </form>

                <div className="mt-8">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">การตั้งค่าคะแนนด่วน</h3>
                  <div className="flex flex-col gap-2">
                     <label className="text-sm">กำหนดคะแนนที่จะบวก/ลบ (Custom Point):</label>
                     <input
                        type="number"
                        min="1"
                        value={customPoint}
                        onChange={(e) => setCustomPoint(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-center font-bold outline-none"
                      />
                  </div>
                </div>
              </div>

              {/* รายชื่อทีมและปุ่มจัดการคะแนน (คอลัมน์ขวา) */}
              <div className="lg:col-span-2 space-y-4">
                {teams.length === 0 ? (
                  <div className="text-center py-10 glass-panel rounded-xl">
                    <p className="text-slate-500">ยังไม่มีทีม กรุณาเพิ่มทีมทางซ้ายมือ</p>
                  </div>
                ) : (
                  teams.map((team, index) => (
                    <div key={team.id} className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                      
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
                        
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums w-16 text-center shrink-0">
                          {team.score}
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
                           {/* ปุ่มลบ */}
                           <div className="flex flex-col gap-1 mr-1 sm:mr-2">
                             <button onClick={() => updateScore(team.id, -customPoint)} className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-bold transition-colors">
                               -{customPoint}
                             </button>
                           </div>
                           
                           {/* ปุ่มบวกแบบด่วน */}
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
                           
                           {/* ปุ่มลบทีม */}
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
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <RefreshCcw className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">ยืนยันการรีเซ็ตคะแนน?</h3>
            <p className="text-slate-500 text-center mb-6">
              การกระทำนี้จะเปลี่ยนคะแนนของทุกทีมให้เป็น 0 คุณไม่สามารถย้อนกลับได้
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
                ยืนยันการรีเซ็ต
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;