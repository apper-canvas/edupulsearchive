import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Calendar from './pages/Calendar';
import Assessments from './pages/Assessments';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
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
  ];

  // Toggle Mobile Menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 z-10">
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
        <aside className="hidden md:flex flex-col w-64 border-r border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 py-6">
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
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                  }}
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
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
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
        <main className="flex-1 overflow-x-hidden bg-surface-50 dark:bg-surface-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/students" element={<Students />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      
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
  );
}

export default App;