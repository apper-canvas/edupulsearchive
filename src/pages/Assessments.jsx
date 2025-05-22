             <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
               {filteredAssessments.length > 0 ? (
                 filteredAssessments.map((assessment) => (
                    <motion.tr 
                      key={assessment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-800 cursor-pointer"
                      onClick={() => handleAssessmentClick(assessment)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">{assessment.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{assessment.type}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{assessment.course}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(assessment.dueDate)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{assessment.status}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">{renderAssessmentActions(assessment)}</td>
                    </motion.tr>
                 ))
               ) : (
                 <tr>