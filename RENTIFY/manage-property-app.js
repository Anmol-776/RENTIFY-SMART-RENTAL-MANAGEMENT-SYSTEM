function ManagePropertyApp() {
    const [user, setUser] = React.useState(null);
    const [toast, setToast] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    
    // Check if editing
    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');

    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        rent_price: '',
        city: '',
        type: 'Apartment',
        bedrooms: 1,
        bathrooms: 1,
        furnished: false,
        amenities: [],
        status: 'Available',
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80']
    });

    React.useEffect(() => {
        try {
            const currentUser = AuthService.requireAuth();
            if (!currentUser) return;

            if (currentUser.role !== 'owner' && currentUser.role !== 'admin') {
                window.location.href = 'dashboard.html';
                return;
            }
            setUser(currentUser);

            if (editId) {
                PropertyService.getById(editId).then(property => {
                    if (property && property.objectData) {
                        setFormData({
                            ...property.objectData,
                            rent_price: property.objectData.rent_price ? property.objectData.rent_price.toString() : '0',
                            bedrooms: property.objectData.bedrooms ? property.objectData.bedrooms.toString() : '0',
                            bathrooms: property.objectData.bathrooms ? property.objectData.bathrooms.toString() : '0'
                        });
                    }
                }).catch(e => {
                    console.error(e);
                    setToast({ type: 'error', message: 'Failed to load property details' });
                });
            }
        } catch (error) {
            console.error('Error in auth or loading property:', error);
        }
    }, [editId]);

    const handleGenerateDescription = async () => {
        if (!formData.title || !formData.city) {
            setToast({ type: 'error', message: 'Please enter Title and City first to generate.' });
            return;
        }
        setToast({ type: 'success', message: 'AI is writing your description...' });
        try {
            const prompt = `Write a premium, engaging, and professional real estate property description based on these details: Title: ${formData.title}, City: ${formData.city}, Type: ${formData.type}, Bedrooms: ${formData.bedrooms}, Bathrooms: ${formData.bathrooms}. Output ONLY the description text, under 150 words.`;
            const result = await invokeAIAgent("You are an expert real estate copywriter.", prompt);
            setFormData(prev => ({ ...prev, description: result.trim() }));
            setToast({ type: 'success', message: 'Description generated!' });
        } catch (e) {
            setToast({ type: 'error', message: 'Failed to generate description.' });
        }
    };

    const handleSuggestPrice = async () => {
        if (!formData.city || !formData.type) {
            setToast({ type: 'error', message: 'Please enter City and Type first.' });
            return;
        }
        setToast({ type: 'success', message: 'AI is analyzing market rates...' });
        try {
            const prompt = `Suggest a realistic monthly rental price in USD for a ${formData.bedrooms} bed, ${formData.bathrooms} bath ${formData.type} in ${formData.city}. Output ONLY a number without commas or symbols (e.g., 2500).`;
            const result = await invokeAIAgent("You are a real estate pricing analyst.", prompt);
            const price = parseInt(result.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(price)) {
                setFormData(prev => ({ ...prev, rent_price: price.toString() }));
                setToast({ type: 'success', message: 'Price suggested!' });
            }
        } catch (e) {
            setToast({ type: 'error', message: 'Failed to suggest price.' });
        }
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => {
            const newAmenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities: newAmenities };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSave = {
                ...formData,
                rent_price: Number(formData.rent_price),
                bedrooms: Number(formData.bedrooms),
                bathrooms: Number(formData.bathrooms),
                owner_id: user.id
            };

            if (editId) {
                await PropertyService.update(editId, dataToSave);
                setToast({ type: 'success', message: 'Property updated successfully!' });
            } else {
                await PropertyService.create(dataToSave);
                setToast({ type: 'success', message: 'Property listed successfully!' });
            }
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            setToast({ type: 'error', message: error.message || 'Failed to save property' });
            setLoading(false);
        }
    };

    const AMENITIES_LIST = ['WiFi', 'Parking', 'Pool', 'Gym', 'Air Conditioning', 'Heating', 'Balcony', 'Pet Friendly'];

    if (!user) return null;

    return (
        <div className="min-h-screen pt-24 pb-12">
            <Navbar />
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{editId ? 'Edit Property' : 'List New Property'}</h1>
                        <p className="text-slate-500 mt-2">Fill in the details to publish your property on Rentify.</p>
                    </div>
                    <a href="dashboard.html" className="btn-secondary">Cancel</a>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold border-b pb-2">Basic Details</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Property Title</label>
                                <input required type="text" className="input-field" placeholder="e.g., Luxury Downtown Apartment" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                                    <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                        <option value="Apartment">Apartment</option>
                                        <option value="House">House</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Studio">Studio</option>
                                        <option value="Condo">Condo</option>
                                    </select>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-slate-700">Monthly Rent Price ($)</label>
                                        <button type="button" onClick={handleSuggestPrice} className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full transition-colors">
                                            <div className="icon-wand-sparkles text-xs"></div> AI Suggest
                                        </button>
                                    </div>
                                    <input required type="number" min="0" className="input-field" placeholder="2000" value={formData.rent_price} onChange={e => setFormData({...formData, rent_price: e.target.value})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">City / Location</label>
                                <input required type="text" className="input-field" placeholder="e.g., New York, NY" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-slate-700">Description</label>
                                    <button type="button" onClick={handleGenerateDescription} className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full transition-colors">
                                        <div className="icon-wand-sparkles text-xs"></div> AI Generate
                                    </button>
                                </div>
                                <textarea required rows="4" className="input-field" placeholder="Describe your property..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold border-b pb-2">Features & Amenities</h3>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                                    <input required type="number" min="0" className="input-field" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
                                    <input required type="number" min="0" step="0.5" className="input-field" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Furnished</label>
                                    <div className="pt-2 flex items-center gap-2">
                                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" checked={formData.furnished} onChange={e => setFormData({...formData, furnished: e.target.checked})} />
                                        <span>Fully Furnished</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                        <option value="Available">Available</option>
                                        <option value="Rented">Rented</option>
                                        <option value="Hidden">Hidden</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Amenities</label>
                                <div className="flex flex-wrap gap-3">
                                    {AMENITIES_LIST.map(amenity => (
                                        <button 
                                            key={amenity}
                                            type="button"
                                            onClick={() => handleAmenityToggle(amenity)}
                                            className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${formData.amenities.includes(amenity) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200'}`}
                                        >
                                            {amenity}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t flex justify-end gap-4">
                            <button type="button" onClick={() => window.location.href='dashboard.html'} className="btn-secondary">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary min-w-[160px] flex items-center justify-center gap-2">
                                {loading ? <div className="icon-loader animate-spin"></div> : 'Save Property'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ManagePropertyApp />);