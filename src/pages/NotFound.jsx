import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const navigate = useNavigate();
  
  // Icons
  const FrownIcon = getIcon('frown');
  const HomeIcon = getIcon('home');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-surface-100 dark:bg-surface-800 p-6">
            <FrownIcon className="h-16 w-16 text-surface-400" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 text-surface-900 dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-surface-800 dark:text-surface-200">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;