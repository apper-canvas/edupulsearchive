import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  parseISO,
  startOfDay,
  endOfDay,
  isWithinInterval,
  getHours,
  getMinutes,
  setHours,
  setMinutes
} from 'date-fns';

const Calendar = () => {
  // Icons
  const ChevronLeftIcon = getIcon('chevron-left');
  const ChevronRightIcon = getIcon('chevron-right');
  const PlusIcon = getIcon('plus');
  const EditIcon = getIcon('edit');
  const TrashIcon = getIcon('trash');
  const XIcon = getIcon('x');
  const CalendarIcon = getIcon('calendar');
  const ClockIcon = getIcon('clock');
  const TagIcon = getIcon('tag');
  const InfoIcon = getIcon('info');

  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Midterm Exam",
      description: "Physics midterm examination",
      start: (() => {
        const date = new Date();
        date.setHours(10, 0, 0, 0);
        return date;
      })(),
      end: (() => {
        const date = new Date();
        date.setHours(12, 0, 0, 0);
        return date;
      })(),
      category: "exam"
    },
    {
      id: 2,
      title: "Faculty Meeting",
      description: "Weekly department meeting",
      start: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(14, 0, 0, 0);
        return date;
      })(),
      end: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        date.setHours(15, 30, 0, 0);
        return date;
      })(),
      category: "meeting"
    },
    {
      id: 3,
      title: "Student Advising",
      description: "Office hours for student advising",
      start: new Date(new Date().setDate(new Date().getDate() + 2).setHours(13, 0, 0, 0)),
      end: new Date(new Date().setDate(new Date().getDate() + 2).setHours(16, 0, 0, 0)),
      category: "appointment"
    }
  ]);
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Event categories with colors
  const eventCategories = [
    { id: "class", name: "Class", color: "bg-blue-500" },
    { id: "exam", name: "Exam", color: "bg-red-500" },
    { id: "meeting", name: "Meeting", color: "bg-amber-500" },
    { id: "appointment", name: "Appointment", color: "bg-green-500" },
    { id: "deadline", name: "Deadline", color: "bg-purple-500" },
    { id: "other", name: "Other", color: "bg-gray-500" }
  ];

  // Get event color based on category
  const getEventColor = (category) => {
    const eventCategory = eventCategories.find(cat => cat.id === category);
    return eventCategory ? eventCategory.color : "bg-gray-500";
  };

  // Navigation handlers
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const previousWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const previousDay = () => setCurrentDate(addDays(currentDate, -1));
  const nextDay = () => setCurrentDate(addDays(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Event handlers
  const openNewEventModal = (date) => {
    setSelectedDate(date);
    setCurrentEvent({
      id: null,
      title: "",
      description: "",
      start: date,
      end: new Date(new Date(date).setHours(date.getHours() + 1)),
      category: "other"
    });
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (event) => {
    setCurrentEvent(event);
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setCurrentEvent(null);
  };

  const openDeleteModal = (event) => {
    setCurrentEvent(event);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleSaveEvent = (formData) => {
    const newEvent = {
      ...formData,
      id: formData.id || Date.now(),
    };

    if (formData.id) {
      // Update existing event
      setEvents(events.map(event => event.id === formData.id ? newEvent : event));
      toast.success("Event updated successfully");
    } else {
      // Add new event
      setEvents([...events, newEvent]);
      toast.success("Event added successfully");
    }
    closeEventModal();
  };

  const handleDeleteEvent = () => {
    if (currentEvent && currentEvent.id) {
      setEvents(events.filter(event => event.id !== currentEvent.id));
      toast.success("Event deleted successfully");
      closeDeleteModal();
      closeEventModal();
    }
  };

  // Render month view calendar
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    // Render days of week headers
    const daysOfWeek = [];
    const dayFormat = "EEE";
    for (let i = 0; i < 7; i++) {
      daysOfWeek.push(
        <div key={i} className="text-center font-medium py-2">
          {format(addDays(startOfWeek(new Date()), i), dayFormat)}
        </div>
      );
    }

    // Render calendar days
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayEvents = events.filter(event => 
          isSameDay(parseISO(event.start.toISOString()), cloneDay)
        );

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] p-1 border border-surface-200 dark:border-surface-700 ${
              !isSameMonth(day, monthStart)
                ? "bg-surface-100 dark:bg-surface-800/50 text-surface-400 dark:text-surface-600"
                : isSameDay(day, new Date())
                ? "bg-primary/10 dark:bg-primary/20"
                : "bg-white dark:bg-surface-800"
            }`}
            onClick={() => openNewEventModal(new Date(cloneDay))}
          >
            <div className="text-right mb-1">
              <span className={`text-sm font-medium ${
                isSameDay(day, new Date()) ? "text-primary" : ""
              }`}>
                {formattedDate}
              </span>
            </div>
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className={`${getEventColor(event.category)} text-white text-xs p-1 rounded truncate cursor-pointer`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditEventModal(event);
                  }}
                >
                  {format(parseISO(event.start.toISOString()), "HH:mm")} - {event.title}
                </div>
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs text-surface-500 dark:text-surface-400">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="month-view">
        <div className="grid grid-cols-7 border-b border-surface-200 dark:border-surface-700">
          {daysOfWeek}
        </div>
        {rows}
      </div>
    );
  };

  // Render week view calendar
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(weekStart);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    // Get all days of the week
    const days = [];
    let day = weekStart;
    while (day <= weekEnd) {
      days.push(day);
      day = addDays(day, 1);
    }

    return (
      <div className="week-view overflow-x-auto">
        <div className="grid grid-cols-8 border-b border-surface-200 dark:border-surface-700">
          <div className="text-center font-medium py-2">Hour</div>
          {days.map((day, i) => (
            <div key={i} className="text-center font-medium py-2">
              <div>{format(day, "EEE")}</div>
              <div className={`text-sm ${isSameDay(day, new Date()) ? "text-primary font-bold" : ""}`}>
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
        <div className="week-grid">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b border-surface-200 dark:border-surface-700">
              <div className="text-xs text-center py-2 border-r border-surface-200 dark:border-surface-700">
                {hour}:00
              </div>
              {days.map((day, dayIndex) => {
                const hourStart = new Date(day);
                hourStart.setMinutes(0);
                hourStart.setHours(hour);
                
                const hourEnd = new Date(day);
                hourEnd.setMinutes(59);
                hourEnd.setHours(hour);
                
                const cellEvents = events.filter(event => {
                  const eventStart = parseISO(event.start.toISOString());
                  const eventEnd = parseISO(event.end.toISOString());
                  return isWithinInterval(hourStart, { start: eventStart, end: eventEnd }) ||
                         isWithinInterval(hourEnd, { start: eventStart, end: eventEnd }) ||
                         (eventStart <= hourStart && eventEnd >= hourEnd);
                });
                
                return (
                  <div 
                    key={dayIndex} 
                    className="relative min-h-[50px] p-1"
                    onClick={() => {
                      const newDate = new Date(day);
                      newDate.setHours(hour);
                      openNewEventModal(newDate);
                    }}
                  >
                    {cellEvents.map(event => (
                      <div
                        key={event.id}
                        className={`${getEventColor(event.category)} text-white text-xs p-1 mb-1 rounded truncate cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditEventModal(event);
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render day view calendar
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="day-view">
        <div className="text-center font-medium py-4 border-b border-surface-200 dark:border-surface-700">
          <div className="text-lg">{format(currentDate, "EEEE")}</div>
          <div className={`text-2xl ${isSameDay(currentDate, new Date()) ? "text-primary font-bold" : ""}`}>
            {format(currentDate, "MMMM d, yyyy")}
          </div>
        </div>
        <div className="day-grid">
          {hours.map(hour => {
            const hourStart = new Date(currentDate);
            hourStart.setMinutes(0);
            hourStart.setHours(hour);
            
            const hourEnd = new Date(currentDate);
            hourEnd.setMinutes(59);
            hourEnd.setHours(hour);
            
            const hourEvents = events.filter(event => {
              const eventStart = parseISO(event.start.toISOString());
              const eventEnd = parseISO(event.end.toISOString());
              return isWithinInterval(hourStart, { start: eventStart, end: eventEnd }) ||
                     isWithinInterval(hourEnd, { start: eventStart, end: eventEnd }) ||
                     (eventStart <= hourStart && eventEnd >= hourEnd);
            });
            
            return (
              <div 
                key={hour} 
                className="grid grid-cols-12 border-b border-surface-200 dark:border-surface-700"
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setHours(hour);
                  openNewEventModal(newDate);
                }}
              >
                <div className="col-span-1 text-center py-4 border-r border-surface-200 dark:border-surface-700">
                  {hour}:00
                </div>
                <div className="col-span-11 p-2 min-h-[80px] relative">
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className={`${getEventColor(event.category)} text-white p-2 mb-2 rounded-lg cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditEventModal(event);
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm">{format(parseISO(event.start.toISOString()), "HH:mm")} - {format(parseISO(event.end.toISOString()), "HH:mm")}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Calendar</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex space-x-2">
              <button
                className="btn btn-outline px-2 py-1"
                onClick={goToToday}
              >
                Today
              </button>
              <button
                className="btn btn-outline px-2 py-1"
                onClick={view === 'month' ? previousMonth : view === 'week' ? previousWeek : previousDay}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button
                className="btn btn-outline px-2 py-1"
                onClick={view === 'month' ? nextMonth : view === 'week' ? nextWeek : nextDay}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold">
              {view === 'month' 
                ? format(currentDate, 'MMMM yyyy')
                : view === 'week'
                ? `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM d, yyyy')}
            </h2>
            
            <div className="flex space-x-2">
              <button
                className={`btn ${view === 'month' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setView('month')}
              >
                Month
              </button>
              <button
                className={`btn ${view === 'week' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button
                className={`btn ${view === 'day' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setView('day')}
              >
                Day
              </button>
            </div>
            
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={() => openNewEventModal(new Date())}
            >
              <PlusIcon className="h-5 w-5" />
              Add Event
            </button>
          </div>
        </div>
        
        <div className="calendar-container bg-white dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>
      </div>
      
      {/* Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {currentEvent?.id ? 'Edit Event' : 'Add Event'}
                </h2>
                <button
                  onClick={closeEventModal}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <EventForm
                event={currentEvent}
                onSave={handleSaveEvent}
                onDelete={openDeleteModal}
                onCancel={closeEventModal}
                categories={eventCategories}
              />
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Delete Event</h2>
              <p className="mb-4">Are you sure you want to delete "{currentEvent?.title}"? This action cannot be undone.</p>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={closeDeleteModal}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="btn bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Event Form Component
const EventForm = ({ event, onSave, onDelete, onCancel, categories }) => {
  const [formData, setFormData] = useState({
    id: event?.id || null,
    title: event?.title || '',
    description: event?.description || '',
    start: event?.start || new Date(),
    end: event?.end || new Date(new Date().setHours(new Date().getHours() + 1)),
    category: event?.category || 'other'
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      const newStart = new Date(value);
      newStart.setHours(formData.start.getHours(), formData.start.getMinutes());
      setFormData({ ...formData, start: newStart });
    } else if (name === 'endDate') {
      const newEnd = new Date(value);
      newEnd.setHours(formData.end.getHours(), formData.end.getMinutes());
      setFormData({ ...formData, end: newEnd });
    }
  };
  
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const [hours, minutes] = value.split(':').map(Number);
    
    if (name === 'startTime') {
      const newStart = new Date(formData.start);
      newStart.setHours(hours, minutes);
      setFormData({ ...formData, start: newStart });
    } else if (name === 'endTime') {
      const newEnd = new Date(formData.end);
      newEnd.setHours(hours, minutes);
      setFormData({ ...formData, end: newEnd });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.end < formData.start) {
      newErrors.end = 'End time must be after start time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1 form-label-required">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Event title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-input"
            rows="3"
            placeholder="Event description"
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-1 form-label-required">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-4 w-4 text-surface-500" />
              </div>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={format(formData.start, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                className="form-input pl-10"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-1 form-label-required">
              Start Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-4 w-4 text-surface-500" />
              </div>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={`${formData.start.getHours().toString().padStart(2, '0')}:${formData.start.getMinutes().toString().padStart(2, '0')}`}
                onChange={handleTimeChange}
                className="form-input pl-10"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium mb-1 form-label-required">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-4 w-4 text-surface-500" />
              </div>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={format(formData.end, 'yyyy-MM-dd')}
                onChange={handleDateChange}
                className={`form-input pl-10 ${errors.end ? 'border-red-500' : ''}`}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium mb-1 form-label-required">
              End Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ClockIcon className="h-4 w-4 text-surface-500" />
              </div>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={`${formData.end.getHours().toString().padStart(2, '0')}:${formData.end.getMinutes().toString().padStart(2, '0')}`}
                onChange={handleTimeChange}
                className={`form-input pl-10 ${errors.end ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1 form-label-required">
            Category
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TagIcon className="h-4 w-4 text-surface-500" />
            </div>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input pl-10"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 pt-4">
          {formData.id && (
            <button
              type="button"
              onClick={() => onDelete(formData)}
              className="btn flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white"
            >
              <TrashIcon className="h-4 w-4" />
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
          >
            {formData.id ? (
              <>
                <EditIcon className="h-4 w-4" />
                Update
              </>
            ) : (
              <>
                <PlusIcon className="h-4 w-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Calendar;