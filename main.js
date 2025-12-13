// === EchoScript v2.2: 完整修復版 (包含分類顯示與防白畫面) ===
const { useState, useEffect, useRef, useCallback, useMemo } = React;
const { createRoot } = ReactDOM;

// === 1. 圖示組件庫 ===
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
const PenLine = (props) => <IconBase d={["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"]} {...props} />;
const Save = (props) => <IconBase d={["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8"]} {...props} />;
const RefreshCw = (props) => <IconBase d={["M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", "M21 3v5h-5", "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", "M8 16H3v5"]} {...props} />;
const Edit = (props) => <IconBase d={["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"]} {...props} />;
const Download = (props) => <IconBase d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M7 10l5 5 5-5", "M12 15V3"]} {...props} />;
const Upload = (props) => <IconBase d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"]} {...props} />;
const FileText = (props) => <IconBase d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"]} {...props} />;
const Plus = (props) => <IconBase d={["M12 5v14", "M5 12h14"]} {...props} />;
const List = (props) => <IconBase d={["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]} {...props} />;
const Bold = (props) => <IconBase d={["M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z", "M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"]} {...props} />;
// 新增清晰的 H1, H2, 與內文(T) 圖示
const Heading1 = (props) => <IconBase d={["M4 12h8", "M4 18V6", "M12 18V6", "M17 12l-2-2v8"]} {...props} />;
const Heading2 = (props) => <IconBase d={["M4 12h8", "M4 18V6", "M12 18V6", "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"]} {...props} />;
const Type = (props) => <IconBase d={["M4 7V4h16v3", "M9 20h6", "M12 4v16"]} {...props} />;
const Quote = (props) => <IconBase d={["M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z", "M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"]} {...props} />;


// === 2. 初始編劇筆記資料庫 (確保有完整分類) ===
const INITIAL_NOTES = [
    { id: 1, category: "故事結構", subcategory: "三幕劇", title: "第一幕：鋪陳", content: "在第一幕中，必須建立主角的現狀（Normal World），並引入『引發事件』（Inciting Incident），這通常發生在故事的前10-15%。這個事件打破了主角的平衡，迫使他們做出選擇。" },
    { id: 2, category: "人物塑造", subcategory: "角色弧光", title: "內在需求 vs 外在慾望", content: "一個立體的角色通常擁有一個明確的『外在慾望』（Want），例如贏得比賽或復仇；但他們同時有一個隱藏的『內在需求』（Need），通常是他們自己沒意識到的性格缺陷。故事的終點，往往是角色犧牲了慾望，滿足了需求。" },
    { id: 3, category: "對白技巧", subcategory: "潛台詞", title: "不要說出心裡話", content: "優秀的對白是『言不由衷』的。角色很少直接說出他們真正的感受。如果一對情侶在吵架，他們爭論的可能是誰沒洗碗，但潛台詞其實是『我覺得你不夠重視這個家』。" },
    { id: 4, category: "場景設計", subcategory: "進出原則", title: "晚進早出", content: "盡可能晚地進入場景（Late In），在衝突發生前的一刻切入；並盡可能早地離開場景（Early Out），在懸念或衝突最高點結束，不要拖泥帶水地交代結尾。" },
    { id: 5, category: "故事結構", subcategory: "救貓咪", title: "定場畫面", content: "故事的第一個畫面應該暗示整部電影的主題、氛圍和風格。它是一個視覺隱喻，告訴觀眾這是一個什麼樣的故事。" },
    { id: 6, category: "人物塑造", subcategory: "反派", title: "反派是自己故事裡的英雄", content: "不要把反派寫成只會作惡的壞人。在反派的眼裡，他們所做的一切都是合理、必要，甚至是正義的。給他們一個強大的動機，主角的對抗才會有力。" },
    { id: 7, category: "情節推動", subcategory: "轉折點", title: "無路可退", content: "第一幕結束進入第二幕的轉折點（Plot Point 1），主角必須主動做出決定跨越門檻。這個決定必須是不可逆的，他們不能再回頭過原本的生活。" },
    { id: 8, category: "寫作心法", subcategory: "初稿", title: "容許垃圾", content: "海明威說：『初稿都是狗屎。』寫作的重點是『寫完』，而不是寫好。不要邊寫邊修，先把故事從頭到尾寫出來，讓它存在，然後再像雕刻一樣慢慢修正。" },
    { id: 9, category: "對白技巧", subcategory: "展現而非告知", title: "Show, Don't Tell", content: "與其讓角色說『我很生氣』，不如讓他用力摔門，或是手顫抖著點不著煙。用動作和視覺細節來傳達情緒，永遠比對白更有力。" },
    { id: 10, category: "故事結構", subcategory: "英雄旅程", title: "拒絕召喚", content: "當冒險的召喚來臨時，英雄通常會先拒絕。這展現了他們對未知的恐懼，也讓他們隨後的接受變得更加勇敢且有意義。" },
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

// === 4. Markdown 編輯器組件 ===
// 修改 1: 加入 existingNotes 參數
// === 新增：Combobox 合體輸入元件 (解決分類被過濾問題) ===
// === 新增：Markdown 渲染器元件 (顯示預覽用) ===
const MarkdownRenderer = ({ content }) => {
    const parseInline = (text) => {
        const parts = text.split(/(\*\*.*?\*\*|~~.*?~~)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="text-stone-900 font-extrabold">{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('~~') && part.endsWith('~~')) {
                return <del key={index} className="text-stone-400">{part.slice(2, -2)}</del>;
            }
            return part;
        });
    };

    return (
        <div className="text-lg leading-loose text-stone-700 font-serif text-justify whitespace-pre-wrap">
            {content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-5 mb-3 text-stone-900">{parseInline(line.slice(2))}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2 text-stone-600">{parseInline(line.slice(3))}</h2>;
                if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-stone-300 pl-4 italic text-stone-500 my-2">{parseInline(line.slice(2))}</blockquote>;
                return <p key={i} className="mb-2 min-h-[1em]">{parseInline(line)}</p>;
            })}
        </div>
    );
};

// === Combobox 合體輸入元件 ===
const Combobox = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <input 
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 pr-8"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsOpen(true)} 
                />
                <button 
                    className="absolute right-0 top-0 h-full px-3 text-stone-400 hover:text-stone-600 flex items-center justify-center"
                    onClick={() => setIsOpen(!isOpen)}
                    tabIndex="-1"
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
            </div>
            
            {isOpen && options.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-stone-200 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50 mt-1 animate-in fade-in duration-100">
                    {options.map(opt => (
                        <div 
                            key={opt} 
                            className="px-4 py-2 hover:bg-stone-100 cursor-pointer text-sm text-stone-700 border-b border-stone-50 last:border-0"
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// === 新增：HighlightingEditor (支援編輯時高亮的編輯器) ===
// === 修改後：HighlightingEditor (修復游標錯位版) ===
const HighlightingEditor = ({ value, onChange, textareaRef }) => {
    // 這個函式負責把 markdown 語法轉成有顏色的 HTML (僅供顯示用)
    const renderHighlights = (text) => {
        // 防止最後一行換行失效，強制補一個空白
        const textToRender = text.endsWith('\n') ? text + ' ' : text;
        
        return textToRender.split('\n').map((line, i) => {
            // 關鍵修改：確保每一行的基礎高度一致，不要隨意改變 text size
            let className = "min-h-[1.5em] ";
            let content = line;

            // 處理標題：改為「變色 + 加粗」，但保持「字體大小一致」以維持游標對齊
            if (line.startsWith('# ')) {
                className += "font-black text-stone-900 bg-stone-100/50"; // 使用極粗體和底色來強調
            } else if (line.startsWith('## ')) {
                className += "font-bold text-stone-800 bg-stone-50/50"; // 使用粗體來強調
            } else if (line.startsWith('> ')) {
                className += "italic text-stone-400 border-l-4 border-stone-300 pl-2";
            } else {
                className += "text-gray-800"; // 一般文字顏色
            }

            // 簡單處理行內的粗體 (將 **text** 包在 span 裡)
            const parts = content.split(/(\*\*.*?\*\*|~~.*?~~)/g);
            const renderedLine = parts.map((part, idx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <span key={idx} className="font-bold text-stone-900 bg-yellow-100/50 rounded px-0.5">{part}</span>;
                }
                if (part.startsWith('~~') && part.endsWith('~~')) {
                    return <span key={idx} className="line-through text-stone-400">{part}</span>;
                }
                return part;
            });

            return <div key={i} className={className}>{renderedLine}</div>;
        });
    };

    const syncScroll = (e) => {
        const backdrop = e.target.previousSibling;
        if(backdrop) backdrop.scrollTop = e.target.scrollTop;
    };

    return (
        <div className="relative flex-1 w-full border border-stone-200 rounded-lg overflow-hidden bg-white h-full">
            {/* 底層：負責顯示樣式 (Backdrop) */}
            <div 
                className="absolute inset-0 p-3 pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
                style={{ fontFamily: 'inherit', lineHeight: '1.6', fontSize: '1rem' }}
            >
                {renderHighlights(value)}
            </div>

            {/* 上層：負責輸入 (Transparent Textarea) */}
            <textarea
                ref={textareaRef}
                className="absolute inset-0 w-full h-full p-3 bg-transparent text-transparent caret-stone-800 resize-none outline-none whitespace-pre-wrap break-words overflow-y-auto"
                style={{ fontFamily: 'inherit', lineHeight: '1.6', fontSize: '1rem' }}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={syncScroll}
                placeholder="在此輸入內容... 支援 Markdown"
                spellCheck="false" 
            />
        </div>
    );
};

// === 4. Markdown 編輯器組件 (整合高亮編輯器) ===
// 修改：加入 setHasUnsavedChanges 參數，並監聽內容變更
const MarkdownEditorModal = ({ note, existingNotes = [], isNew = false, onClose, onSave, onDelete, setHasUnsavedChanges }) => {
    const [formData, setFormData] = useState({
        category: note?.category || "",
        subcategory: note?.subcategory || "",
        title: note?.title || "",
        content: note?.content || ""
    });

    const [activeTab, setActiveTab] = useState('write'); 

    // 新增：監聽內容變更，同步狀態給主程式 (給手機返回鍵使用)
    useEffect(() => {
        const initialCategory = note?.category || "";
        const initialSubcategory = note?.subcategory || "";
        const initialTitle = note?.title || "";
        const initialContent = note?.content || "";

        const hasChanges = 
            formData.category !== initialCategory ||
            formData.subcategory !== initialSubcategory ||
            formData.title !== initialTitle ||
            formData.content !== initialContent;
            
        // 如果 setHasUnsavedChanges 存在才執行 (防止報錯)
        if (setHasUnsavedChanges) setHasUnsavedChanges(hasChanges);

        // 卸載時重置狀態
        return () => { if (setHasUnsavedChanges) setHasUnsavedChanges(false); };
    }, [formData, note, setHasUnsavedChanges]);

    const existingCategories = useMemo(() => {
        return [...new Set(existingNotes.map(n => n.category).filter(Boolean))];
    }, [existingNotes]);

    const existingSubcategories = useMemo(() => {
        if (!formData.category) return []; 
        return [...new Set(existingNotes
            .filter(n => n.category === formData.category)
            .map(n => n.subcategory)
            .filter(Boolean)
        )];
    }, [existingNotes, formData.category]);

    const contentRef = useRef(null);

    const insertMarkdown = (syntax) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const text = formData.content;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        let newText = "";
        let newCursorPos = 0;

        if (syntax === "bold") {
            const selectedText = text.substring(start, end);
            newText = text.substring(0, start) + "**" + selectedText + "**" + text.substring(end);
            newCursorPos = end + 4; 
        } else {
            const lineStart = text.lastIndexOf('\n', start - 1) + 1;
            let lineEnd = text.indexOf('\n', start);
            if (lineEnd === -1) lineEnd = text.length; 

            const lineContent = text.substring(lineStart, lineEnd);
            const cleanContent = lineContent.replace(/^(\#+\s|>\s)/, '');

            let prefix = "";
            if (syntax === "h1") prefix = "# ";
            if (syntax === "h2") prefix = "## ";
            if (syntax === "quote") prefix = "> ";

            newText = text.substring(0, lineStart) + prefix + cleanContent + text.substring(lineEnd);
            newCursorPos = lineStart + prefix.length + cleanContent.length;
        }

        setFormData({ ...formData, content: newText });
        setTimeout(() => { 
            textarea.focus(); 
            textarea.setSelectionRange(newCursorPos, newCursorPos); 
        }, 10);
    };

    const handleSave = () => {
        if (!formData.title || !formData.content) { alert("請至少填寫標題和內容"); return; }
        onSave({ ...note, ...formData, id: note?.id || Date.now() });
    };

    // 內部的關閉按鈕邏輯 (備用，主要依賴主程式的攔截)
    const handleClose = () => {
        const initialCategory = note?.category || "";
        const initialSubcategory = note?.subcategory || "";
        const initialTitle = note?.title || "";
        const initialContent = note?.content || "";

        const hasChanges = 
            formData.category !== initialCategory ||
            formData.subcategory !== initialSubcategory ||
            formData.title !== initialTitle ||
            formData.content !== initialContent;

        if (hasChanges) {
            if (confirm("編輯內容還未存檔，是否離開？")) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => { if(e.target === e.currentTarget) handleClose(); }}>
            <div className="absolute top-6 bottom-6 left-4 right-4 mx-auto max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <nav className="flex justify-between items-center p-4 border-b border-gray-100">
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 px-2">取消</button>
                    <h3 className="font-bold text-gray-800">{isNew ? "新增筆記" : "修改筆記"}</h3>
                    <button onClick={handleSave} className="bg-stone-800 text-white px-4 py-1.5 rounded-full text-sm font-bold">儲存</button>
                </nav>
                
                {/* 主內容區：鎖定捲動 (Overflow Hidden) */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    
                    {/* 上方區塊：分類與標題 (固定不捲動) */}
                    <div className="p-4 pb-2 shrink-0 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Combobox 
                                placeholder="大分類 (如:故事結構)"
                                value={formData.category}
                                onChange={(val) => setFormData(prev => ({...prev, category: val}))}
                                options={existingCategories}
                            />
                            <Combobox 
                                placeholder="次分類 (如:三幕劇)"
                                value={formData.subcategory}
                                onChange={(val) => setFormData(prev => ({...prev, subcategory: val}))}
                                options={existingSubcategories}
                            />
                        </div>

                        <input 
                            placeholder="主旨語 (必填，如：先讓英雄救貓咪)"
                            className="bg-stone-50 border border-stone-200 rounded-lg p-3 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-stone-400"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    {/* 中間區塊：工具列 (固定不捲動) */}
                    <div className="px-4 py-2 shrink-0 border-b border-stone-100 flex justify-between items-center bg-white">
                        <div className="flex gap-1 overflow-x-auto no-scrollbar">
                            <button onClick={() => insertMarkdown('normal')} className="p-2 hover:bg-stone-100 rounded text-stone-600 flex items-center gap-1 text-xs font-bold min-w-fit" title="內文"><Type className="w-4 h-4"/> 內文</button>
                            <button onClick={() => insertMarkdown('h1')} className="p-2 hover:bg-stone-100 rounded text-stone-600 flex items-center gap-1 text-xs font-bold min-w-fit" title="大標"><Heading1 className="w-5 h-5"/> 大標</button>
                            <button onClick={() => insertMarkdown('h2')} className="p-2 hover:bg-stone-100 rounded text-stone-600 flex items-center gap-1 text-xs font-bold min-w-fit" title="小標"><Heading2 className="w-5 h-5"/> 小標</button>
                            <button onClick={() => insertMarkdown('bold')} className="p-2 hover:bg-stone-100 rounded text-stone-600 flex items-center gap-1 text-xs font-bold min-w-fit" title="粗體"><Bold className="w-4 h-4"/> 粗體</button>
                            <button onClick={() => insertMarkdown('quote')} className="p-2 hover:bg-stone-100 rounded text-stone-600 flex items-center gap-1 text-xs font-bold min-w-fit" title="引用"><Quote className="w-4 h-4"/> 引用</button>
                        </div>
                        <div className="flex gap-1 text-xs font-bold shrink-0 ml-2">
                             <button onClick={() => setActiveTab('write')} className={`px-2 py-1 rounded ${activeTab === 'write' ? 'bg-stone-200 text-stone-800' : 'text-stone-400'}`}>編輯</button>
                             <button onClick={() => setActiveTab('preview')} className={`px-2 py-1 rounded ${activeTab === 'preview' ? 'bg-stone-200 text-stone-800' : 'text-stone-400'}`}>預覽</button>
                        </div>
                    </div>

                    {/* 下方區塊：編輯器 (唯一可捲動區域) */}
                    <div className="flex-1 overflow-hidden px-4 pb-4 flex flex-col">
                        {activeTab === 'write' ? (
                            <HighlightingEditor 
                                value={formData.content} 
                                onChange={(val) => setFormData({...formData, content: val})} 
                                textareaRef={contentRef}
                            />
                        ) : (
                            <div className="flex-1 w-full bg-stone-50 p-4 rounded-lg border border-stone-200 overflow-y-auto">
                                <MarkdownRenderer content={formData.content || "（尚未輸入內容）"} />
                            </div>
                        )}
                    </div>
                </div>

                {/* 底部刪除按鈕區 (僅在修改模式顯示) */}
                {!isNew && (
                    <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50 rounded-b-2xl">
                        <button onClick={onDelete} className="text-stone-400 hover:text-stone-600 flex items-center gap-2 text-xs font-bold transition-colors">
                            <Trash2 className="w-4 h-4" /> 刪除筆記
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// === 5. 回應編輯視窗 ===
// 修改：接收 viewMode 與 setHasUnsavedChanges
const ResponseModal = ({ note, responses = [], onClose, onSave, onDelete, viewMode, setViewMode, setHasUnsavedChanges }) => {
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const [originalText, setOriginalText] = useState("");

    // 新增：監聽內容變更，回報給主程式
    useEffect(() => {
        const isDirty = viewMode === 'edit' && editText !== originalText;
        if (setHasUnsavedChanges) setHasUnsavedChanges(isDirty);
        return () => { if (setHasUnsavedChanges) setHasUnsavedChanges(false); };
    }, [editText, originalText, viewMode, setHasUnsavedChanges]);

    const handleEdit = (responseItem) => {
        setEditingId(responseItem.id);
        setEditText(responseItem.text);
        setOriginalText(responseItem.text); 
        if (setViewMode) setViewMode('edit');
    };

    const handleNew = () => {
        setEditingId(null);
        setEditText("");
        setOriginalText(""); 
        if (setViewMode) setViewMode('edit');
    };

    const handleSaveCurrent = () => {
        if (!editText.trim()) return;
        onSave(editText, editingId);
        // 儲存後自動切回列表
        if (setViewMode) setViewMode('list');
    };

    // 內部的檢查邏輯 (點擊背景或按鈕時使用)
    const handleCheckUnsaved = (action) => {
        if (viewMode === 'edit' && editText !== originalText) {
            if (confirm("編輯內容還未存檔，是否離開？")) {
                action();
            }
        } else {
            action();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 animate-in fade-in duration-200" onClick={(e) => { if(e.target === e.currentTarget) handleCheckUnsaved(onClose); }}>
            <div className="bg-white w-full max-w-lg h-[70%] sm:h-auto rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <nav className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
                    {viewMode === 'list' ? (
                        <>
                            <button onClick={() => handleCheckUnsaved(onClose)} className="text-gray-500 hover:text-gray-800 px-2">關閉</button>
                            <h3 className="font-bold text-gray-800">回應列表 ({responses.length})</h3>
                            <div className="w-8"></div>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleCheckUnsaved(() => setViewMode('list'))} className="text-gray-500 hover:text-gray-800 px-2">返回</button>
                            <h3 className="font-bold text-gray-800">{editingId ? "修改回應" : "新增回應"}</h3>
                            <button onClick={handleSaveCurrent} className="bg-stone-800 text-white px-4 py-1.5 rounded-full text-sm font-bold">儲存</button>
                        </>
                    )}
                </nav>

                <div className="p-4 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
                    {viewMode === 'list' ? (
                        <>
                            <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-100">
                                <p className="text-xs text-stone-500 mb-1">關於：{note.title}</p>
                                <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                                {responses.length > 0 ? responses.map(r => (
                                    <div key={r.id} className="relative group">
                                        <div onClick={() => handleEdit(r)} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-stone-400 cursor-pointer active:scale-[0.99] transition-all shadow-sm">
                                            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed break-words pr-6" style={{ whiteSpace: 'pre-wrap' }}>{r.text}</div>
                                            <div className="mt-2 flex justify-between items-center">
                                                <span className="text-[10px] text-gray-400">{new Date(r.timestamp).toLocaleString()}</span>
                                                <span className="text-[10px] text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity">點擊修改</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onDelete(r.id); }} 
                                            className="absolute right-3 top-3 p-1 text-stone-300 hover:text-red-500 transition-colors z-10"
                                            title="刪除回應"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )) : (
                                    <div className="text-center text-gray-400 py-8">尚無回應，寫下第一筆靈感吧！</div>
                                )}
                            </div>

                            <button onClick={handleNew} className="mt-auto w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors sticky bottom-0 shadow-sm border border-stone-200">
                                <Plus className="w-5 h-5"/> 新增回應
                            </button>
                        </>
                    ) : (
                        <textarea 
                            className="flex-1 w-full bg-stone-50 p-4 text-gray-800 text-lg leading-relaxed outline-none resize-none placeholder-gray-400 rounded-xl border border-stone-200 focus:border-stone-400 focus:bg-white transition-colors"
                            placeholder="在這裡寫下你的想法..."
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            autoFocus
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// === 6. 所有筆記列表 Modal (支援分類顯示) ===
const AllNotesModal = ({ notes, onClose, onItemClick, onDelete }) => {
    // 狀態：目前顯示層級 ('categories' > 'subcategories' > 'notes')
    const [viewLevel, setViewLevel] = useState('categories');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // 1. 取得所有不重複的大分類
    const categories = useMemo(() => {
        return [...new Set(notes.map(n => n.category || "未分類"))];
    }, [notes]);

    // 2. 取得選定大分類下的次分類
    const subcategories = useMemo(() => {
        if (!selectedCategory) return [];
        return [...new Set(notes.filter(n => (n.category || "未分類") === selectedCategory).map(n => n.subcategory || "一般"))];
    }, [notes, selectedCategory]);

    // 3. 取得最終筆記列表
    const targetNotes = useMemo(() => {
        if (!selectedCategory || !selectedSubcategory) return [];
        return notes.filter(n => 
            (n.category || "未分類") === selectedCategory && 
            (n.subcategory || "一般") === selectedSubcategory
        );
    }, [notes, selectedCategory, selectedSubcategory]);

    // 搜尋邏輯 (搜尋時暫時忽略層級)
    // 搜尋邏輯 (搜尋時暫時忽略層級)
    const searchResults = useMemo(() => {
        if (!searchTerm) return [];
        return notes.filter(n => 
            (n.title && n.title.includes(searchTerm)) || 
            (n.content && n.content.includes(searchTerm)) ||
            (n.category && n.category.includes(searchTerm)) || 
            (n.subcategory && n.subcategory.includes(searchTerm))
        );
    }, [notes, searchTerm]);

    // 返回上一層邏輯
    const handleBack = () => {
        // 從「筆記」層級返回「次分類」
        if (viewLevel === 'notes') {
            setViewLevel('subcategories');
            setSelectedSubcategory(null);
        } 
        // 從「次分類」層級返回「大分類」 <--- 這就是您要的邏輯
        else if (viewLevel === 'subcategories') {
            setViewLevel('categories');
            setSelectedCategory(null);
        }
    };

    return (
        <div className="fixed inset-0 z-40 bg-stone-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* 頂部導航列 */}
            <div className="p-4 border-b border-stone-200 bg-white flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    {/* 顯示返回按鈕 */}
                    {viewLevel !== 'categories' && !searchTerm && (
                        <button onClick={handleBack} className="p-1 -ml-2 text-stone-500 hover:bg-stone-100 rounded-full mr-1">
                            <IconBase d="M15 18l-6-6 6-6" /> 
                        </button>
                    )}
                    {/* 標題隨層級變化 */}
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        {searchTerm ? "搜尋結果" : 
                         viewLevel === 'categories' ? "筆記分類" : 
                         viewLevel === 'subcategories' ? selectedCategory : 
                         selectedSubcategory}
                    </h2>
                </div>
                <button onClick={onClose} className="p-2 bg-stone-100 rounded-full"><X className="w-5 h-5 text-gray-600" /></button>
            </div>
            
            {/* 搜尋框 */}
            <div className="p-4 bg-stone-50 sticky top-[69px] z-10">
                <input 
                    type="text" 
                    placeholder="搜尋筆記關鍵字..." 
                    className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 列表內容區 */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-20">
                
                {/* 情況 A: 正在搜尋 (顯示扁平列表) */}
                {searchTerm && (
                    searchResults.length > 0 ? searchResults.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3" 
                             onClick={() => onItemClick(item)}>
                            <div className="text-xs text-stone-400 mb-1">{item.category} / {item.subcategory}</div>
                            <h4 className="font-bold text-gray-800">{item.title}</h4>
                        </div>
                    )) : <div className="text-center text-gray-400 mt-10">沒有找到相關筆記</div>
                )}

                {/* 情況 B: 階層導航 */}
                {!searchTerm && (
                    <>
                        {/* Level 1: 大分類列表 */}
                        {viewLevel === 'categories' && categories.map(cat => (
                            <div key={cat} onClick={() => { setSelectedCategory(cat); setViewLevel('subcategories'); }}
                                 className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-3 flex justify-between items-center cursor-pointer hover:border-stone-300 active:scale-[0.98] transition-transform">
                                <span className="font-bold text-lg text-stone-800">{cat}</span>
                                <IconBase d="M9 18l6-6-6-6" className="text-stone-300 w-5 h-5" />
                            </div>
                        ))}

                        {/* Level 2: 次分類列表 */}
                        {viewLevel === 'subcategories' && subcategories.map(sub => (
                            <div key={sub} onClick={() => { setSelectedSubcategory(sub); setViewLevel('notes'); }}
                                 className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-3 flex justify-between items-center cursor-pointer hover:border-stone-300 active:scale-[0.98] transition-transform">
                                <span className="font-medium text-lg text-stone-700">{sub}</span>
                                <IconBase d="M9 18l6-6-6-6" className="text-stone-300 w-5 h-5" />
                            </div>
                        ))}

                        {/* Level 3: 最終筆記列表 */}
                        {viewLevel === 'notes' && targetNotes.map(item => (
                            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3 active:scale-[0.99] transition-transform" 
                                 onClick={() => onItemClick(item)}>
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="text-stone-300 hover:text-red-500 p-2">
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-2">{item.content}</p>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

// === 8. 列表項目 (給收藏與歷史使用) ===
const NoteListItem = ({ item, isHistory, allResponses }) => {
    // 取得該筆記的所有新回應
    const newResponses = allResponses ? (allResponses[item.id] || []) : [];
    // 決定要顯示哪一個回應：如果有新回應，顯示最新的一則 (index 0)；如果沒有，顯示舊的 journalEntry
    const displayResponse = newResponses.length > 0 ? newResponses[0].text : item.journalEntry;
    // 計算總回應數
    const responseCount = newResponses.length;

    return (
        <div className="bg-stone-50 p-4 rounded-xl shadow-sm border border-stone-200 mb-3" onClick={() => {
            const event = new CustomEvent('noteSelected', { detail: item.id });
            window.dispatchEvent(event);
        }}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-1 rounded">{item.category || "未分類"}</span>
                    <span className="text-[10px] text-stone-400 ml-2">{item.subcategory}</span>
                </div>
            </div>
            <h4 className="font-bold text-stone-800 mb-1">{item.title}</h4>
            <p className="text-xs text-stone-500 line-clamp-2">{item.content}</p>
            
            {displayResponse && (
                <div className="mt-3 pt-2 border-t border-stone-200">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] text-stone-400 font-bold flex items-center gap-1">
                            <PenLine className="w-3 h-3"/> 
                            {newResponses.length > 0 ? `最新回應 (${newResponses.length})` : "我的回應"}
                        </p>
                        {newResponses.length > 0 && <span className="text-[9px] text-stone-300">{new Date(newResponses[0].timestamp).toLocaleDateString()}</span>}
                    </div>
                    <p className="text-xs text-stone-600 italic line-clamp-2">{displayResponse}</p>
                </div>
            )}
        </div>
    );
};


// === 主程式 ===
// === 主程式 ===
function EchoScriptApp() {
    const [notes, setNotes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    
    const [favorites, setFavorites] = useState([]);
    const [allResponses, setAllResponses] = useState({}); 
    
    const [history, setHistory] = useState([]);
    const [recentIndices, setRecentIndices] = useState([]);

    const [showMenuModal, setShowMenuModal] = useState(false);
    const [showAllNotesModal, setShowAllNotesModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [activeTab, setActiveTab] = useState('favorites');
    const [notification, setNotification] = useState(null);

    const [touchStart, setTouchStart] = useState(null);
    const [touchCurrent, setTouchCurrent] = useState(null);

    // 新增：全域狀態，讓主程式知道子視窗的狀況
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [responseViewMode, setResponseViewMode] = useState('list'); // 'list' or 'edit'

    // 新增：使用 Ref 追蹤狀態，解決 EventListener 閉包過期與依賴重覆觸發的問題
    const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
    const responseViewModeRef = useRef(responseViewMode);

    // 同步 Ref 與 State
    useEffect(() => { hasUnsavedChangesRef.current = hasUnsavedChanges; }, [hasUnsavedChanges]);
    useEffect(() => { responseViewModeRef.current = responseViewMode; }, [responseViewMode]);

    // === 原地滯留導航控制器 (Stay-On-Page Logic) ===
    
    // 1. 基礎防護網 (點擊後啟動)
    useEffect(() => {
        const initGuard = () => {
            // 確保歷史紀錄至少有兩層，讓我們有空間可以「退後再前進」
            if (!window.history.state || window.history.state.page !== 'home') {
                window.history.replaceState({ page: 'root' }, '', '');
                window.history.pushState({ page: 'home' }, '', '');
            }
        };
        // Android 需要手指互動才能操作 History
        window.addEventListener('click', initGuard, { once: true });
        window.addEventListener('touchstart', initGuard, { once: true });

        // 開啟視窗時，推入一層紀錄 (建立初始狀態)
        const isAnyModalOpen = showMenuModal || showAllNotesModal || showEditModal || showResponseModal;
        if (isAnyModalOpen) {
            window.history.pushState({ page: 'modal', time: Date.now() }, '', '');
        }

        return () => {
            window.removeEventListener('click', initGuard);
            window.removeEventListener('touchstart', initGuard);
        };
    }, [showMenuModal, showAllNotesModal, showEditModal, showResponseModal]);

    // 2. 攔截返回鍵 (核心：抵銷退後動作)
    useEffect(() => {
        const handlePopState = (event) => {
            // === A. 編輯中未存檔 (核心目標：留在這一頁) ===
            if (hasUnsavedChangesRef.current) {
                // [關鍵動作] 瀏覽器剛剛退了一步，我們立刻「推」一步回去
                // 這樣一退一進，使用者就會「留在原地」
                // 狀態變成：... -> Home -> Modal (原本) -> Home (按返回) -> Modal_Trap (我們推的)
                window.history.pushState({ page: 'modal_trap', time: Date.now() }, '', '');

                // 稍微延遲顯示確認框，確保畫面已經穩住在「原地」
                setTimeout(() => {
                    const leave = confirm("編輯內容還未存檔，是否離開？");
                    
                    if (leave) {
                        // 使用者選「離開」 (確定不存檔了)
                        setHasUnsavedChanges(false);
                        hasUnsavedChangesRef.current = false;
                        
                        // [策略] 直接關閉 UI，不用管歷史紀錄
                        // 因為我們剛剛推了一個 modal_trap，現在關掉視窗，使用者會看到首頁列表
                        // 雖然歷史紀錄多了一層，但對使用者體驗沒影響 (不會閃退)
                        setShowMenuModal(false);
                        setShowAllNotesModal(false);
                        setShowEditModal(false);
                        setShowResponseModal(false);
                        setResponseViewMode('list');
                    }
                    // 使用者選「取消」 (要留下來)
                    // [策略] 什麼都不用做！
                    // 因為我們在第一行已經用 pushState 把使用者「釘」在這一頁了。
                }, 10);
                
                return;
            }

            // === B. 視窗內導航 (編輯 -> 列表) ===
            if (showResponseModal && responseViewModeRef.current === 'edit') {
                setResponseViewMode('list');
                // 視窗沒關，補回一頁，保持 Modal 開啟狀態
                window.history.pushState({ page: 'modal', time: Date.now() }, '', '');
                return;
            }

            // === C. 正常關閉視窗 (Modal -> Home) ===
            const isAnyModalOpen = showMenuModal || showAllNotesModal || showEditModal || showResponseModal;
            if (isAnyModalOpen) {
                // 瀏覽器已經退回 Home 了，我們只需要讓 UI 消失
                setShowMenuModal(false);
                setShowAllNotesModal(false);
                setShowEditModal(false);
                setShowResponseModal(false);
                setResponseViewMode('list');
                return;
            }

            // === D. 首頁退出 (Home -> Exit) ===
            // 只有在首頁才會執行到這裡
            // [策略] 先把自己釘在首頁，再問要不要走
            window.history.pushState({ page: 'home' }, '', '');
            
            setTimeout(() => {
                if (confirm("是否退出程式？")) {
                    // 只有這裡，我們才允許真正的「倒退」
                    // 因為剛剛補了一步，所以要退兩步才能出去 (-2)
                    window.history.go(-2);
                }
            }, 10);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [showMenuModal, showAllNotesModal, showEditModal, showResponseModal]);
    
    useEffect(() => {
        try {
            const savedNotes = JSON.parse(localStorage.getItem('echoScript_AllNotes'));
            let finalNotes;
            
            if (savedNotes && savedNotes.length > 0 && savedNotes[0].category) {
                finalNotes = savedNotes;
            } else {
                console.log("偵測到舊版資料，執行結構升級...");
                finalNotes = INITIAL_NOTES;
                localStorage.setItem('echoScript_AllNotes', JSON.stringify(finalNotes));
                localStorage.removeItem('echoScript_History');
                setHistory([]); 
            }
            setNotes(finalNotes);
            setFavorites(JSON.parse(localStorage.getItem('echoScript_Favorites') || '[]'));
            setAllResponses(JSON.parse(localStorage.getItem('echoScript_AllResponses') || '{}'));
            
            setHistory(JSON.parse(localStorage.getItem('echoScript_History') || '[]'));
            setRecentIndices(JSON.parse(localStorage.getItem('echoScript_Recents') || '[]'));

            if (finalNotes.length > 0) {
                const idx = Math.floor(Math.random() * finalNotes.length);
                setCurrentIndex(idx);
                addToHistory(finalNotes[idx]);
            }
        } catch (e) { console.error("Init failed", e); }
    }, []);

    useEffect(() => {
        const handleNoteSelect = (e) => {
            const noteId = e.detail;
            const idx = notes.findIndex(n => n.id === noteId);
            if (idx !== -1) {
                setCurrentIndex(idx);
                setShowMenuModal(false);
                window.scrollTo(0, 0);
            }
        };
        window.addEventListener('noteSelected', handleNoteSelect);
        return () => window.removeEventListener('noteSelected', handleNoteSelect);
    }, [notes]);

    useEffect(() => { localStorage.setItem('echoScript_AllNotes', JSON.stringify(notes)); }, [notes]);
    useEffect(() => { localStorage.setItem('echoScript_Favorites', JSON.stringify(favorites)); }, [favorites]);
    useEffect(() => { localStorage.setItem('echoScript_AllResponses', JSON.stringify(allResponses)); }, [allResponses]);
    useEffect(() => { localStorage.setItem('echoScript_History', JSON.stringify(history)); }, [history]);
    useEffect(() => { localStorage.setItem('echoScript_Recents', JSON.stringify(recentIndices)); }, [recentIndices]);

    const showNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

    const addToHistory = (note) => {
        if(!note) return;
        const entry = { ...note, timestamp: new Date().toISOString(), displayId: Date.now() };
        setHistory(prev => [entry, ...prev].slice(0, 50));
    };

    const currentNote = notes[currentIndex];
    const isFavorite = favorites.some(f => f.id === (currentNote ? currentNote.id : null));
    const currentNoteResponses = currentNote ? (allResponses[currentNote.id] || []) : [];

    const handleNextNote = () => {
        if (notes.length <= 1) return;
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
            addToHistory(notes[newIndex]);
            
            setIsAnimating(false);
            window.scrollTo(0,0);
        }, 300);
    };

    const handleSaveNote = (updatedNote) => {
        const now = new Date().toISOString();
        if (isCreatingNew) {
            const newNote = { ...updatedNote, createdDate: now, modifiedDate: now };
            setNotes(prev => [newNote, ...prev]);
            setCurrentIndex(0);
            showNotification("新筆記已建立");
        } else {
            const editedNote = { 
                ...updatedNote, 
                createdDate: updatedNote.createdDate || now,
                modifiedDate: now 
            };
            setNotes(prev => prev.map(n => n.id === editedNote.id ? editedNote : n));
            setFavorites(prev => prev.map(f => f.id === editedNote.id ? { ...f, ...editedNote } : f));
            showNotification("筆記已更新");
        }
        setShowEditModal(false);
    };

    const handleDeleteNote = (id) => {
        if (confirm("確定要刪除這則筆記嗎？此動作無法復原。")) {
            const newNotes = notes.filter(n => n.id !== id);
            setNotes(newNotes);
            if (currentNote && currentNote.id === id) {
                const nextIdx = newNotes.length > 0 ? 0 : -1;
                setCurrentIndex(nextIdx);
            }
            showNotification("筆記已刪除");
        }
    };

    const handleToggleFavorite = () => {
        if (isFavorite) {
            setFavorites(prev => prev.filter(f => f.id !== currentNote.id));
            showNotification("已移除收藏");
        } else {
            setFavorites(prev => [currentNote, ...prev]);
            showNotification("已加入收藏");
        }
    };

    const handleSaveResponse = (text, responseId) => {
        setAllResponses(prev => {
            const noteResponses = prev[currentNote.id] || [];
            let newNoteResponses;
            if (responseId) {
                newNoteResponses = noteResponses.map(r => r.id === responseId ? { ...r, text, timestamp: new Date().toISOString() } : r);
            } else {
                const newResponse = { id: Date.now(), text, timestamp: new Date().toISOString() };
                newNoteResponses = [newResponse, ...noteResponses];
            }
            return { ...prev, [currentNote.id]: newNoteResponses };
        });
        showNotification("回應已儲存");
    };

    const handleDeleteResponse = (responseId) => {
        if(confirm("確定要刪除這則回應嗎？")) {
            setAllResponses(prev => {
                const noteResponses = prev[currentNote.id] || [];
                const newNoteResponses = noteResponses.filter(r => r.id !== responseId);
                return { ...prev, [currentNote.id]: newNoteResponses };
            });
            showNotification("回應已刪除");
        }
    };

    const handleCopyMarkdown = () => {
        if (!currentNote) return;
        const md = `# ${currentNote.category} / ${currentNote.subcategory}\n## ${currentNote.title}\n\n${currentNote.content}\n\n> 來自 EchoScript 編劇靈感庫`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(md).then(() => showNotification("已複製 Markdown")).catch(() => showNotification("複製失敗"));
        }
    };

    const handleBackup = () => {
        const data = { favorites, history, notes, allResponses, version: "EchoScript_v3", date: new Date().toISOString() };
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
                if (data.allResponses) setAllResponses(data.allResponses);
                if (data.notes) {
                    setNotes(data.notes);
                    showNotification("資料庫還原成功！");
                    setTimeout(() => window.location.reload(), 1000);
                }
            } catch (err) { showNotification("檔案格式錯誤"); }
        };
        reader.readAsText(file);
    };

    const onTouchStart = (e) => { setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY }); };
    const onTouchMove = (e) => { setTouchCurrent({ x: e.touches[0].clientX, y: e.touches[0].clientY }); };
    const onTouchEnd = () => {
        if (!touchStart || !touchCurrent) return;
        const dx = touchStart.x - touchCurrent.x;
        const dy = touchCurrent.y - touchStart.y;
        if (Math.abs(dx) > Math.abs(dy) && dx > 50) handleNextNote(); 
        if (Math.abs(dy) > Math.abs(dx) && dy > 100 && window.scrollY === 0) handleNextNote(); 
        setTouchStart(null); setTouchCurrent(null);
    };

    return (
        <div className="min-h-screen bg-stone-50 text-stone-800 font-sans pb-20">
            <nav className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-stone-200/50">
                <div className="flex items-center gap-2">
                    <div className="bg-stone-800 text-white p-1 rounded-lg">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-stone-800">EchoScript</h1>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => { setIsCreatingNew(true); setShowEditModal(true); }} className="bg-white border border-stone-200 text-stone-600 p-2 rounded-full shadow-sm active:bg-stone-100" title="新增筆記">
                        <Plus className="w-5 h-5" />
                    </button>
                    <button onClick={() => setShowAllNotesModal(true)} className="bg-white border border-stone-200 text-stone-600 p-2 rounded-full shadow-sm active:bg-stone-100" title="所有筆記">
                        <List className="w-5 h-5" />
                    </button>
                    <button onClick={handleNextNote} disabled={isAnimating || notes.length <= 1} className="bg-stone-800 text-stone-50 px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-stone-300 active:scale-95 transition-transform flex items-center gap-2">
                        <RefreshCw className={`w-3 h-3 ${isAnimating ? 'animate-spin' : ''}`}/> 下一張
                    </button>
                </div>
            </nav>

            <main className="px-6 py-6 max-w-lg mx-auto" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                {currentNote ? (
                    <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                        {/* 主卡片區域 (包含內容與按鈕) */}
                        <div className="bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden relative min-h-[400px] flex flex-col">
                            <div className="h-2 bg-stone-800 w-full"></div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-6 border-b border-stone-100 pb-4">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h2 className="text-sm font-bold text-stone-400 tracking-widest uppercase">{currentNote.category || "未分類"}</h2>
                                        <span className="text-xs text-stone-300 font-serif">#{currentNote.id.toString().slice(-3)}</span>
                                    </div>
                                    <h3 className="text-xl font-serif text-stone-600 italic">{currentNote.subcategory}</h3>
                                    
                                    {/* 日期顯示區 */}
                                    <div className="flex gap-3 mt-3 text-[10px] text-stone-400 font-mono border-t border-stone-100 pt-2 w-full">
                                        <span>📅 新增: {currentNote.createdDate ? new Date(currentNote.createdDate).toLocaleDateString() : '預設資料'}</span>
                                        <span>📝 修改: {currentNote.modifiedDate ? new Date(currentNote.modifiedDate).toLocaleDateString() : (currentNote.createdDate ? new Date(currentNote.createdDate).toLocaleDateString() : '預設資料')}</span>
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-stone-900 mb-4">{currentNote.title}</h1>
                                    <div className="text-lg leading-loose text-stone-700 font-serif text-justify whitespace-pre-wrap">
                                        <MarkdownRenderer content={currentNote.content} />
                                    </div>
                                </div>
                            </div>

                            {/* 操作按鈕區 (位於卡片內部底部) */}
                            <div className="bg-stone-50 px-12 py-4 border-t border-stone-100 flex justify-between items-center">
                                <button onClick={() => { setIsCreatingNew(false); setShowEditModal(true); }} className="flex flex-col items-center gap-1 text-stone-400 hover:scale-110 transition-transform duration-200">
                                    <Edit className="w-6 h-6" />
                                    <span className="text-[9px] font-bold">修改筆記</span>
                                </button>
                                
                                <button onClick={() => setShowResponseModal(true)} className="flex flex-col items-center gap-1 text-stone-400 hover:scale-110 transition-transform duration-200 relative">
                                    <PenLine className="w-6 h-6" />
                                    <span className="text-[9px] font-bold">回應</span>
                                    {currentNoteResponses.length > 0 && (
                                        <span className="absolute top-0 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-stone-400 text-xs font-bold text-white border-2 border-stone-50">
                                            {currentNoteResponses.length}
                                        </span>
                                    )}
                                </button>

                                <button onClick={handleToggleFavorite} className="flex flex-col items-center gap-1 text-stone-400 hover:scale-110 transition-transform duration-200">
                                    <Heart className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} />
                                    <span className="text-[9px] font-bold">收藏</span>
                                </button>

                                <button onClick={handleCopyMarkdown} className="flex flex-col items-center gap-1 text-stone-400 hover:scale-110 transition-transform duration-200">
                                    <Copy className="w-6 h-6" />
                                    <span className="text-[9px] font-bold">複製 MD</span>
                                </button>
                            </div>
                        </div> {/* 卡片結束 */}

                        {/* 獨立的回應列表 (位於卡片下方) */}
                        {currentNoteResponses.length > 0 && (
                            <div className="mt-6 px-4 animate-in fade-in slide-in-from-bottom-3">
                                <div className="flex items-center gap-3 mb-4 opacity-60">
                                    <div className="h-px bg-stone-300 flex-1"></div>
                                    <span className="text-[10px] font-bold text-stone-500 tracking-widest uppercase">回應紀錄</span>
                                    <div className="h-px bg-stone-300 flex-1"></div>
                                </div>
                                
                                <div className="space-y-4">
                                    {currentNoteResponses.map(resp => (
                                        <div key={resp.id} className="relative pl-4 border-l-2 border-stone-300 py-1">
                                            {/* 裝飾小圓點 */}
                                            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-stone-400"></div>
                                            
                                            {/* 日期 */}
                                            <p className="text-[10px] text-stone-400 font-mono mb-1">
                                                {new Date(resp.timestamp).toLocaleDateString()}
                                            </p>
                                            
                                            {/* 回應內容 */}
                                            <div className="text-sm text-stone-600 whitespace-pre-wrap leading-relaxed break-words" style={{ whiteSpace: 'pre-wrap' }}>
                                                {resp.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-stone-400">
                        <BookOpen className="w-12 h-12 mb-4 opacity-50"/>
                        <p>資料庫是空的</p>
                        <button onClick={() => { setIsCreatingNew(true); setShowEditModal(true); }} className="mt-4 text-stone-600 underline">新增第一則筆記</button>
                    </div>
                )}
            </main>
            
            <button onClick={() => setShowMenuModal(true)} className="fixed bottom-6 right-6 bg-white border border-stone-200 text-stone-600 p-3 rounded-full shadow-lg active:scale-95 z-20">
                <BookOpen className="w-6 h-6" />
            </button>

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
                            {activeTab === 'favorites' && favorites.map(item => (
                                <NoteListItem 
                                    key={item.id} 
                                    item={item} 
                                    allResponses={allResponses} 
                                />
                            ))}
                            {activeTab === 'favorites' && favorites.length === 0 && <div className="text-center text-stone-400 mt-10 text-xs">暫無收藏</div>}
                            
                            {activeTab === 'history' && history.map((item, i) => (
                                <NoteListItem 
                                    key={i} 
                                    item={item} 
                                    isHistory 
                                    allResponses={allResponses} 
                                />
                            ))}
                            
                            {activeTab === 'settings' && (
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl border border-stone-200">
                                        <h3 className="font-bold mb-2 flex items-center gap-2"><Download className="w-4 h-4"/> 匯出資料</h3>
                                        <p className="text-xs text-gray-500 mb-3">包含所有新增的筆記與回應。</p>
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

            {showEditModal && (
                <MarkdownEditorModal 
                    note={isCreatingNew ? null : currentNote} 
                    existingNotes={notes}
                    isNew={isCreatingNew}
                    onClose={() => setShowEditModal(false)} 
                    onSave={(data) => { handleSaveNote(data); setHasUnsavedChanges(false); }} 
                    onDelete={() => { handleDeleteNote(currentNote?.id); setHasUnsavedChanges(false); }}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                />
            )}

            {showAllNotesModal && (
                <AllNotesModal 
                    notes={notes}
                    onClose={() => setShowAllNotesModal(false)}
                    onItemClick={(item) => {
                        const idx = notes.findIndex(n => n.id === item.id);
                        if(idx !== -1) {
                            setCurrentIndex(idx);
                            setShowAllNotesModal(false);
                            window.scrollTo(0,0);
                        }
                    }}
                    onDelete={handleDeleteNote}
                />
            )}

            {showResponseModal && currentNote && (
                <ResponseModal 
                    note={currentNote} 
                    responses={currentNoteResponses} 
                    onClose={() => setShowResponseModal(false)}
                    onSave={(text, id) => { handleSaveResponse(text, id); setHasUnsavedChanges(false); }}
                    onDelete={handleDeleteResponse}
                    viewMode={responseViewMode}
                    setViewMode={setResponseViewMode}
                    setHasUnsavedChanges={setHasUnsavedChanges}
                />
            )}

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


































































