class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
            <div className="icon-triangle-alert text-4xl text-red-500 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Oops! Something went wrong</h1>
            <p className="text-slate-600 mb-6">We encountered an unexpected error. Please try reloading the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  try {
    return (
      <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 relative" data-name="app" data-file="app.js">
        <Navbar />
        <main>
          <Hero />
          <div className="reveal"><Features /></div>
          <div className="reveal"><Testimonials /></div>
        </main>
        <Footer />
        <AIChatbot />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);