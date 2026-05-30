function ChatApp() {
    const [user, setUser] = React.useState(null);
    const [conversations, setConversations] = React.useState([]);
    const [properties, setProperties] = React.useState({});
    const [activeConv, setActiveConv] = React.useState(null);
    const [messages, setMessages] = React.useState([]);
    const [newMessage, setNewMessage] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [sending, setSending] = React.useState(false);
    const messagesEndRef = React.useRef(null);
    const pollInterval = React.useRef(null);

    React.useEffect(() => {
        const u = AuthService.requireAuth();
        if (u) {
            setUser(u);
            loadData(u);
        }
    }, []);

    const loadData = async (u) => {
        try {
            const [convs, allProps] = await Promise.all([
                ChatService.getConversations(u.id, u.role),
                PropertyService.getAll()
            ]);
            
            const propMap = {};
            allProps.forEach(p => {
                propMap[p.objectId] = p.objectData;
            });
            setProperties(propMap);
            setConversations(convs);

            const params = new URLSearchParams(window.location.search);
            const cid = params.get('id');
            if (cid) {
                const target = convs.find(c => c.objectId === cid);
                if (target) selectConversation(target, u);
            } else if (convs.length > 0) {
                selectConversation(convs[0], u);
            }
        } catch (e) {
            console.error("Failed to load chat data", e);
        } finally {
            setLoading(false);
        }
    };

    const selectConversation = async (conv, currentUser = user) => {
        setActiveConv(conv);
        setMessages([]); // clear current messages while loading new ones
        
        await fetchMessages(conv.objectId);
        await ChatService.markMessagesAsRead(conv.objectId, currentUser.id);

        if (pollInterval.current) clearInterval(pollInterval.current);
        
        // Start polling for new messages every 5 seconds
        pollInterval.current = setInterval(() => {
            fetchMessages(conv.objectId, true);
        }, 5000);
    };

    const fetchMessages = async (convId, isPolling = false) => {
        try {
            const msgs = await ChatService.getMessages(convId);
            setMessages(prev => {
                // Only update if length changed or not polling to prevent scroll jank
                if (!isPolling || msgs.length !== prev.length) {
                    setTimeout(scrollToBottom, 100);
                    return msgs;
                }
                return prev;
            });
        } catch (e) {
            console.error("Failed to fetch messages", e);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConv || sending) return;
        
        const content = newMessage.trim();
        setNewMessage('');
        setSending(true);
        
        try {
            const msg = await ChatService.sendMessage(activeConv.objectId, user.id, content);
            setMessages(prev => [...prev, msg]);
            scrollToBottom();

            // Notify other party
            const receiverId = user.role === 'tenant' ? activeConv.objectData.owner_id : activeConv.objectData.tenant_id;
            await NotificationService.createNotification(
                receiverId,
                'New Message',
                `You have a new message regarding a property.`,
                'message',
                `chat.html?id=${activeConv.objectId}`
            );
        } catch (e) {
            console.error("Failed to send message", e);
            alert("Failed to send message. Please try again.");
            setNewMessage(content); // restore input
        } finally {
            setSending(false);
        }
    };

    if (!user) return null;

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 pt-20 flex overflow-hidden bg-slate-50">
            {/* Sidebar */}
            <div className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0 transition-transform ${activeConv ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-5 border-b border-slate-200 bg-white z-10 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col gap-4 p-4">
                            {[1,2,3].map(i => (
                                <div key={i} className="flex gap-3 animate-pulse">
                                    <div className="w-12 h-12 bg-slate-200 rounded-xl shrink-0"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 flex flex-col items-center justify-center text-center h-full">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <div className="icon-message-square text-2xl text-slate-400"></div>
                            </div>
                            <p className="text-slate-500 font-medium">No conversations yet.</p>
                            <a href="properties.html" className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-semibold">Browse properties</a>
                        </div>
                    ) : (
                        conversations.map(c => {
                            const prop = properties[c.objectData.property_id];
                            const isActive = activeConv?.objectId === c.objectId;
                            return (
                                <div 
                                    key={c.objectId} 
                                    onClick={() => selectConversation(c)}
                                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all flex items-start gap-3 ${isActive ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                                >
                                    <div className="w-12 h-12 bg-slate-200 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                        {prop?.images?.[0] ? (
                                            <img src={prop.images[0]} className="w-full h-full object-cover" alt="Property" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"><div className="icon-image text-slate-400"></div></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h4 className="font-semibold text-slate-900 truncate pr-2">
                                                {prop ? prop.title : 'Unknown Property'}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate">
                                            {user.role === 'tenant' ? 'With Owner' : 'With Tenant'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-slate-50 relative ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
                {activeConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
                            <div className="flex items-center gap-4">
                                <button className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100" onClick={() => setActiveConv(null)}>
                                    <div className="icon-arrow-left text-xl"></div>
                                </button>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">
                                        {properties[activeConv.objectData.property_id]?.title || 'Property Inquiry'}
                                    </h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                                    </p>
                                </div>
                            </div>
                            <a href={`property-detail.html?id=${activeConv.objectData.property_id}`} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                                View Listing <div className="icon-external-link text-xs"></div>
                            </a>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {messages.length === 0 && !loading && (
                                <div className="text-center text-slate-400 my-10">
                                    <p>No messages yet. Send a message to start the conversation!</p>
                                </div>
                            )}
                            
                            {messages.map((m, i) => {
                                const isMe = m.objectData.sender_id === user.id;
                                return (
                                    <div key={m.objectId || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in-up`} style={{animationDelay: '50ms'}}>
                                        <div className={`max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'}`}>
                                            <p className="whitespace-pre-wrap">{m.objectData.content}</p>
                                        </div>
                                        <span className="text-[11px] text-slate-400 mt-1 px-1">
                                            {formatTime(m.createdAt) || 'Just now'} {isMe && (m.objectData.is_read ? <span className="icon-check-check text-blue-500 ml-1"></span> : <span className="icon-check ml-1"></span>)}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} className="h-4" />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-3 relative">
                                <input 
                                    type="text" 
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Type your message here..." 
                                    className="flex-1 px-6 py-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-full outline-none transition-all pr-14"
                                    disabled={sending}
                                />
                                <button 
                                    type="submit" 
                                    disabled={!newMessage.trim() || sending} 
                                    className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-indigo-600 flex items-center justify-center text-white disabled:opacity-50 hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                                >
                                    {sending ? <div className="icon-loader animate-spin"></div> : <div className="icon-send text-sm ml-0.5"></div>}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
                        <div className="w-24 h-24 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6">
                            <div className="icon-message-circle text-4xl text-indigo-200"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Select a conversation</h3>
                        <p className="max-w-xs mx-auto">Choose a conversation from the sidebar to view messages and reply.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ChatApp />);