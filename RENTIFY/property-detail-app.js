function PropertyDetailApp() {
    const [property, setProperty] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [toast, setToast] = React.useState(null);

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
            PropertyService.getById(id).then(data => {
                setProperty(data);
                setLoading(false);
            }).catch(e => {
                setLoading(false);
            });
        }
    }, []);

    const handleScheduleVisit = async () => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        if (user.role !== 'tenant') {
            setToast({ type: 'error', message: 'Only tenants can schedule visits.' });
            return;
        }
        
        try {
            await NotificationService.createNotification(
                property.objectData.owner_id,
                'New Visit Request',
                `${user.name} wants to schedule a visit for ${property.objectData.title}.`,
                'system',
                `chat.html`
            );
            setToast({ type: 'success', message: 'Visit request sent! The owner will be notified.' });
        } catch (e) {
            setToast({ type: 'error', message: 'Failed to send visit request.' });
        }
    };

    if (loading) return <div className="min-h-screen pt-24 flex justify-center"><div className="icon-loader animate-spin text-4xl text-indigo-600"></div></div>;
    if (!property) return <div className="min-h-screen pt-24 text-center"><h1 className="text-2xl mt-10">Property not found</h1></div>;

    const data = property.objectData;

    return (
        <div className="min-h-screen pt-24 pb-20">
            <Navbar />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header & Image */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{data.title}</h1>
                    <p className="text-slate-500 flex items-center gap-2">
                        <span className="icon-map-pin"></span> {data.city}
                    </p>
                </div>

                <div className="rounded-3xl overflow-hidden h-[400px] lg:h-[500px] mb-12 shadow-sm border border-slate-100 relative">
                    <Image src={data.images?.[0]} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-1000" />
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="flex gap-6 pb-8 border-b border-slate-200">
                            <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-100 flex-1 shadow-sm">
                                <div className="icon-bed-double text-2xl text-indigo-600 mb-2"></div>
                                <span className="font-bold text-slate-900">{data.bedrooms}</span>
                                <span className="text-slate-500 text-sm">Bedrooms</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-100 flex-1 shadow-sm">
                                <div className="icon-bath text-2xl text-indigo-600 mb-2"></div>
                                <span className="font-bold text-slate-900">{data.bathrooms}</span>
                                <span className="text-slate-500 text-sm">Bathrooms</span>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-100 flex-1 shadow-sm">
                                <div className="icon-sofa text-2xl text-indigo-600 mb-2"></div>
                                <span className="font-bold text-slate-900">{data.furnished ? 'Yes' : 'No'}</span>
                                <span className="text-slate-500 text-sm">Furnished</span>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">About this home</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{data.description}</p>
                        </div>

                        {Array.isArray(data.amenities) && data.amenities.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">What this place offers</h2>
                                <div className="grid grid-cols-2 gap-y-4">
                                    {data.amenities.map(a => (
                                        <div key={a} className="flex items-center gap-3 text-slate-700">
                                            <div className="icon-check text-indigo-500"></div> {a}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Pricing Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="mb-6 pb-6 border-b border-slate-100">
                                <div className="flex items-end gap-1 mb-2">
                                    <span className="text-4xl font-bold text-slate-900">${data.rent_price}</span>
                                    <span className="text-slate-500 mb-1">/ month</span>
                                </div>
                                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${data.status === 'Available' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {data.status}
                                </div>
                            </div>

                            <button 
                                onClick={handleScheduleVisit}
                                className="btn-primary w-full mb-4"
                            >
                                Schedule a Visit
                            </button>
                            <button 
                                onClick={async () => {
                                    const user = AuthService.getCurrentUser();
                                    if(!user) return window.location.href = 'login.html';
                                    if(user.role !== 'tenant') return setToast({type: 'error', message: 'Only tenants can contact owners.'});
                                    const conv = await ChatService.getOrCreateConversation(user.id, data.owner_id, property.objectId);
                                    window.location.href = `chat.html?id=${conv.objectId}`;
                                }}
                                className="w-full px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-slate-300 transition-colors flex items-center justify-center gap-2"
                            >
                                <div className="icon-message-circle"></div> Contact Owner
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PropertyDetailApp />);