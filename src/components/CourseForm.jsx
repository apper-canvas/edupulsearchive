      <div className="space-y-4 pt-4 border-t border-surface-200 dark:border-surface-700">
        <h3 className="text-lg font-medium text-surface-900 dark:text-white">Enrollment & Degree Requirements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Enrollment Capacity
            </label>
            <input
              type="number"
              name="capacity"
              min="1"
              max="500"
              className="form-input"
              value={formData.capacity}
              onChange={handleInputChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Current Enrollment
            </label>
            <input
              type="number"
              name="enrolled"
              min="0"
              max={formData.capacity}
              className="form-input"
              value={formData.enrolled}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-md font-medium text-surface-800 dark:text-surface-200 mb-2">Degree Requirements</h4>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter a degree program or requirement this course fulfills"
              className="form-input flex-1"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
            />
            <button
              type="button"
              onClick={addDegreeRequirement}
              className="btn btn-primary"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-2 mt-3">
            {formData.degreeRequirements.length > 0 ? (
              formData.degreeRequirements.map((req, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-surface-100 dark:bg-surface-800 rounded-lg">
                  <span className="text-surface-800 dark:text-surface-200">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeDegreeRequirement(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-surface-500 dark:text-surface-400 text-sm">No degree requirements added yet.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-surface-200 dark:border-surface-700 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {initialData ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;