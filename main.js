// === EchoScript: Screenwriting Inspiration App ===
const { useState, useEffect, useCallback, useMemo } = React;
const { createRoot } = ReactDOM;

// === 1. 圖示組件 (SVG) ===
const IconBase = ({ d, className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
        {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
    </svg>
);

const Heart = (props) => <IconBase d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" {...props} />;
const Copy = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const BookOpen = (props) => <IconBase d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]} {...props} />;
const X = (props) => <IconBase d={["M18 6 6 18", "M6 6 18 18"]} {...props} />;
const Trash2 = (props) => <IconBase d={["M3 6h18", "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", "M10 11v6", "M14 11v6"]} {...props} />;
const History = (props) => <IconBase d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 6v6l4 2"]} {...props} />;
const Clock = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Calendar = (props) => <IconBase d={["M8 2v4", "M16 2v4", "M3 10h18", "M21 8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"]} {...props} />;
const PenLine = (props) => <IconBase d={["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"]} {...props} />;
const Save = (props) => <IconBase d={["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8"]} {...props} />;
const RefreshCw = (props) => <IconBase d={["M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", "M21 3v5h-5", "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", "M8 16H3v5"]} {...props} />;
const Edit = (props) => <IconBase d={["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"]} {...props} />;
const Download = (props) => <IconBase d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]} {...props} />;
const Upload = (props) => <IconBase d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"]} {...props} />;
const Eye = (props) => <IconBase d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 5c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z", "M12 10c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z"]} {...props} />;
const FileText = (props) => <IconBase d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} {...props} />;

// === 2. 初始編劇筆記資料庫 (可自行擴充) ===
const INITIAL_NOTES = [
    { id: 1, title: "故事結構", subtitle: "三幕劇", section: "第一幕：鋪陳", content: "在第一幕中，必須建立主角的現狀（Normal World），並引入『引發事件』（Inciting Incident），這通常發生在故事的前10-15%。這個事件打破了主角的平衡，迫使他們做出選擇。" },
    { id: 2, title: "人物塑造", subtitle: "角色弧光", section: "內在需求 vs 外在慾望", content: "一個立體的角色通常擁有一個明確的『外在慾望』（Want），例如贏得比賽或復仇；但他們同時有一個隱藏的『內在需求』（Need），通常是他們自己沒意識到的性格缺陷。故事的終點，往往是角色犧牲了慾望，滿足了需求。" },
    { id: 3, title: "對白技巧", subtitle: "潛台詞", section: "不要說出心裡話", content: "優秀的對白是『言不由衷』的。角色很少直接說出他們真正的感受。如果一對情侶在吵架，他們爭論的可能是誰沒洗碗，但潛台詞其實是『我覺得你不夠重視這個家』。" },
    { id: 4, title: "場景設計", subtitle: "進出原則", section: "晚進早出", content: "盡可能晚地進入場景（Late In），在衝突發生前的一刻切入；並盡可能早地離開場景（Early Out），在懸念或衝突最高點結束，不要拖泥帶水地交代結尾。" },
    { id: 5, title: "故事結構", subtitle: "救貓咪", section: "定場畫面", content: "故事的第一個畫面應該暗示整部電影的主題、氛圍和風格。它是一個視覺隱喻，告訴觀眾這是一個什麼樣的故事。" },
    { id: 6, title: "人物塑造", subtitle: "反派", section: "反派是自己故事裡的英雄", content: "不要把反派寫成只會作惡的壞人。在反派的眼裡，他們所做的一切都是合理、必要，甚至是正義的。給他們一個強大的動機，主角的對抗才會有力。" },
    { id: 7, title: "情節推動", subtitle: "轉折點", section: "無路可退", content: "第一幕結束進入第二幕的轉折點（Plot Point 1），主角必須主動做出決定跨越門檻。這個決定必須是不可逆的，他們不能再回頭過原本的生活。" },
    { id: 8, title: "寫作心法", subtitle: "初稿", section: "容許垃圾", content: "海明威說：『初稿都是狗屎。』寫作的重點是『寫完』，而不是寫好。不要邊寫邊修，先把故事從頭到尾寫出來，讓它存在，然後再像雕刻一樣慢慢修正。" },
    { id: 9, title: "對白技巧", subtitle: "展現而非告知", section: "Show, Don't Tell", content: "與其讓角色說『我很生氣』，不如讓他用力摔門，或是手顫抖著點不著煙。用動作和視覺細節來傳達情緒，永遠比對白更有力。" },
    { id: 10, title: "故事結構", subtitle: "英雄旅程", section: "拒絕召喚", content: "當冒險的召喚來臨時，英雄通常會先拒絕。這展現了他們對未知的恐懼，也讓他們隨後的接受變得更加勇敢且有意義。" },
];

// === 3. 錯誤邊界組件 ===
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) return <div className="p-8 text-center text-red-600">發生錯誤，請重新整理頁面。</div>;
    return this.props.children; 
  }
}

// === 4. 實用函數 ===
const formatDateTime = (dateInput) => {
    if (!dateInput) return "";
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return "";
        return new Intl.DateTimeFormat('zh-TW', {
            year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
        }).format(date);
    } catch (e) { return ""; }
};

// === 5. 編輯筆記視窗 (修改筆記內容) ===
const EditNoteModal = ({ note, onClose, onSave }) => {
    const [editedContent, setEditedContent] = useState(note.content);
    
    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-200" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white w-full max-w-lg h-[85%] sm:h-auto sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col">
                <nav className="flex justify-between items-center p-4 border-b border-gray-100">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 px-2">取消</button>
                    <h3 className="font-bold text-gray-800">修改筆記內容</h3>
                    <button onClick={() => onSave(note.id, editedContent)} className="bg-stone-800 text-white px-4 py-1.5 rounded-full text-sm font-bold">儲存</button>
                </nav>
                <div className="p-6 flex-col flex flex-1 overflow-y-auto">
                    <div className="mb-4 text-sm text-gray-400">
                        <span className="font-bold text-stone-600">{note.title}</span> / {note.subtitle} / {note.section}
                    </div>
                    <label className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">原始文本內容</label>
                    <textarea 
                        className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-lg leading-relaxed focus:ring-2 focus:ring-stone-400 focus:bg-white transition-all outline-none resize-none"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <p className="text-xs text-stone-500 mt-2 text-center">這將會永久修改此卡片在您裝置上的內容。</p>
                </div>
            </div>
        </div>
    );
};

// === 6. 編輯回應視窗 (撰寫日記) ===
const ResponseModal = ({ note, initialResponse, onClose, onSave }) => {
    const [response, setResponse] = useState(initialResponse);
    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-200" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
            <div className="bg-white w-full max-w-lg h-[60%] sm:h-auto rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col">
                <nav className="flex justify-between items-center p-4 border-b border-gray-100">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 px-2">取消</button>
                    <h3 className="font-bold text-gray-800">我的回應</h3>
                    <button onClick={() => onSave(response)} className="bg-stone-800 text-white px-4 py-1.5 rounded-full text-sm font-bold">完成</button>
                </nav>
                <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-100">
                         <p className="text-sm text-stone-500 truncate">{note.content}</p>
                    </div>
                    <textarea 
                        className="flex-1 w-full bg-white p-2 text-gray-700 text-base leading-relaxed outline-none resize-none placeholder-gray-300"
                        placeholder="寫下你的靈感或應用..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};


// === 主程式 ===
function EchoScriptApp() {
    const [notes, setNotes] = useState(INITIAL_NOTES);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // 用戶資料狀態
    const [favorites, setFavorites] = useState([]); // 收藏 (包含回應)
    const [history, setHistory] = useState([]);
    const [recentIndices, setRecentIndices] = useState([]);
    const [userModifiedNotes, setUserModifiedNotes] = useState({}); // 格式: { noteId: "new content" }

    // UI 狀態
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [activeTab, setActiveTab] = useState('favorites');
    const [showEditNoteModal, setShowEditNoteModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [notification, setNotification] = useState(null);

    // 手勢狀態
    const [touchStart, setTouchStart] = useState(null);
    const [touchCurrent, setTouchCurrent] = useState(null);

    // 1. 初始化資料載入
    useEffect(() => {
        try {
            const savedFavs = JSON.parse(localStorage.getItem('echoScript_Favorites') || '[]');
            const savedHistory = JSON.parse(localStorage.getItem('echoScript_History') || '[]');
            const savedRecents = JSON.parse(localStorage.getItem('echoScript_Recents') || '[]');
            const savedMods = JSON.parse(localStorage.getItem('echoScript_UserMods') || '{}');

            setFavorites(savedFavs);
            setHistory(savedHistory);
            setRecentIndices(savedRecents);
            setUserModifiedNotes(savedMods);

            // 合併使用者修改過的筆記
            const mergedNotes = INITIAL_NOTES.map(note => ({
                ...note,
                content: savedMods[note.id] || note.content
            }));
            setNotes(mergedNotes);

            // 隨機選一個初始筆記
            let initialIndex = 0;
            let attempts = 0;
            do {
                initialIndex = Math.floor(Math.random() * mergedNotes.length);
                attempts++;
            } while (savedRecents.includes(initialIndex) && attempts < 50);

            setCurrentIndex(initialIndex);
            
            // 加入歷史
            const initialNote = mergedNotes[initialIndex];
            const historyEntry = { ...initialNote, timestamp: new Date().toISOString(), displayId: Date.now() };
            setHistory(prev => [historyEntry, ...prev].slice(0, 50));

        } catch (e) {
            console.error("Init failed", e);
        }
    }, []);

    // 2. 自動存檔
    useEffect(() => { localStorage.setItem('echoScript_Favorites', JSON.stringify(favorites)); }, [favorites]);
    useEffect(() => { localStorage.setItem('echoScript_History', JSON.stringify(history)); }, [history]);
    useEffect(() => { localStorage.setItem('echoScript_Recents', JSON.stringify(recentIndices)); }, [recentIndices]);
    useEffect(() => { localStorage.setItem('echoScript_UserMods', JSON.stringify(userModifiedNotes)); }, [userModifiedNotes]);

    const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

    const currentNote = notes[currentIndex];
    const currentFav = favorites.find(f => f.id === (currentNote ? currentNote.id : null));
    const isFavorite = !!currentFav;

    // --- 核心操作 ---

    const handleNextNote = () => {
        setIsAnimating(true);
        setTimeout(() => {
            let newIndex; 
            let attempts = 0;
            do { 
                newIndex = Math.floor(Math.random() * notes.length); 
                attempts++; 
            } while ((newIndex === currentIndex || recentIndices.includes(newIndex)) && attempts < 50);

            setRecentIndices(prev => {
                const updated = [newIndex, ...prev];
                if (updated.length > 20) updated.pop();
                return updated;
            });

            setCurrentIndex(newIndex);
            
            // 加入歷史
            const newNote = notes[newIndex];
            const historyEntry = { ...newNote, timestamp: new Date().toISOString(), displayId: Date.now() };
            setHistory(prev => [historyEntry, ...prev].slice(0, 50));
            
            setIsAnimating(false);
            window.scrollTo(0,0);
        }, 300);
    };

    const handleEditNoteSave = (id, newContent) => {
        // 1. 更新本地修改紀錄
        const updatedMods = { ...userModifiedNotes, [id]: newContent };
        setUserModifiedNotes(updatedMods);
        
        // 2. 更新當前記憶體中的 Notes
        const updatedNotes = notes.map(n => n.id === id ? { ...n, content: newContent } : n);
        setNotes(updatedNotes);

        // 3. 如果這則筆記在收藏中，也要同步更新收藏的內容顯示嗎？
        // 策略：收藏通常是 snapshot，但因為是筆記工具，同步更新比較符合邏輯
        setFavorites(prev => prev.map(f => f.id === id ? { ...f, content: newContent } : f));
        setHistory(prev => prev.map(h => h.id === id ? { ...h, content: newContent } : h));

        setShowEditNoteModal(false);
        showNotification("筆記內容已修改");
    };

    const handleResponseSave = (responseText) => {
        const entry = {
            ...currentNote,
            journalEntry: responseText,
            timestamp: new Date().toISOString()
        };

        setFavorites(prev => {
            const existingIdx = prev.findIndex(f => f.id === currentNote.id);
            if (existingIdx > -1) {
                // 更新現有收藏
                const newList = [...prev];
                newList[existingIdx] = entry;
                return newList;
            } else {
                // 新增收藏
                return [entry, ...prev];
            }
        });
        setShowResponseModal(false);
        showNotification("回應已儲存至收藏");
    };

    const handleToggleFavorite = () => {
        if (isFavorite) {
            setFavorites(prev => prev.filter(f => f.id !== currentNote.id));
            showNotification("已移除收藏");
        } else {
            // 加入空回應的收藏
            handleResponseSave("");
        }
    };

    const handleCopyMarkdown = () => {
        if (!currentNote) return;
        const md = `# ${currentNote.title}\n## ${currentNote.subtitle} - ${currentNote.section}\n\n${currentNote.content}\n\n> 來自 EchoScript 編劇靈感庫`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(md).then(() => showNotification("已複製 Markdown")).catch(() => showNotification("複製失敗"));
        }
    };

    // --- 備份還原 ---
    const handleBackup = () => {
        const data = { favorites, userModifiedNotes, history, version: "EchoScript_v1", date: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EchoScript_Backup_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleRestore = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (data.favorites) setFavorites(data.favorites);
                if (data.history) setHistory(data.history);
                if (data.userModifiedNotes) {
                    setUserModifiedNotes(data.userModifiedNotes);
                    // 重新合併筆記
                    const merged = INITIAL_NOTES.map(n => ({ ...n, content: data.userModifiedNotes[n.id] || n.content }));
                    setNotes(merged);
                }
                showNotification("還原成功！");
            } catch (err) { showNotification("檔案格式錯誤"); }
        };
        reader.readAsText(file);
    };

    // --- 手勢 ---
    const onTouchStart = (e) => { setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY }); };
    const onTouchMove = (e) => { setTouchCurrent({ x: e.touches[0].clientX, y: e.touches[0].clientY }); };
    const onTouchEnd = () => {
        if (!touchStart || !touchCurrent) return;
        const dx = touchStart.x - touchCurrent.x;
        const dy = touchCurrent.y - touchStart.y;
        if (Math.abs(dx) > Math.abs(dy) && dx > 50) handleNextNote(); // 左滑
        if (Math.abs(dy) > Math.abs(dx) && dy > 100 && window.scrollY === 0) handleNextNote(); // 下拉
        setTouchStart(null); setTouchCurrent(null);
    };

    // --- 渲染組件 ---
    
    // 列表項目
    const NoteListItem = ({ item, isHistory }) => (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3" onClick={() => {
            // 如果從列表點擊，切換首頁顯示該卡片
            const idx = notes.findIndex(n => n.id === item.id);
            if(idx !== -1) {
                setCurrentIndex(idx);
                setShowMenuModal(false);
                window.scrollTo(0,0);
            }
        }}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded">{item.title}</span>
                    <span className="text-xs text-gray-400 ml-2">{item.subtitle}</span>
                </div>
                {!isHistory && (
                    <button onClick={(e) => { e.stopPropagation(); handleEditNoteSave(item.id, item.content); }} className="text-gray-300">
                        {/* 這裡可以放刪除邏輯，暫略 */}
                    </button>
                )}
            </div>
            <h4 className="font-bold text-gray-800 mb-1">{item.section}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
            {item.journalEntry && (
                <div className="mt-3 pt-2 border-t border-gray-50">
                    <p className="text-xs text-stone-500 font-bold flex items-center gap-1"><PenLine className="w-3 h-3"/> 我的回應</p>
                    <p className="text-xs text-gray-500 italic mt-1">{item.journalEntry}</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 font-sans pb-20">
            {/* 上方導航 */}
            <nav className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-stone-200/50">
                <div className="flex items-center gap-2">
                    <div className="bg-stone-800 text-white p-1 rounded-lg">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-stone-800">EchoScript</h1>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleNextNote} disabled={isAnimating} className="bg-stone-800 text-stone-50 px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-stone-300 active:scale-95 transition-transform flex items-center gap-2">
                        <RefreshCw className={`w-3 h-3 ${isAnimating ? 'animate-spin' : ''}`}/> 下一張
                    </button>
                    <button onClick={() => setShowMenuModal(true)} className="bg-white border border-stone-200 text-stone-600 p-2 rounded-full shadow-sm active:bg-stone-100">
                        <BookOpen className="w-5 h-5" />
                    </button>
                </div>
            </nav>

            {/* 主卡片區 */}
            <main className="px-6 py-6 max-w-lg mx-auto" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                {currentNote ? (
                    <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        {/* 索引卡片樣式 */}
                        <div className="bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden relative min-h-[400px] flex flex-col">
                            {/* 卡片頭部線條裝飾 */}
                            <div className="h-2 bg-stone-800 w-full"></div>
                            <div className="p-8 flex-1 flex flex-col">
                                {/* 標題區 */}
                                <div className="mb-6 border-b border-stone-100 pb-4">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h2 className="text-sm font-bold text-stone-400 tracking-widest uppercase">{currentNote.title}</h2>
                                        <span className="text-xs text-stone-300 font-serif">#{currentNote.id.toString().padStart(3, '0')}</span>
                                    </div>
                                    <h3 className="text-xl font-serif text-stone-600 italic">{currentNote.subtitle}</h3>
                                </div>
                                
                                {/* 內容區 */}
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-stone-900 mb-4">{currentNote.section}</h1>
                                    <div className="text-lg leading-loose text-stone-700 font-serif text-justify">
                                        {currentNote.content}
                                    </div>
                                </div>
                            </div>

                            {/* 卡片底部操作區 */}
                            <div className="bg-stone-50 px-6 py-4 border-t border-stone-100 flex justify-between items-center">
                                <button onClick={() => setShowEditNoteModal(true)} className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-800 transition-colors">
                                    <Edit className="w-5 h-5" />
                                    <span className="text-[10px] font-bold">修改筆記</span>
                                </button>
                                
                                <button onClick={() => setShowResponseModal(true)} className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-800 transition-colors group">
                                    <div className={`p-3 rounded-full ${isFavorite ? 'bg-stone-800 text-white shadow-lg' : 'bg-white border border-stone-200'} transition-all group-active:scale-95`}>
                                        <PenLine className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold">回應/收藏</span>
                                </button>

                                <button onClick={handleCopyMarkdown} className="flex flex-col items-center gap-1 text-stone-400 hover:text-stone-800 transition-colors">
                                    <Copy className="w-5 h-5" />
                                    <span className="text-[10px] font-bold">複製 MD</span>
                                </button>
                            </div>
                        </div>

                        {/* 如果有回應，顯示在下方 */}
                        {isFavorite && currentFav?.journalEntry && (
                            <div className="mt-6 ml-4 border-l-2 border-stone-300 pl-4 animate-in fade-in slide-in-from-bottom-2">
                                <p className="text-xs font-bold text-stone-400 mb-1">MY NOTE</p>
                                <p className="text-stone-600 italic">{currentFav.journalEntry}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800"></div></div>
                )}
            </main>

            {/* Modal: 選單 (收藏/歷史/備份) */}
            {showMenuModal && (
                <div className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm flex justify-end" onClick={(e) => { if(e.target === e.currentTarget) setShowMenuModal(false); }}>
                    <div className="w-full max-w-sm bg-stone-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-5 border-b border-stone-200 bg-white flex justify-between items-center">
                            <h2 className="font-bold text-lg">我的資料庫</h2>
                            <button onClick={() => setShowMenuModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>
                        <div className="flex p-2 gap-2 bg-white border-b border-stone-100">
                            {['favorites', 'history', 'settings'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${activeTab === tab ? 'bg-stone-800 text-white' : 'text-stone-500 hover:bg-stone-100'}`}>
                                    {tab === 'favorites' ? '收藏筆記' : tab === 'history' ? '歷史紀錄' : '備份設定'}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {activeTab === 'favorites' && favorites.map(item => <NoteListItem key={item.id} item={item} />)}
                            {activeTab === 'favorites' && favorites.length === 0 && <div className="text-center text-gray-400 mt-10 text-sm">暫無收藏</div>}
                            
                            {activeTab === 'history' && history.map((item, i) => <NoteListItem key={i} item={item} isHistory />)}
                            
                            {activeTab === 'settings' && (
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl border border-stone-200">
                                        <h3 className="font-bold mb-2 flex items-center gap-2"><Download className="w-4 h-4"/> 匯出資料</h3>
                                        <p className="text-xs text-gray-500 mb-3">將您修改過的筆記內容與回應日記下載備份。</p>
                                        <button onClick={handleBackup} className="w-full bg-stone-100 text-stone-800 text-sm font-bold py-2 rounded-lg border border-stone-200">下載 JSON</button>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-stone-200">
                                        <h3 className="font-bold mb-2 flex items-center gap-2"><Upload className="w-4 h-4"/> 匯入資料</h3>
                                        <label className="block w-full bg-stone-800 text-white text-center text-sm font-bold py-2 rounded-lg cursor-pointer">
                                            選擇檔案
                                            <input type="file" accept=".json" className="hidden" onChange={handleRestore} />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: 編輯筆記內容 */}
            {showEditNoteModal && currentNote && (
                <EditNoteModal 
                    note={currentNote} 
                    onClose={() => setShowEditNoteModal(false)} 
                    onSave={handleEditNoteSave} 
                />
            )}

            {/* Modal: 回應筆記 */}
            {showResponseModal && currentNote && (
                <ResponseModal 
                    note={currentNote} 
                    initialResponse={isFavorite ? currentFav.journalEntry : ""}
                    onClose={() => setShowResponseModal(false)}
                    onSave={handleResponseSave}
                />
            )}

            {/* 通知 Toast */}
            {notification && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2 z-50">
                    {notification}
                </div>
            )}
        </div>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><EchoScriptApp /></ErrorBoundary>);