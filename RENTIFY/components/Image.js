function Image({ src, alt, className, fallbackSrc }) {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    const defaultFallback = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'; // Clean real estate fallback
    const finalSrc = hasError || !src ? (fallbackSrc || defaultFallback) : src;

    return (
        <div className={`relative w-full h-full overflow-hidden bg-slate-100 ${!isLoaded ? 'animate-pulse' : ''}`}>
            {/* Skeleton loader background */}
            <div className={`absolute inset-0 bg-slate-200 transition-opacity duration-300 ${isLoaded ? 'opacity-0 z-0' : 'opacity-100 z-10'}`}>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="icon-image text-slate-300 text-3xl"></div>
                </div>
            </div>
            
            {/* Actual image */}
            <img 
                src={finalSrc}
                alt={alt || "Property Image"}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true);
                }}
                className={`${className} transition-opacity duration-700 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
}