function AIChatbot() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState([
        { id: 1, type: 'ai', text: 'Hello! I am Rentify AI, your intelligent property assistant. I can help you find listings, suggest optimal rent prices, or guide you through your dashboard. How can I assist you today?', isTyping: false }
    ]);
    const [inputValue, setInputValue] = React.useState('');
    const [micState, setMicState] = React.useState('idle'); // idle, listening, processing, error, unsupported
    const [micErrorMsg, setMicErrorMsg] = React.useState('');
    const [voiceEnabled, setVoiceEnabled] = React.useState(false);
    const [isTyping, setIsTyping] = React.useState(false);
    const [audioLevel, setAudioLevel] = React.useState(0);
    
    const messagesEndRef = React.useRef(null);
    const recognitionRef = React.useRef(null);
    const inputValueRef = React.useRef('');
    const voiceEnabledRef = React.useRef(false);
    const animationFrameRef = React.useRef(null);

    const suggestions = [
        "Suggest rental price",
        "Find properties in NY",
        "How to report maintenance?",
        "Show my dashboard"
    ];

    React.useEffect(() => {
        inputValueRef.current = inputValue;
        voiceEnabledRef.current = voiceEnabled;
    }, [inputValue, voiceEnabled]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    React.useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen]);

    React.useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setMicState('unsupported');
            setMicErrorMsg('Voice input not supported in this browser.');
            return;
        }
        
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            setMicState('listening');
            simulateAudioLevel();
        };
        
        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setInputValue(finalTranscript || interimTranscript);
            // Boost audio level visually when speech is detected
            setAudioLevel(Math.random() * 60 + 40);
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            cancelAudioSimulation();
            
            if (event.error === 'not-allowed') {
                setMicErrorMsg('Microphone access denied.');
            } else if (event.error === 'network') {
                setMicErrorMsg('Network error. Voice service unavailable.');
            } else if (event.error === 'no-speech') {
                setMicErrorMsg('No speech detected.');
            } else {
                setMicErrorMsg('Voice service error.');
            }
            
            setMicState('error');
            setTimeout(() => {
                setMicState('idle');
                setMicErrorMsg('');
            }, 3000);
        };
        
        recognition.onend = () => {
            cancelAudioSimulation();
            const text = inputValueRef.current.trim();
            if (text && micState !== 'error') {
                setMicState('processing');
                handleSend(text);
            } else if (micState !== 'error') {
                setMicState('idle');
            }
        };
        
        recognitionRef.current = recognition;

        return () => {
            cancelAudioSimulation();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []);

    const simulateAudioLevel = () => {
        const animate = () => {
            // Randomly fluctuate between 10 and 30 for ambient noise
            setAudioLevel(prev => Math.max(10, Math.min(100, prev + (Math.random() * 40 - 20))));
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();
    };

    const cancelAudioSimulation = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setAudioLevel(0);
    };

    const speak = (text) => {
        if (!voiceEnabledRef.current || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Female')) || 
                               voices.find(v => v.lang.includes('en'));
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    };

    const toggleVoice = () => {
        setVoiceEnabled(prev => {
            const next = !prev;
            if (!next && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            return next;
        });
    };

    const handleSend = (text) => {
        if (!text.trim()) return;
        
        const newMsg = { id: Date.now(), type: 'user', text: text.trim() };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsTyping(true);
        
        if (micState !== 'unsupported') {
            setMicState('idle');
        }

        if (window.speechSynthesis) window.speechSynthesis.cancel();

        setTimeout(() => {
            setIsTyping(false);
            let reply = "I understand. I can help you with that right away. Could you provide a little more detail?";
            const lower = text.toLowerCase();
            
            if (lower.includes("price") || lower.includes("rent")) {
                reply = "Based on current market data, the optimal rent for a typical 2-bedroom in this area is around $2,800/mo. Would you like me to analyze a specific property?";
            } else if (lower.includes("ny") || lower.includes("new york")) {
                reply = "We have several premium listings in New York starting at $3,500/mo. I can show you the top matches.";
            } else if (lower.includes("dashboard")) {
                reply = "Your dashboard gives you a complete overview of active leases, saved properties, and maintenance requests. You can access it from the top menu.";
            } else if (lower.includes("maintenance")) {
                reply = "You can easily submit a maintenance request from your Tenant Dashboard. Simply navigate to the 'Maintenance' tab and fill out the form.";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, type: 'ai', text: reply }]);
            if (voiceEnabledRef.current) {
                speak(reply);
            }
        }, 1500);
    };

    const toggleListen = () => {
        if (micState === 'unsupported') {
            setMicErrorMsg('Voice not supported. Please type instead.');
            setTimeout(() => setMicErrorMsg(''), 3000);
            return;
        }

        if (micState === 'listening') {
            recognitionRef.current.stop();
        } else {
            setInputValue('');
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Microphone start error:", e);
                setMicState('error');
                setMicErrorMsg('Failed to start microphone.');
                setTimeout(() => { setMicState('idle'); setMicErrorMsg(''); }, 2000);
            }
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans" data-name="ai-chatbot" data-file="components/AIChatbot.js">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    80% { transform: scale(1.5); opacity: 0; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes float-bot {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                .bot-float { animation: float-bot 4s ease-in-out infinite; }
                .pulse-circle::before {
                    content: '';
                    position: absolute;
                    inset: -10px;
                    border-radius: 50%;
                    border: 2px solid #6366f1;
                    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                    z-index: -1;
                }
                .pulse-circle::after {
                    content: '';
                    position: absolute;
                    inset: -10px;
                    border-radius: 50%;
                    border: 2px solid #8b5cf6;
                    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                    animation-delay: 1s;
                    z-index: -1;
                }
                
                .glass-panel {
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.2) inset;
                }

                .wave-line {
                    width: 3px;
                    border-radius: 3px;
                    background: #6366f1;
                    transition: height 0.1s ease;
                }
            `}} />

            {/* Chatbot Window */}
            {isOpen && (
                <div className="absolute bottom-24 right-0 w-[360px] sm:w-[420px] h-[600px] glass-panel rounded-3xl flex flex-col overflow-hidden animate-fade-in-up origin-bottom-right transition-all duration-500">
                    
                    {/* Header */}
                    <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-5 text-white shrink-0 overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-40"></div>
                        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-purple-500 rounded-full blur-xl opacity-40"></div>
                        
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-inner">
                                    <div className="icon-wand-sparkles text-2xl text-indigo-100 bot-float"></div>
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-indigo-900 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">Rentify AI</h3>
                                    <p className="text-xs text-indigo-200/80 font-medium tracking-wider uppercase mt-0.5">Premium Assistant</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 bg-black/20 rounded-full p-1 backdrop-blur-md border border-white/10">
                                <button 
                                    onClick={toggleVoice} 
                                    title={voiceEnabled ? "Voice Output On" : "Voice Output Off"}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${voiceEnabled ? 'bg-indigo-500 text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                                >
                                    <div className={`icon-${voiceEnabled ? 'volume-2' : 'volume-x'} text-sm`}></div>
                                </button>
                                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
                                    <div className="icon-chevron-down text-lg"></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50">
                        {messages.map((msg, idx) => (
                            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`} style={{ animationDelay: `${idx * 0.05}s` }}>
                                {msg.type === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mr-2 border border-indigo-200 self-end mb-1">
                                        <div className="icon-bot text-indigo-600 text-sm"></div>
                                    </div>
                                )}
                                <div className={`max-w-[80%] px-4 py-3 text-sm shadow-sm leading-relaxed ${msg.type === 'user' ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-100/80'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className="flex justify-start animate-fade-in">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mr-2 border border-indigo-200 self-end mb-1">
                                    <div className="icon-bot text-indigo-600 text-sm"></div>
                                </div>
                                <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions Area */}
                    {messages.length < 3 && !isTyping && (
                        <div className="px-5 pb-3 flex overflow-x-auto gap-2 scrollbar-hide shrink-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => handleSend(s)} className="text-xs px-4 py-2 bg-white text-indigo-700 rounded-xl border border-indigo-100/50 hover:bg-indigo-50 hover:border-indigo-200 hover:shadow-md transition-all whitespace-nowrap shadow-sm font-medium">
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 shrink-0 relative z-20 rounded-b-3xl">
                        
                        {/* Dynamic Notification Pill */}
                        {(micState === 'error' || micState === 'unsupported' || micErrorMsg) && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg animate-fade-in flex items-center gap-2 whitespace-nowrap border border-slate-700">
                                <div className={micState === 'unsupported' ? "icon-info" : "icon-triangle-alert text-amber-400"}></div> 
                                {micErrorMsg}
                            </div>
                        )}

                        <form onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} className="relative flex items-end gap-3">
                            
                            <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100/50 rounded-2xl transition-all flex flex-col p-1 shadow-inner relative z-10">
                                
                                {/* Sound Visualizer Overlay when listening */}
                                {micState === 'listening' && (
                                    <div className="absolute inset-x-0 bottom-full mb-2 h-10 flex items-center justify-center gap-1 pointer-events-none">
                                        {[...Array(15)].map((_, i) => (
                                            <div 
                                                key={i} 
                                                className="wave-line" 
                                                style={{ 
                                                    height: `${Math.max(4, audioLevel * Math.random())}px`,
                                                    opacity: 0.6 + (Math.random() * 0.4)
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                )}

                                <textarea 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend(inputValue);
                                        }
                                    }}
                                    placeholder={micState === 'listening' ? "Listening intently..." : "Type or speak to Rentify..."}
                                    className="w-full text-sm text-slate-800 outline-none px-3 py-3 bg-transparent resize-none min-h-[44px] max-h-[120px] placeholder:text-slate-400"
                                    rows="1"
                                    disabled={micState === 'listening'}
                                />
                            </div>
                            
                            <div className="flex flex-col gap-2 shrink-0">
                                {inputValue.trim() ? (
                                    <button 
                                        type="submit" 
                                        disabled={micState === 'processing'} 
                                        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                    >
                                        <div className="icon-send text-lg"></div>
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={toggleListen} 
                                        disabled={micState === 'unsupported' || micState === 'processing'}
                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 relative
                                            ${micState === 'listening' 
                                                ? 'bg-red-500 text-white pulse-circle shadow-lg shadow-red-500/40 scale-105' 
                                                : micState === 'processing'
                                                    ? 'bg-indigo-100 text-indigo-500 cursor-wait'
                                                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100'}`}
                                    >
                                        {micState === 'processing' ? (
                                            <div className="icon-loader text-xl animate-spin"></div>
                                        ) : micState === 'listening' ? (
                                            <div className="icon-square text-xl fill-current"></div>
                                        ) : (
                                            <div className="icon-mic text-xl"></div>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="group relative w-16 h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-600/50 hover:scale-110 hover:-translate-y-2 transition-all duration-300 z-50 bot-float"
                >
                    <div className="icon-wand-sparkles text-2xl group-hover:rotate-12 transition-transform duration-300"></div>
                    
                    {/* Notification Dot */}
                    <span className="absolute top-0 right-0 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                    </span>

                    {/* Ambient Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
                </button>
            )}
        </div>
    );
}