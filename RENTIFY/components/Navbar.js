function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const user = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;

    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`fixed w-full z-50 top-0 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-2xl shadow-sm border-b border-white/20 py-0' : 'bg-transparent py-2'}`} data-name="navbar" data-file="components/Navbar.js">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <a href="index.html" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <div className="icon-house text-white text-xl"></div>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-violet-800">
                            Rentify
                        </span>
                    </a>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="properties.html" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Explore Properties</a>
                        <a href="properties.html" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Search Rentals</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4 relative" ref={dropdownRef}>
                                <a href="chat.html" className="text-slate-500 hover:text-indigo-600 transition-colors p-2 relative">
                                    <div className="icon-message-square text-xl"></div>
                                </a>
                                
                                <a href="dashboard.html?tab=maintenance" className="text-slate-500 hover:text-indigo-600 transition-colors p-2 relative">
                                    <div className="icon-bell text-xl"></div>
                                </a>

                                <a href="dashboard.html" className="hidden md:block text-sm font-medium text-slate-600 hover:text-indigo-600">Dashboard</a>
                                
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer shadow-md hover:shadow-lg transition-all"
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </button>
                                
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in-down">
                                        <div className="px-4 py-2 border-b border-slate-100 mb-2">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                                        </div>
                                        <a href="dashboard.html" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div className="icon-layout-dashboard"></div>
                                                Dashboard
                                            </div>
                                        </a>
                                        <button 
                                            onClick={() => AuthService.logout()} 
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="icon-log-out"></div>
                                                Sign out
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <a href="login.html" className="hidden md:block font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                                    Log in
                                </a>
                                <a href="signup.html" className="btn-primary py-2.5 inline-block text-center">
                                    Sign up
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fade-in-down {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.2s ease-out forwards;
                }
            `}} />
        </nav>
    );
}