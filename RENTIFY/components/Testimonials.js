function Testimonials() {
    const reviews = [
        {
            name: "Sarah Jenkins",
            role: "Property Owner",
            content: "Rentify completely transformed how I manage my portfolio. The AI pricing suggestions alone increased my annual yield by 15%. Highly recommended for serious owners.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
        },
        {
            name: "Michael Chen",
            role: "Tenant",
            content: "Finding an apartment used to be a nightmare. With Rentify, I found a beautiful loft, scheduled a tour, and signed the lease all within 48 hours. The communication is seamless.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
        },
        {
            name: "Elena Rodriguez",
            role: "Property Manager",
            content: "The maintenance tracking feature is a lifesaver. My tenants can upload photos of issues, and I can dispatch contractors instantly. It's like having a full-time assistant.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
        }
    ];

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden" data-name="testimonials" data-file="components/Testimonials.js">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
                    <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Loved by Thousands</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Don't just take our word for it
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <div key={idx} className={`bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 relative group hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animation-delay-${(idx + 1) * 100}`}>
                            <div className="flex gap-1 mb-6 text-yellow-400">
                                <div className="icon-star fill-current"></div>
                                <div className="icon-star fill-current"></div>
                                <div className="icon-star fill-current"></div>
                                <div className="icon-star fill-current"></div>
                                <div className="icon-star fill-current"></div>
                            </div>
                            <p className="text-slate-600 mb-8 leading-relaxed">"{review.content}"</p>
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm shrink-0">
                                    <Image src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                                    <p className="text-sm text-slate-500">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}