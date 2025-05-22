import PropTypes from 'prop-types';
import { getIcon } from '../../utils/iconUtils';

const priorityClasses = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
};

const statusClasses = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  upcoming: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
};

const DeadlineItem = ({ title, course, dueDate, priority = 'medium', status = 'pending' }) => {
  const CalendarIcon = getIcon('calendar');
  const BookIcon = getIcon('book');
  const ClockIcon = getIcon('clock');
  
  return (
    <div className="p-4 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-surface-900 dark:text-white">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityClasses[priority]}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400 mb-2">
        <BookIcon className="h-4 w-4 text-surface-500" />
        <span>{course}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <ClockIcon className="h-4 w-4 text-surface-500" />
          <span className="text-surface-700 dark:text-surface-300 font-medium">{dueDate}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusClasses[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );
};

DeadlineItem.propTypes = {
  title: PropTypes.string.isRequired,
  course: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  priority: PropTypes.oneOf(['high', 'medium', 'low']),
  status: PropTypes.oneOf(['pending', 'upcoming', 'completed'])
};

export default DeadlineItem;