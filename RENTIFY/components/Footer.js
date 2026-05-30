function Footer() {
    const currentYear = 2026;
    return (
        <footer className="bg-white border-t border-slate-200 pt-16 pb-8 mt-auto" data-name="footer" data-file="components/Footer.js">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-1">
                        <a href="index.html" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
                                <div className="icon-house text-white text-sm"></div>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-violet-800">
                                Rentify
                            </span>
                        </a>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            Experience the future of property management with our AI-powered platform. Seamlessly connect owners, tenants, and properties.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><div className="icon-twitter text-sm"></div></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><div className="icon-linkedin text-sm"></div></a>
                            <a href="#" className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><div className="icon-github text-sm"></div></a>
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Platform</h4>
                        <ul className="space-y-3">
                            <li><a href="properties.html" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Explore Properties</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">How it Works</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Pricing Options</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">AI Features</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">About Us</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Careers</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Contact Support</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Partners</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="text-slate-500 hover:text-indigo-600 text-sm transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">© {currentYear} Rentify Inc. All rights reserved.</p>
                    <div className="flex gap-6 text-sm text-slate-400">
                        <span>Made with AI</span>
                        <span>Global Scale</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}