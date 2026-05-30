function PropertiesApp() {
    const [properties, setProperties] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filters, setFilters] = React.useState({ city: '', type: '' });
    const [favorites, setFavorites] = React.useState([]);
    const user = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;

    React.useEffect(() => {
        loadProperties();
        if (user) {
            FavoriteService.getUserFavorites(user.id).then(favs => {
                setFavorites(favs.map(f => f.objectData.property_id));
            });
        }
    }, [filters, user?.id]);

    const loadProperties = async () => {
        setLoading(true);
        try {
            const data = await PropertyService.search(filters);
            setProperties(data.filter(p => p.objectData.status === 'Available'));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleToggleFavorite = async (e, propertyId) => {
        e.preventDefault();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        try {
            const added = await FavoriteService.toggleFavorite(user.id, propertyId);
            if (added) {
                setFavorites([...favorites, propertyId]);
            } else {
                setFavorites(favorites.filter(id => id !== propertyId));
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Explore Properties</h1>
                    <p className="text-slate-500 mt-2">Find your perfect home with AI-powered search.</p>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 icon-search text-slate-400"></div>
                        <input 
                            type="text" 
                            placeholder="Search by city..." 
                            className="input-field pl-12"
                            value={filters.city}
                            onChange={(e) => setFilters({...filters, city: e.target.value})}
                        />
                    </div>
                    <select 
                        className="input-field md:w-48"
                        value={filters.type}
                        onChange={(e) => setFilters({...filters, type: e.target.value})}
                    >
                        <option value="">All Types</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Villa">Villa</option>
                    </select>
                </div>

                {/* Listing Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                                <div className="h-56 bg-slate-200"></div>
                                <div className="p-5 space-y-4">
                                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                    <div className="pt-4 border-t border-slate-100 flex gap-4">
                                        <div className="h-4 bg-slate-200 rounded w-8"></div>
                                        <div className="h-4 bg-slate-200 rounded w-8"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : properties.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="icon-search-x text-4xl text-slate-400"></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
                        <p className="text-slate-500 mb-6">Try adjusting your search filters to find what you're looking for.</p>
                        <button onClick={() => setFilters({city: '', type: ''})} className="btn-secondary">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {properties.map(p => (
                            <a href={`property-detail.html?id=${p.objectId}`} key={p.objectId} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col">
                                <div className="h-56 overflow-hidden relative bg-slate-100">
                                    <Image src={p.objectData.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold text-slate-900 shadow-sm z-10">
                                        ${p.objectData.rent_price} <span className="text-slate-500 text-xs font-normal">/mo</span>
                                    </div>
                                    <button className="absolute top-4 right-4 w-8 h-8 bg-white/95 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors shadow-sm z-10" onClick={(e) => handleToggleFavorite(e, p.objectId)}>
                                        <div className={`icon-heart ${favorites.includes(p.objectId) ? 'text-red-500' : ''}`}></div>
                                    </button>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-2 bg-indigo-50 w-fit px-2 py-1 rounded-md">
                                        <div className="icon-building-2"></div>
                                        {p.objectData.type}
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{p.objectData.title}</h3>
                                    <p className="text-slate-500 text-sm mb-4 flex items-center gap-1 truncate"><span className="icon-map-pin text-slate-400"></span>{p.objectData.city}</p>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                        <div className="flex gap-4 text-slate-500 text-sm font-medium">
                                            <div className="flex items-center gap-1.5"><div className="icon-bed-double"></div> {p.objectData.bedrooms}</div>
                                            <div className="flex items-center gap-1.5"><div className="icon-bath"></div> {p.objectData.bathrooms}</div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PropertiesApp />);