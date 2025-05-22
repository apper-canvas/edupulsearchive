             <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
               {filteredAssessments.length > 0 ? (
                 filteredAssessments.map((assessment) => (
                  <>
                  <React.Fragment key={assessment.id}>
                     <motion.tr 
                       key={assessment.id}
                       initial={{ opacity: 0 }}
                         </td>
                       </tr>
                     )}
                  </>
                  </React.Fragment>
                 ))
               ) : (
                 <tr>
