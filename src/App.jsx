import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getIcon } from './utils/iconUtils';
import { setUser, clearUser } from './store/userSlice';
 
// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Calendar from './pages/Calendar';
import Assessments from './pages/Assessments';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
               ? `/signup?redirect=${currentPath}`
               : currentPath.includes('/login')
               ? `/login?redirect=${currentPath}`
               : '/login');
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
      }
    });
  }, [dispatch, navigate]);

  // Handle dark mode toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Icons
  const SchoolIcon = getIcon('school');
  const SunIcon = getIcon('sun');
  const MoonIcon = getIcon('moon');
  const GraduationCapIcon = getIcon('graduation-cap');
  const MenuIcon = getIcon('menu');
  const XIcon = getIcon('x');
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation Items
  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'layout-dashboard' },
    { name: 'Courses', path: '/courses', icon: 'book-open' },
    { name: 'Students', path: '/students', icon: 'users' },
    { name: 'Assessments', path: '/assessments', icon: 'clipboard-check' },
    { name: 'Calendar', path: '/calendar', icon: 'calendar' },
    { name: 'Logout', path: '/logout', icon: 'log-out' },
  ];

  // Toggle Mobile Menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success("Logged out successfully!");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    }
  };
  
  // Handle navigation item click
  const handleNavClick = (e, path) => {
    e.preventDefault();
    if (path === '/logout') {
      authMethods.logout();
    } else {
      navigate(path);
      setIsMobileMenuOpen(false);
    }
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to={`/login?redirect=${location.pathname}`} />;
    }
    return children;
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="text-center">
        <GraduationCapIcon className="h-12 w-12 text-primary mx-auto animate-pulse" />
        <h1 className="text-xl mt-4 font-semibold">Initializing EduPulse...</h1>
      </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen flex flex-col">
        {isAuthenticated && (
          <>
            {/* Header */}
            <header className="sticky top-0 bg-white/95 dark:bg-surface-800/95 backdrop-blur-sm border-b border-surface-200 dark:border-surface-700 z-10 shadow-sm">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      className="md:hidden btn btn-outline p-2"
                      onClick={toggleMobileMenu}
                      aria-label="Toggle menu"
                    >
                      {isMobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                    </button>
                    
                    <div className="flex items-center gap-2" onClick={() => navigate('/')} role="button">
                      <GraduationCapIcon className="h-8 w-8 text-primary" />
                      <span className="text-xl font-bold text-surface-900 dark:text-white">EduPulse</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {userState?.user && (
                      <div className="hidden md:block text-right mr-3">
                        <div className="text-sm font-medium text-surface-900 dark:text-white">{userState.user.name || userState.user.email}</div>
                        <div className="text-xs text-surface-500">{userState.user.email}</div>
                      </div>
                    )}
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                      aria-label="Toggle dark mode"
                    >
                      {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </header>
        
            {/* Main Content */}
            <div className="flex flex-1">
              {/* Sidebar - Desktop */}
              <aside className="hidden md:flex flex-col w-64 border-r border-surface-200 dark:border-surface-700 bg-white/95 dark:bg-surface-800/95 backdrop-blur-sm py-6">
                <div className="px-4 mb-6">
                  <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    Menu
                  </h2>
                </div>
                
                <nav className="space-y-1 px-2">
                  {navItems.map((item) => {
                    const Icon = getIcon(item.icon);
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <a 
                        key={item.name}
                        href={item.path} 
                        onClick={(e) => handleNavClick(e, item.path)}
                        className={`nav-link ${isActive ? 'active' : ''}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </a>
                    );
                  })}
                </nav>
              </aside>
              
              {/* Mobile Menu Overlay */}
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                  onClick={toggleMobileMenu}
                />
              )}
              
              {/* Mobile Menu */}
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-surface-800 shadow-lg z-30 md:hidden overflow-y-auto"
              >
                <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                  <div className="flex items-center gap-2">
                    <SchoolIcon className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold">EduPulse</span>
                  </div>
                  <button 
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <nav className="p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = getIcon(item.icon);
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <a 
                        key={item.name}
                        href={item.path} 
                        onClick={(e) => handleNavClick(e, item.path)}
                        className={`nav-link ${isActive ? 'active' : ''}`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </a>
                    );
                  })}
                </nav>
              </motion.aside>
              
              {/* Main Content */}
              <main className="flex-1 overflow-x-hidden bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
                <Routes>
                  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
                  <Route path="/students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
                  <Route path="/assessments" element={<ProtectedRoute><Assessments /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </>
        )}

        {!isAuthenticated && (
          <main className="flex-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </main>
        )}
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
        toastClassName="!bg-white dark:!bg-surface-800 !shadow-card"
        progressClassName="!bg-primary"
      />
    </div>
    </AuthContext.Provider>
  );
}

export default App;