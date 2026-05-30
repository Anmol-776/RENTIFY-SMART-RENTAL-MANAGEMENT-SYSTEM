function SignupApp() {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: '',
        role: 'tenant'
    });
    const [loading, setLoading] = React.useState(false);
    const [toast, setToast] = React.useState(null);

    React.useEffect(() => {
        if (AuthService.getCurrentUser()) {
            window.location.href = 'dashboard.html';
        }
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await AuthService.register(formData.name, formData.email, formData.password, formData.role);
            setToast({ type: 'success', message: 'Account created successfully! Redirecting...' });
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Registration failed' });
            setLoading(false);
        }
    };

    const roles = [
        { id: 'tenant', label: 'Tenant', icon: 'icon-user', desc: 'Looking to rent' },
        { id: 'owner', label: 'Owner', icon: 'icon-house', desc: 'Listing properties' },
        { id: 'admin', label: 'Admin', icon: 'icon-lock', desc: 'Platform management' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden py-12">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-gradient-to-tr from-purple-200/40 to-indigo-200/40 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <a href="index.html" className="inline-flex items-center gap-2 mb-4 cursor-pointer">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                <div className="icon-house text-white text-xl"></div>
                            </div>
                        </a>
                        <h2 className="text-3xl font-bold text-slate-900">Create an Account</h2>
                        <p className="text-slate-500 mt-2">Join Rentify to find or list properties.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="john@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                name="password"
                                required
                                minLength="6"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field" 
                                placeholder="Min. 6 characters"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3">I am a...</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {roles.map(r => (
                                    <div 
                                        key={r.id}
                                        onClick={() => setFormData({...formData, role: r.id})}
                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all text-center ${formData.role === r.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-white hover:border-indigo-200'}`}
                                    >
                                        <div className={`${r.icon} text-2xl mx-auto mb-2 ${formData.role === r.id ? 'text-indigo-600' : 'text-slate-400'}`}></div>
                                        <div className={`font-semibold text-sm ${formData.role === r.id ? 'text-indigo-900' : 'text-slate-700'}`}>{r.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <button type="submit" disabled={loading} className="btn-primary mt-6 relative w-full">
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="icon-loader animate-spin"></div>
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-600 mt-8 text-sm">
                        Already have an account? <a href="login.html" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SignupApp />);