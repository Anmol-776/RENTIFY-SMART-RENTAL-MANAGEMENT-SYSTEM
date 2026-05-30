function ForgotPasswordApp() {
    const [email, setEmail] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [toast, setToast] = React.useState(null);
    const [isSubmitted, setIsSubmitted] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Mock password reset flow
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSubmitted(true);
            setToast({ type: 'success', message: 'Password reset link sent to your email.' });
        } catch (error) {
            setToast({ type: 'error', message: 'Failed to send reset link.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="absolute inset-0 z-0 flex items-center justify-center">
                <div className="w-[800px] h-[800px] bg-gradient-to-tr from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
                    <div className="text-center mb-8">
                        <a href="index.html" className="inline-flex items-center gap-2 mb-6 cursor-pointer">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                <div className="icon-house text-white text-xl"></div>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-violet-800">
                                Rentify
                            </span>
                        </a>
                        <h2 className="text-3xl font-bold text-slate-900">Reset Password</h2>
                        <p className="text-slate-500 mt-2">
                            {isSubmitted ? "Check your email for instructions." : "Enter your email to receive a reset link."}
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field" 
                                    placeholder="Enter your email"
                                />
                            </div>
                            
                            <button type="submit" disabled={loading} className="btn-primary mt-6 relative">
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="icon-loader animate-spin"></div>
                                        <span>Sending...</span>
                                    </div>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center mt-6">
                            <a href="login.html" className="btn-primary inline-block w-full text-center">Return to Login</a>
                        </div>
                    )}

                    {!isSubmitted && (
                        <p className="text-center text-slate-600 mt-8 text-sm">
                            Remember your password? <a href="login.html" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">Sign in</a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ForgotPasswordApp />);