import PropTypes from 'prop-types';
import { getIcon } from '../../utils/iconUtils';

const typeColors = {
  course: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  student: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  assessment: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  attendance: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  system: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
};

const ActivityItem = ({ action, details, timestamp, icon, user, type = 'system' }) => {
  const ActivityIcon = getIcon(icon);
  const UserCircleIcon = getIcon('user-circle');
  
  return (
    <div className="p-4 md:px-5 flex items-start gap-4">
      <div className={`rounded-full p-2 ${typeColors[type]}`}>
        <ActivityIcon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="font-medium text-surface-900 dark:text-white truncate">{action}</p>
          <span className="text-xs text-surface-500 dark:text-surface-500 shrink-0 ml-2">{timestamp}</span>
        </div>
        <p className="text-sm text-surface-600 dark:text-surface-400">{details}</p>
        
        <div className="flex items-center mt-2">
          <UserCircleIcon className="h-4 w-4 text-surface-400 dark:text-surface-500 mr-1" />
          <p className="text-xs text-surface-500 dark:text-surface-500">
            {user}
          </p>
        </div>
      </div>
    </div>
  );
};

ActivityItem.propTypes = {
  action: PropTypes.string.isRequired,
  details: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  user: PropTypes.string,
  type: PropTypes.oneOf(['course', 'student', 'assessment', 'attendance', 'system'])
};

export default ActivityItem;