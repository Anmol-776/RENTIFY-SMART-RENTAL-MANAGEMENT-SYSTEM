function Toast({ message, type, onClose }) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';

    return (
        <div className="fixed bottom-4 right-4 z-[100] animate-bounce-short">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border ${isSuccess ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <div className={`text-xl ${isSuccess ? 'icon-circle-check text-green-500' : 'icon-circle-alert text-red-500'}`}></div>
                <p className="font-medium">{message}</p>
                <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100">
                    <div className="icon-x"></div>
                </button>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes bounce-short {
                    0% { transform: translateY(100%); opacity: 0; }
                    80% { transform: translateY(-10%); opacity: 1; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .animate-bounce-short {
                    animation: bounce-short 0.3s ease-out forwards;
                }
            `}} />
        </div>
    );
}