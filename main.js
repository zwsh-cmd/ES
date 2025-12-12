// === EchoScript v2.2: 完整修復版 (包含分類顯示與防白畫面) ===
const { useState, useEffect, useMemo, useRef } = React;

function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);
    useEffect(() => {
        const handler = (e) => {
            console.error('Runtime error:', e.error || e.message);
            setHasError(true);
        };
        window.addEventListener('error', handler);
        return () => window.removeEventListener('error', handler);
    }, []);
    if (hasError) {
        return (
            <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
                <h2>畫面出錯了</h2>
                <p>請重新整理或重新開啟 App。</p>
            </div>
        );
    }
    return children;
}

function Icon({ name, size = 24 }) {
    const icons = {
        menu: (
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ),
        star: (
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                fill="currentColor" />
        ),
        starOutline: (
            <path d="M22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24z"
                fill="none" stroke="currentColor" strokeWidth="2" />
        ),
        edit: (
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                fill="currentColor" />
        ),
        trash: (
            <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                fill="currentColor" />
        ),
        plus: (
            <path d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6v2z"
                fill="currentColor" />
        ),
        back: (
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                fill="currentColor" />
        ),
        close: (
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ),
        copy: (
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
                fill="currentColor" />
        ),
        shuffle: (
            <path d="M17 3h4v4h-2V5h-2V3zm0 18h2v-2h2v-2h-4v4zM3 5h4.59l4.7 4.7-1.41 1.41L6.17 7H3V5zm0 14v-2h3.17l4.71-4.71 1.41 1.41-4.7 4.7H3zm10.41-4.29 1.41-1.41 2.88 2.88V19h2v-4h-4.82l-1.47-1.47zM14.82 9H19V5h-2v2.41l-2.88-2.88-1.41 1.41 1.47 1.47z"
                fill="currentColor" />
        ),
        history: (
            <path d="M13 3a9 9 0 1 0 8.94 10h-2.02A7 7 0 1 1 13 5V1l5 4-5 4V5zM12 8h2v5h5v2h-7V8z"
                fill="currentColor" />
        )
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            {icons[name]}
        </svg>
    );
}

function EchoScriptApp() {
    const [notes, setNotes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [history, setHistory] = useState([]);
    const [recentIndices, setRecentIndices] = useState([]);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [showAllNotesModal, setShowAllNotesModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [editMode, setEditMode] = useState('add'); // add | edit
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [newResponse, setNewResponse] = useState('');
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [allResponses, setAllResponses] = useState({});
    const [copyToast, setCopyToast] = useState('');
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

    // === 核心修正：全域導航與返回鍵攔截 (強力修復版) ===

    // 這一段只負責處理「Android PWA 返回鍵」與「避免誤退出」。
    // 其他 UI / 資料功能都不在這裡動。

    const HISTORY_URL = window.location.pathname;

    const pushHomeState = () => {
        window.history.pushState({ page: 'home', id: Date.now() }, '', HISTORY_URL);
    };

    const pushGuardState = () => {
        window.history.pushState({ page: '__guard__', id: Date.now() }, '', HISTORY_URL);
    };

    const ensureRootGuardHome = () => {
        // 固定三層：root -> guard -> home
        window.history.replaceState({ page: 'root' }, '', HISTORY_URL);
        pushGuardState();
        pushHomeState();
    };

    // 1. 初始化：確保歷史堆疊有三層 (Root -> Guard -> Home)
    useEffect(() => {
        const initHistory = setTimeout(() => {
            const st = window.history.state;
            if (!st || st.page !== 'home') {
                ensureRootGuardHome();
            }
        }, 50);
        return () => clearTimeout(initHistory);
    }, []);

    // 2. 開啟視窗時：推入帶有時間戳記的新紀錄（每次都唯一）
    useEffect(() => {
        const isAnyModalOpen = showMenuModal || showAllNotesModal || showEditModal || showResponseModal;
        if (isAnyModalOpen) {
            window.history.pushState({ page: 'modal', id: Date.now() }, '', HISTORY_URL);
        }
    }, [showMenuModal, showAllNotesModal, showEditModal, showResponseModal]);

    // 3. 監聽返回鍵行為 (核心邏輯)
    useEffect(() => {
        const handlePopState = (event) => {
            const st = event?.state || window.history.state || {};

            // Android PWA 偶爾會把狀態洗掉或直接退到 root。
            // 只要偵測到 root / 空狀態，就立刻重建三層，避免下一次 back 直接退出。
            if (!st.page || st.page === 'root' || st.page === '__root__') {
                ensureRootGuardHome();
                return;
            }

            // A. 未存檔攔截 (最高優先級)
            if (hasUnsavedChangesRef.current) {
                const leave = confirm("編輯內容還未存檔，是否離開？");
                if (!leave) {
                    // 取消：留在編輯中，補回 home（保留 guard 在下面）
                    pushHomeState();
                    return;
                }
                setHasUnsavedChanges(false);
                hasUnsavedChangesRef.current = false;
                // 允許繼續往下走，讓 UI 關視窗或返回
            }

            // B. 回應視窗內的特殊導航 (從編輯模式 -> 列表模式)
            if (showResponseModal && responseViewModeRef.current === 'edit') {
                setResponseViewMode('list');
                // 視窗還開著，補回 modal 狀態，讓下一次 back 還是留在 app 內處理
                window.history.pushState({ page: 'modal', id: Date.now() }, '', HISTORY_URL);
                return;
            }

            // C. 關閉任何開啟的視窗 (回到上一頁)
            const isAnyModalOpen = showMenuModal || showAllNotesModal || showEditModal || showResponseModal;
            if (isAnyModalOpen) {
                setShowMenuModal(false);
                setShowAllNotesModal(false);
                setShowEditModal(false);
                setShowResponseModal(false);
                setResponseViewMode('list');
                // 回到 home（不重建 root/guard；只補回一層 home）
                pushHomeState();
                return;
            }

            // D. 只有在「首頁按返回」才問是否退出
            // 在三層堆疊裡：從 home 按返回，會先回到 __guard__。
            if (st.page === '__guard__') {
                const exit = confirm("是否退出程式？");
                if (!exit) {
                    // 取消退出：回到 home
                    pushHomeState();
                    return;
                }
                // 確認退出：再退一步回 root，接著系統會處理退出
                window.history.back();
                return;
            }

            // 其他狀態保底：回到 home，避免落到未知狀態後直接退出
            pushHomeState();
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [showMenuModal, showAllNotesModal, showEditModal, showResponseModal]);

    useEffect(() => {
        try {
            const savedNotes = JSON.parse(localStorage.getItem('echoScript_AllNotes'));
            let finalNotes;

            if (savedNotes && savedNotes.length > 0 && savedNotes[0]?.title) {
                finalNotes = savedNotes;
            } else {
                finalNotes = window.DEFAULT_NOTES || [];
                localStorage.setItem('echoScript_AllNotes', JSON.stringify(finalNotes));
            }

            // 老資料修復
            const old = localStorage.getItem('echoScript_Notes');
            if (old && !localStorage.getItem('echoScript_AllNotes')) {
                localStorage.setItem('echoScript_AllNotes', old);
                localStorage.removeItem('echoScript_Notes');
            }

            // 修正收藏/回應/歷史
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
        } catch (e) {
            console.error('初始化資料失敗:', e);
            setNotes(window.DEFAULT_NOTES || []);
        }
    }, []);

    const currentNote = notes[currentIndex] || null;

    function saveNotes(newNotes) {
        setNotes(newNotes);
        localStorage.setItem('echoScript_AllNotes', JSON.stringify(newNotes));
    }

    function addToHistory(note) {
        if (!note) return;
        const newHistory = [note, ...history].slice(0, 50);
        setHistory(newHistory);
        localStorage.setItem('echoScript_History', JSON.stringify(newHistory));
    }

    function addToRecents(idx) {
        if (idx == null) return;
        const newRecents = [idx, ...recentIndices.filter(x => x !== idx)].slice(0, 50);
        setRecentIndices(newRecents);
        localStorage.setItem('echoScript_Recents', JSON.stringify(newRecents));
    }

    function randomNext() {
        if (!notes || notes.length === 0) return;
        let idx = Math.floor(Math.random() * notes.length);
        if (notes.length > 1) {
            while (idx === currentIndex) idx = Math.floor(Math.random() * notes.length);
        }
        setCurrentIndex(idx);
        addToHistory(notes[idx]);
        addToRecents(idx);
    }

    function toggleFavorite(noteId) {
        const exists = favorites.includes(noteId);
        const newFavs = exists ? favorites.filter(x => x !== noteId) : [...favorites, noteId];
        setFavorites(newFavs);
        localStorage.setItem('echoScript_Favorites', JSON.stringify(newFavs));
    }

    function openAllNotes() {
        setShowAllNotesModal(true);
    }

    function openMenu() {
        setShowMenuModal(true);
    }

    function closeAllModals() {
        setShowMenuModal(false);
        setShowAllNotesModal(false);
        setShowEditModal(false);
        setShowResponseModal(false);
        setResponseViewMode('list');
    }

    function startAddNote() {
        setEditMode('add');
        setEditId(null);
        setEditTitle('');
        setEditContent('');
        setHasUnsavedChanges(false);
        setShowEditModal(true);
    }

    function startEditNote(note) {
        setEditMode('edit');
        setEditId(note.id);
        setEditTitle(note.title || '');
        setEditContent(note.content || '');
        setHasUnsavedChanges(false);
        setShowEditModal(true);
    }

    function saveEditNote() {
        const title = (editTitle || '').trim();
        const content = (editContent || '').trim();

        if (!content) {
            alert('內容不能為空');
            return;
        }

        const now = Date.now();
        let newNotes;

        if (editMode === 'add') {
            const id = 'note_' + now;
            newNotes = [{ id, title: title || '未命名筆記', content }, ...notes];
            saveNotes(newNotes);
            setCurrentIndex(0);
        } else {
            newNotes = notes.map(n => n.id === editId ? { ...n, title: title || n.title, content } : n);
            saveNotes(newNotes);
        }

        setHasUnsavedChanges(false);
        setShowEditModal(false);
    }

    function deleteNote(noteId) {
        if (!confirm('確定要刪除這則筆記？')) return;
        const newNotes = notes.filter(n => n.id !== noteId);
        saveNotes(newNotes);
        setFavorites(favorites.filter(x => x !== noteId));
        localStorage.setItem('echoScript_Favorites', JSON.stringify(favorites.filter(x => x !== noteId)));
        closeAllModals();

        if (newNotes.length > 0) {
            setCurrentIndex(0);
        } else {
            setCurrentIndex(0);
        }
    }

    function openResponses(noteId) {
        setActiveNoteId(noteId);
        setNewResponse('');
        setResponseViewMode('list');
        setHasUnsavedChanges(false);
        setShowResponseModal(true);
    }

    function saveResponse() {
        const txt = (newResponse || '').trim();
        if (!txt) {
            alert('回應不能為空');
            return;
        }

        const noteId = activeNoteId;
        const prev = allResponses[noteId] || [];
        const next = [{ id: 'r_' + Date.now(), text: txt }, ...prev];

        const newAll = { ...allResponses, [noteId]: next };
        setAllResponses(newAll);
        localStorage.setItem('echoScript_AllResponses', JSON.stringify(newAll));
        setNewResponse('');
        setHasUnsavedChanges(false);
        setResponseViewMode('list');
    }

    function deleteResponse(noteId, respId) {
        if (!confirm('確定要刪除這則回應？')) return;
        const prev = allResponses[noteId] || [];
        const next = prev.filter(r => r.id !== respId);
        const newAll = { ...allResponses, [noteId]: next };
        setAllResponses(newAll);
        localStorage.setItem('echoScript_AllResponses', JSON.stringify(newAll));
    }

    function copyText(textToCopy) {
        if (!navigator.clipboard) {
            const ta = document.createElement('textarea');
            ta.value = textToCopy;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopyToast('已複製');
            setTimeout(() => setCopyToast(''), 1200);
            return;
        }

        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopyToast('已複製');
            setTimeout(() => setCopyToast(''), 1200);
        }).catch(() => {
            setCopyToast('複製失敗');
            setTimeout(() => setCopyToast(''), 1200);
        });
    }

    // 手勢：左右滑切換
    function onTouchStart(e) {
        if (!e.touches || e.touches.length !== 1) return;
        setTouchStart(e.touches[0].clientX);
        setTouchCurrent(e.touches[0].clientX);
    }

    function onTouchMove(e) {
        if (!e.touches || e.touches.length !== 1) return;
        setTouchCurrent(e.touches[0].clientX);
    }

    function onTouchEnd() {
        if (touchStart == null || touchCurrent == null) {
            setTouchStart(null);
            setTouchCurrent(null);
            return;
        }
        const dx = touchCurrent - touchStart;
        if (Math.abs(dx) > 60) {
            randomNext();
        }
        setTouchStart(null);
        setTouchCurrent(null);
    }

    const favoriteNotes = useMemo(() => {
        const favSet = new Set(favorites);
        return notes.filter(n => favSet.has(n.id));
    }, [notes, favorites]);

    const allNoteList = useMemo(() => {
        return notes.map((n, i) => ({ ...n, idx: i }));
    }, [notes]);

    const responsesForActive = allResponses[activeNoteId] || [];

    // 偵測未存檔：只要在 edit modal 或 response edit mode 有變更，就標記
    useEffect(() => {
        if (showEditModal) {
            const original = editMode === 'edit' ? (notes.find(n => n.id === editId)?.content || '') : '';
            const changed = (editContent || '') !== (original || '');
            const titleChanged = editMode === 'edit' ? (editTitle || '') !== (notes.find(n => n.id === editId)?.title || '') : ((editTitle || '') !== '');
            setHasUnsavedChanges(changed || titleChanged);
        } else if (showResponseModal && responseViewMode === 'edit') {
            setHasUnsavedChanges((newResponse || '').trim().length > 0);
        } else {
            setHasUnsavedChanges(false);
        }
    }, [showEditModal, showResponseModal, responseViewMode, editMode, editId, editTitle, editContent, newResponse, notes]);

    return (
        <div
            className="appRoot"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <header className="topBar">
                <button className="iconBtn" onClick={openMenu} aria-label="menu">
                    <Icon name="menu" />
                </button>

                <div className="topTitle">EchoScript</div>

                <button className="iconBtn" onClick={randomNext} aria-label="shuffle">
                    <Icon name="shuffle" />
                </button>
            </header>

            <main className="mainArea">
                {currentNote ? (
                    <div className="noteCard">
                        <div className="noteHeader">
                            <div className="noteTitle">{currentNote.title || '未命名筆記'}</div>
                            <button className="iconBtn" onClick={() => toggleFavorite(currentNote.id)} aria-label="fav">
                                <Icon name={favorites.includes(currentNote.id) ? 'star' : 'starOutline'} />
                            </button>
                        </div>

                        <div className="noteContent">{currentNote.content}</div>

                        <div className="noteActions">
                            <button className="btn" onClick={() => copyText(`${currentNote.title || ''}\n\n${currentNote.content}`)}>
                                <Icon name="copy" size={18} /> 複製
                            </button>
                            <button className="btn" onClick={() => openResponses(currentNote.id)}>
                                回應
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="empty">
                        <p>目前沒有筆記</p>
                        <button className="btn primary" onClick={startAddNote}>
                            <Icon name="plus" size={18} /> 新增筆記
                        </button>
                    </div>
                )}
            </main>

            {copyToast ? (
                <div className="toast">{copyToast}</div>
            ) : null}

            {showMenuModal ? (
                <div className="modalOverlay" onClick={() => setShowMenuModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <div className="modalTitle">選單</div>
                            <button className="iconBtn" onClick={() => setShowMenuModal(false)}><Icon name="close" /></button>
                        </div>

                        <div className="modalBody">
                            <button className="btn block" onClick={() => { setShowMenuModal(false); openAllNotes(); }}>
                                全部筆記
                            </button>
                            <button className="btn block" onClick={() => { setShowMenuModal(false); startAddNote(); }}>
                                新增筆記
                            </button>
                            <button className="btn block" onClick={() => {
                                setShowMenuModal(false);
                                alert('提示：回到首頁按返回鍵才會詢問是否退出。');
                            }}>
                                返回鍵說明
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {showAllNotesModal ? (
                <div className="modalOverlay" onClick={() => setShowAllNotesModal(false)}>
                    <div className="modal large" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <div className="modalTitle">全部筆記</div>
                            <button className="iconBtn" onClick={() => setShowAllNotesModal(false)}><Icon name="close" /></button>
                        </div>

                        <div className="modalBody">
                            {favoriteNotes.length > 0 ? (
                                <div className="section">
                                    <div className="sectionTitle"><Icon name="star" size={18} /> 收藏</div>
                                    {favoriteNotes.map((n) => (
                                        <div key={n.id} className="listItem">
                                            <div className="listText" onClick={() => {
                                                const idx = notes.findIndex(x => x.id === n.id);
                                                if (idx >= 0) {
                                                    setCurrentIndex(idx);
                                                    addToHistory(notes[idx]);
                                                    addToRecents(idx);
                                                }
                                                setShowAllNotesModal(false);
                                            }}>
                                                {n.title || '未命名筆記'}
                                            </div>
                                            <div className="listActions">
                                                <button className="iconBtn" onClick={() => startEditNote(n)}><Icon name="edit" size={18} /></button>
                                                <button className="iconBtn" onClick={() => deleteNote(n.id)}><Icon name="trash" size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            <div className="section">
                                <div className="sectionTitle">全部</div>
                                {allNoteList.map((n) => (
                                    <div key={n.id} className="listItem">
                                        <div className="listText" onClick={() => {
                                            setCurrentIndex(n.idx);
                                            addToHistory(notes[n.idx]);
                                            addToRecents(n.idx);
                                            setShowAllNotesModal(false);
                                        }}>
                                            {n.title || '未命名筆記'}
                                        </div>
                                        <div className="listActions">
                                            <button className="iconBtn" onClick={() => toggleFavorite(n.id)}>
                                                <Icon name={favorites.includes(n.id) ? 'star' : 'starOutline'} size={18} />
                                            </button>
                                            <button className="iconBtn" onClick={() => startEditNote(n)}><Icon name="edit" size={18} /></button>
                                            <button className="iconBtn" onClick={() => deleteNote(n.id)}><Icon name="trash" size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="modalFooter">
                            <button className="btn" onClick={() => setShowAllNotesModal(false)}>關閉</button>
                        </div>
                    </div>
                </div>
            ) : null}

            {showEditModal ? (
                <div className="modalOverlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal large" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <div className="modalTitle">{editMode === 'add' ? '新增筆記' : '編輯筆記'}</div>
                            <button className="iconBtn" onClick={() => setShowEditModal(false)}><Icon name="close" /></button>
                        </div>

                        <div className="modalBody">
                            <div className="field">
                                <div className="label">標題</div>
                                <input
                                    className="input"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="可留空"
                                />
                            </div>

                            <div className="field">
                                <div className="label">內容</div>
                                <textarea
                                    className="textarea"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder="請輸入內容"
                                />
                            </div>
                        </div>

                        <div className="modalFooter">
                            <button className="btn" onClick={() => setShowEditModal(false)}>取消</button>
                            <button className="btn primary" onClick={saveEditNote}>儲存</button>
                        </div>
                    </div>
                </div>
            ) : null}

            {showResponseModal ? (
                <div className="modalOverlay" onClick={() => setShowResponseModal(false)}>
                    <div className="modal large" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <div className="modalTitle">回應</div>
                            <button className="iconBtn" onClick={() => setShowResponseModal(false)}><Icon name="close" /></button>
                        </div>

                        <div className="modalBody">
                            {responseViewMode === 'list' ? (
                                <>
                                    <button className="btn block" onClick={() => setResponseViewMode('edit')}>新增回應</button>
                                    {responsesForActive.length > 0 ? (
                                        <div className="section">
                                            {responsesForActive.map((r) => (
                                                <div key={r.id} className="respItem">
                                                    <div className="respText">{r.text}</div>
                                                    <div className="respActions">
                                                        <button className="iconBtn" onClick={() => copyText(r.text)}><Icon name="copy" size={18} /></button>
                                                        <button className="iconBtn" onClick={() => deleteResponse(activeNoteId, r.id)}><Icon name="trash" size={18} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="emptySmall">還沒有回應</div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="field">
                                        <div className="label">回應內容</div>
                                        <textarea
                                            className="textarea"
                                            value={newResponse}
                                            onChange={(e) => setNewResponse(e.target.value)}
                                            placeholder="請輸入回應"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modalFooter">
                            {responseViewMode === 'list' ? (
                                <button className="btn" onClick={() => setShowResponseModal(false)}>關閉</button>
                            ) : (
                                <>
                                    <button className="btn" onClick={() => { setResponseViewMode('list'); setNewResponse(''); setHasUnsavedChanges(false); }}>取消</button>
                                    <button className="btn primary" onClick={saveResponse}>儲存</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <EchoScriptApp />
        </ErrorBoundary>
    );
}

// 掛載
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

/* ===== 基本樣式 ===== */
const style = document.createElement('style');
style.textContent = `
  .appRoot{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans TC","Helvetica Neue",Arial,"Apple Color Emoji","Segoe UI Emoji";height:100vh;display:flex;flex-direction:column;background:#0b0b0b;color:#f4f4f4}
  .topBar{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
  .topTitle{font-weight:700;letter-spacing:.3px}
  .iconBtn{background:transparent;border:none;color:#f4f4f4;padding:6px;border-radius:10px;cursor:pointer}
  .iconBtn:active{transform:scale(.97)}
  .mainArea{flex:1;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto}
  .noteCard{width:min(720px,100%);background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:16px;box-shadow:0 12px 30px rgba(0,0,0,.35)}
  .noteHeader{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px}
  .noteTitle{font-size:18px;font-weight:700}
  .noteContent{white-space:pre-wrap;line-height:1.65;color:rgba(255,255,255,.92);margin:10px 0 14px}
  .noteActions{display:flex;gap:10px;flex-wrap:wrap}
  .btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff;border-radius:14px;padding:10px 12px;cursor:pointer;display:inline-flex;align-items:center;gap:8px}
  .btn.primary{background:#ffffff;color:#111;border-color:transparent}
  .btn.block{width:100%;justify-content:center}
  .btn:active{transform:scale(.98)}
  .empty{text-align:center;opacity:.9}
  .toast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);background:rgba(0,0,0,.75);padding:10px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.12);z-index:9999}
  .modalOverlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px;z-index:999}
  .modal{width:min(520px,100%);background:#151515;border:1px solid rgba(255,255,255,.10);border-radius:18px;box-shadow:0 18px 45px rgba(0,0,0,.55);overflow:hidden}
  .modal.large{width:min(780px,100%)}
  .modalHeader{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
  .modalTitle{font-weight:700}
  .modalBody{padding:14px;max-height:70vh;overflow:auto}
  .modalFooter{display:flex;gap:10px;justify-content:flex-end;padding:12px 14px;border-top:1px solid rgba(255,255,255,.08)}
  .section{margin-top:12px}
  .sectionTitle{font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:8px;opacity:.95}
  .listItem{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 10px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);margin-bottom:10px}
  .listText{flex:1;cursor:pointer}
  .listActions{display:flex;gap:6px}
  .field{margin-bottom:14px}
  .label{font-size:13px;opacity:.85;margin-bottom:6px}
  .input{width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff}
  .textarea{width:100%;min-height:160px;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#fff;resize:vertical}
  .respItem{padding:10px 10px;border-radius:14px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);margin-top:10px}
  .respText{white-space:pre-wrap;line-height:1.6}
  .respActions{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}
  .emptySmall{opacity:.8;padding:10px 0;text-align:center}
`;
document.head.appendChild(style);
