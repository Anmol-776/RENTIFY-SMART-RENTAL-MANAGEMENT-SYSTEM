function Features() {
    return (
        <section className="py-24 bg-white" data-name="features" data-file="components/Features.js">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
                    <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Platform Capabilities</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Everything you need, nothing you don't
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
                        Powerful features designed to make property management invisible. Let our AI do the heavy lifting while you focus on what matters.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(250px,auto)]">
                    {/* Bento Box 1 */}
                    <div className="md:col-span-8 bg-slate-50 rounded-3xl p-8 border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in-up">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                        <div className="relative z-10 w-full md:w-2/3 h-full flex flex-col justify-center">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 text-indigo-600 shadow-sm border border-slate-100">
                                <span className="icon-wand-sparkles text-xl"></span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">AI-Powered Optimization</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">
                                Stop guessing. Our AI generates premium property descriptions and suggests optimal rental prices instantly based on real-time market data.
                            </p>
                        </div>
                    </div>

                    {/* Bento Box 2 */}
                    <div className="md:col-span-4 bg-indigo-900 rounded-3xl p-8 border border-indigo-800 relative overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-100">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500 rounded-full blur-2xl opacity-50"></div>
                        <div className="relative z-10 h-full flex flex-col justify-center">
                            <div className="w-12 h-12 bg-indigo-800 rounded-xl flex items-center justify-center mb-6 text-indigo-300 border border-indigo-700">
                                <span className="icon-shield-check text-xl"></span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Secure verification</h3>
                            <p className="text-indigo-200 leading-relaxed">
                                Bank-grade security and strict verification keep bad actors out of your properties.
                            </p>
                        </div>
                    </div>

                    {/* Bento Box 3 */}
                    <div className="md:col-span-4 bg-slate-50 rounded-3xl p-8 border border-slate-100 relative group hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-200">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 text-green-600 shadow-sm border border-slate-100">
                            <span className="icon-message-circle text-xl"></span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Seamless Chat</h3>
                        <p className="text-slate-500 leading-relaxed">
                            Real-time messaging between tenants and owners. Connect instantly and resolve questions fast.
                        </p>
                    </div>

                    {/* Bento Box 4 */}
                    <div className="md:col-span-8 bg-slate-50 rounded-3xl p-8 border border-slate-100 relative group hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-300">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 text-orange-600 shadow-sm border border-slate-100">
                            <span className="icon-wrench text-xl"></span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Maintenance</h3>
                        <p className="text-slate-500 leading-relaxed text-lg max-w-2xl">
                            Effortlessly submit, track, and manage maintenance requests with real-time status updates. No more lost emails or missed calls.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
