import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Medal, Settings, UserPlus, Trash2, Edit2, 
  RefreshCcw, Moon, Sun, Plus, Minus, ArrowLeft, ChevronUp, ChevronDown
} from 'lucide-react';

const App = () => {
  // === State Management ===
  const [teams, setTeams] = useState(() => {
    // โหลดข้อมูลจาก localStorage เมื่อเริ่มต้น
    const saved = localStorage.getItem('bmpn_teams');
    if (saved) {
      return JSON.parse(saved);
    }
    // ข้อมูลเริ่มต้นตัวอย่าง (ถ้าไม่มีข้อมูลใน localStorage)
    return [
      { id: '1', name: 'ประวัติศาสตร์ยุคต้น', score: 120 },
      { id: '2', name: 'สยามประเทศ', score: 150 },
      { id: '3', name: 'นักปราชญ์ล้านนา', score: 95 },
      { id: '4', name: 'อยุธยารุ่งเรือง', score: 110 }
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

  // === Effects ===
  // บันทึกข้อมูลลง localStorage เมื่อ teams เปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('bmpn_teams', JSON.stringify(teams));
  }, [teams]);

  // ซิงค์ข้อมูลข้ามหน้าต่าง (สำหรับกรณีเปิดโหมด Admin จอโน้ตบุ๊ก และเปิด Leaderboard จอโปรเจกเตอร์)
  useEffect(() => {
    const syncAcrossWindows = (e) => {
      // ถ้ามีการเปลี่ยนคะแนนจากหน้าต่างอื่น ให้ดึงข้อมูลใหม่มาแสดงทันที
      if (e.key === 'bmpn_teams' && e.newValue) {
        setTeams(JSON.parse(e.newValue));
      }
      // ถ้ามีการกดสลับโหมดมืด/สว่าง จากหน้าต่างอื่น ให้เปลี่ยนตามด้วย
      if (e.key === 'bmpn_theme') {
        setDarkMode(e.newValue === 'dark');
      }
    };

    window.addEventListener('storage', syncAcrossWindows);
    return () => window.removeEventListener('storage', syncAcrossWindows);
  }, []);

  // จัดการ Dark Mode
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
  // เรียงลำดับคะแนนจากมากไปน้อย
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  // เพิ่มทีมใหม่
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

  // ลบทีม
  const handleDeleteTeam = (id) => {
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบทีมนี้?')) {
      setTeams(teams.filter(t => t.id !== id));
    }
  };

  // เริ่มต้นแก้ไขชื่อทีม
  const startEditing = (team) => {
    setEditingTeam(team.id);
    setEditName(team.name);
  };

  // บันทึกการแก้ไขชื่อทีม
  const saveEditing = () => {
    if (!editName.trim()) {
      setEditingTeam(null);
      return;
    }
    setTeams(teams.map(t => t.id === editingTeam ? { ...t, name: editName.trim() } : t));
    setEditingTeam(null);
  };

  // อัปเดตคะแนน (บวก/ลบ)
  const updateScore = (id, amount) => {
    setTeams(teams.map(t => {
      if (t.id === id) {
        return { ...t, score: t.score + amount };
      }
      return t;
    }));
  };

  // รีเซ็ตคะแนนทั้งหมด
  const confirmReset = () => {
    setTeams(teams.map(t => ({ ...t, score: 0 })));
    setShowResetModal(false);
  };

  // === สไตล์ CSS เพิ่มเติมสำหรับแอนิเมชันและหน้าพิมพ์ ===
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
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        
        {/* =========================================================================
            VIEW 1: PUBLIC LEADERBOARD (เมื่อไม่ได้อยู่ในโหมด Admin)
            ========================================================================= */}
        {!isAdmin && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                กระดานจัดอันดับคะแนน
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                อัปเดตสถานการณ์แบบเรียลไทม์ ร่วมลุ้นและเป็นกำลังใจให้ทุกทีม
              </p>
            </div>

            {/* โครงสร้าง List ที่รองรับ Animation การสลับตำแหน่ง */}
            <div className="relative flex flex-col gap-4">
              {sortedTeams.length === 0 ? (
                <div className="text-center py-10 glass-panel rounded-xl">
                  <p className="text-slate-500">ยังไม่มีทีมในระบบ</p>
                </div>
              ) : (
                sortedTeams.map((team, index) => {
                  // กำหนดสไตล์เริ่มต้นเป็นแบบธรรมดา
                  let rankStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400";
                  let icon = null;
                  
                  // จะเน้นสีสันและมอบไอคอนอันดับ ก็ต่อเมื่อทีมนั้นมีคะแนนมากกว่า 0 แล้วเท่านั้น
                  if (team.score > 0) {
                    if (index === 0) {
                      rankStyle = "bg-gradient-to-r from-yellow-100 to-amber-50 dark:from-yellow-900/40 dark:to-amber-900/20 border-yellow-300 shadow-lg shadow-yellow-500/20 scale-[1.02] z-30";
                      icon = <Trophy className="w-8 h-8 text-yellow-500" />;
                    } else if (index === 1) {
                      rankStyle = "bg-gradient-to-r from-slate-200 to-gray-100 dark:from-slate-700 dark:to-gray-800 border-slate-400 shadow-lg shadow-slate-500/30 scale-[1.01] z-20";
                      icon = <Medal className="w-8 h-8 text-slate-600 dark:text-slate-300 drop-shadow-sm" />;
                    } else if (index === 2) {
                      rankStyle = "bg-gradient-to-r from-orange-100 to-amber-50 dark:from-amber-900/30 dark:to-orange-900/20 border-amber-300 shadow-md z-10";
                      icon = <Medal className="w-8 h-8 text-amber-600" />;
                    }
                  }

                  // ถ้าคะแนนเป็น 0 ให้แสดงเครื่องหมาย - แทนตัวเลข เพื่อแสดงว่าเพิ่งเริ่มต้นและยังไม่จัดอันดับ
                  const rankDisplay = team.score === 0 ? "-" : `#${index + 1}`;

                  return (
                    <div 
                      key={team.id} 
                      className={`relative flex items-center justify-between p-4 md:p-6 rounded-2xl border transition-all duration-500 transform ${rankStyle}`}
                      style={{
                         order: index
                      }}
                    >
                      <div className="flex items-center gap-4 md:gap-6">
                        {/* เลขอันดับ / ไอคอน */}
                        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full glass-panel font-bold text-xl md:text-2xl shadow-inner">
                          {icon ? icon : rankDisplay}
                        </div>
                        
                        {/* ชื่อทีม */}
                        <div>
                          <h3 className={`text-lg md:text-2xl font-bold ${(index < 3 && team.score > 0) ? 'text-slate-800 dark:text-white' : ''}`}>
                            {team.name}
                          </h3>
                        </div>
                      </div>

                      {/* คะแนน */}
                      <div className="text-right">
                        <div className={`text-3xl md:text-5xl font-black tabular-nums tracking-tighter ${
                          team.score === 0 ? 'text-slate-400 dark:text-slate-500' :
                          index === 0 ? 'text-yellow-600 dark:text-yellow-400' : 
                          index === 1 ? 'text-slate-700 dark:text-slate-200' : 
                          index === 2 ? 'text-amber-700 dark:text-amber-500' : 
                          'text-blue-600 dark:text-blue-400'
                        }`}>
                          {team.score.toLocaleString()}
                        </div>
                        <div className="text-xs md:text-sm font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                          คะแนน
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
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
                  // ไม่จัดเรียงในโหมดแอดมิน เพื่อป้องกันปุ่มกระโดดขณะกดคะแนน
                  teams.map((team, index) => (
                    <div key={team.id} className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                      
                      {/* ข้อมูลทีม & แก้ไขชื่อ */}
                      <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        {editingTeam === team.id ? (
                          <div className="flex items-center gap-2 flex-1">
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
                          <div className="flex items-center gap-2 flex-1">
                            <span className="font-bold text-lg">{team.name}</span>
                            <button onClick={() => startEditing(team)} className="text-slate-400 hover:text-blue-500 p-1">
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* ตัวควบคุมคะแนน */}
                      <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                        
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums w-20 text-center">
                          {team.score}
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                           {/* ปุ่มลบ */}
                           <div className="flex flex-col gap-1 mr-2">
                             <button onClick={() => updateScore(team.id, -customPoint)} className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded text-xs font-bold transition-colors">
                               -{customPoint}
                             </button>
                           </div>
                           
                           {/* ปุ่มบวกแบบด่วน */}
                           <button onClick={() => updateScore(team.id, 1)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">
                             +1
                           </button>
                           <button onClick={() => updateScore(team.id, 5)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">
                             +5
                           </button>
                           <button onClick={() => updateScore(team.id, 10)} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">
                             +10
                           </button>
                           <button onClick={() => updateScore(team.id, customPoint)} className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-sm font-bold text-sm transition-transform active:scale-95">
                             +{customPoint}
                           </button>
                           
                           {/* ปุ่มลบทีม */}
                           <button onClick={() => handleDeleteTeam(team.id)} className="ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors" title="ลบทีมนี้">
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
      {/* Reset Confirmation Modal */}
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