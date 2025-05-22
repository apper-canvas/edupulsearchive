import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const colorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
};

const StatsCard = ({ title, value, icon: Icon, iconColor = 'blue', trend = 0, delay = 0, className = '' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`card p-5 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-surface-900 dark:text-white">{value}</h3>
        </div>
        <div className={`rounded-full p-2 ${colorClasses[iconColor]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-2 text-xs font-medium flex items-center">
        {trend > 0 ? (
          <span className="text-green-500 mr-1">↑ {trend}%</span>
        ) : trend < 0 ? (
          <span className="text-red-500 mr-1">↓ {Math.abs(trend)}%</span>
        ) : (
          <span className="text-surface-500 mr-1">—</span>
        )}
        <span className="text-surface-500 dark:text-surface-400">from last semester</span>
      </div>
    </motion.div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.oneOf(['blue', 'purple', 'green', 'amber', 'indigo', 'pink']),
  trend: PropTypes.number,
  delay: PropTypes.number,
  className: PropTypes.string
};

export default StatsCard;