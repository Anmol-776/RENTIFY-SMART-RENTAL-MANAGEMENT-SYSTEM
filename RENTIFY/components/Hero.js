function Hero() {
    return (
        <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-50" data-name="hero" data-file="components/Hero.js">
            {/* Background Gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-float"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] bg-purple-200/40 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-float animation-delay-200"></div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="text-left animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 font-medium text-sm mb-8 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                            Rentify 2.0 is now live
                        </div>
                        
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                            The modern way to <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-300% animate-gradient">
                                rent & manage
                            </span>
                        </h1>
                        
                        <p className="text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                            Experience the future of real estate. Rentify brings owners, tenants, and properties together in one seamless, AI-powered platform.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <a href="properties.html" className="btn-primary flex items-center justify-center gap-2 py-4 px-8 text-lg">
                                Explore Properties <span className="icon-arrow-right"></span>
                            </a>
                            <a href="signup.html" className="btn-secondary flex items-center justify-center gap-2 py-4 px-8 text-lg">
                                List Your Property
                            </a>
                        </div>
                        
                        <div className="flex items-center gap-8 text-slate-500 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <span className="icon-circle-check text-indigo-500"></span>
                                AI Price Suggestions
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="icon-circle-check text-indigo-500"></span>
                                Smart Matching
                            </div>
                        </div>
                    </div>

                    {/* Right Visuals */}
                    <div className="relative lg:h-[600px] flex items-center justify-center animate-fade-in-up animation-delay-200">
                        {/* Main Image Card */}
                        <div className="relative w-full max-w-md bg-white rounded-[2rem] p-4 shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-100 z-10">
                            <div className="rounded-[1.5rem] overflow-hidden relative h-[400px]">
                                <Image src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" alt="Luxury Penthouse" />
                                <div className="absolute top-4 left-4 glass-card px-3 py-1.5 rounded-lg text-sm font-bold text-slate-900 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Available Now
                                </div>
                            </div>
                            <div className="pt-6 pb-2 px-2">
                                <h3 className="font-bold text-xl text-slate-900 mb-1">Luxury Penthouse</h3>
                                <p className="text-slate-500 text-sm mb-4">New York, NY</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-slate-900">$4,500<span className="text-sm text-slate-500 font-normal">/mo</span></span>
                                    <div className="flex gap-3 text-slate-500 text-sm">
                                        <span className="flex items-center gap-1"><span className="icon-bed-double"></span> 3</span>
                                        <span className="flex items-center gap-1"><span className="icon-bath"></span> 2</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating AI Card */}
                        <div className="absolute -left-10 top-1/4 glass-card p-4 z-20 animate-float shadow-xl flex items-center gap-4 border border-white/40">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <span className="icon-wand-sparkles"></span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">AI Suggestion</p>
                                <p className="text-sm font-bold text-slate-900">Optimal Rent: $4,650</p>
                            </div>
                        </div>

                        {/* Floating Stats Card */}
                        <div className="absolute -right-6 bottom-1/4 glass-card p-4 z-20 animate-float animation-delay-300 shadow-xl flex items-center gap-4 border border-white/40">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <span className="icon-users"></span>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Active Tenants</p>
                                <p className="text-sm font-bold text-slate-900">+12% this week</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .bg-300\\% { background-size: 300% 300%; }
                .animate-gradient { animation: gradient 6s ease infinite; }
            `}} />
        </div>
    );
}
