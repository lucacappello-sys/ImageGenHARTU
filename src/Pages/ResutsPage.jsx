import './ResultsPage.css';

export default function ResultsPage({ selectedRole, capturedImage, generatedImageUrl, onClose, onBack }) {
  const roleData = {
    'SMART LINE OPERATOR': {
      skills: [
        { name: 'Technical', value: 83 },
        { name: 'Interaction/UX', value: 53 },
        { name: 'Analytical', value: 50 },
        { name: 'Collaboration/ Communication', value: 43 },
        { name: 'Personal/soft', value: 34 },
        { name: 'Operational', value: 25 },
        { name: 'Management', value: 18 }
      ],
      tasks: [
        { name: 'Planning and configuration', value: 7, color: '#009B76' },
        { name: 'Execution and Operation', value: 60, color: '#E0A727' },
        { name: 'Management and Supervision', value: 11, color: '#007BF4' },
        { name: 'Collaboration and Assistance', value: 3.6, color: '#DD455F' },
        { name: 'Quality control', value: 11, color: '#8E554F' },
        { name: 'Handling of Alarms and Failures', value: 7, color: '#DD6BDA' }
      ]
    },
    'PLANT FLOW-KEEPER': {
      skills: [
        { name: 'Technical', value: 72 },
        { name: 'Interaction/UX', value: 67 },
        { name: 'Analytical', value: 55 },
        { name: 'Management', value: 55 },
        { name: 'Collaboration/ Communication', value: 43 },
        { name: 'Personal/soft', value: 35 },
        { name: 'Operational', value: 28 },

      ],
      tasks: [
        { name: 'Planning and configuration', value: 27, color: '#009B76' },
        { name: 'Execution and Operation', value: 5, color: '#E0A727' },
        { name: 'Management and Supervision', value: 32, color: '#007BF4' },
        { name: 'Collaboration and Assistance', value: 13.5, color: '#DD455F' },
        { name: 'Quality control', value: 18, color: '#8E554F' },
        { name: 'Handling of Alarms and Failures', value: 4.5, color: '#DD6BDA' }
      ]
    },
    'TECH SOLVER': {
      skills: [
        { name: 'Technical', value: 88 },
        { name: 'Analytical', value: 72.6 },
        { name: 'Interaction/UX', value: 50 },
        { name: 'Operational', value: 30 },
        { name: 'Collaboration/ Communication', value: 15 },
        { name: 'Personal/soft', value: 0 },
        { name: 'Management', value: 0 }
      ],
      tasks: [
        { name: 'Planning and configuration', value: 16.5, color: '#009B76' },
        { name: 'Execution and Operation', value: 0, color: '#E0A727' },
        { name: 'Management and Supervision', value: 33, color: '#007BF4' },
        { name: 'Collaboration and Assistance', value: 0, color: '#DD455F' },
        { name: 'Quality control', value: 50, color: '#8E554F' },
        { name: 'Handling of Alarms and Failures', value: 0, color: '#DD6BDA' }
      ]
    }
  };

  const data = roleData[selectedRole?.title] || roleData['SMART LINE OPERATOR'];
  const roleColor = selectedRole?.color || '#3B82F6';

  return (
    <div className="results-page-container">
      <div className="results-header-container">
        <div className="results-header-content">
          <h1 className="results-title">Result</h1>
          <p className="results-description">
            This is a summary of the main tasks and skills required for the selected role, which will operate in an Industry 5.0 context within the food sector.
          </p>
        </div>
      </div>

      <div className="results-body-container">
        <div className="results-body-content">
          <div
            className="results-card"
            style={{ background: `linear-gradient(135deg, ${roleColor}dd 0%, ${roleColor} 100%)` }}
          >
            {/* LEFT: immagine */}
            <div className="results-image-section">
              <div className="results-image-stack">
                <div className="results-image-block">
                  <div className="results-image-label"></div>
                  {generatedImageUrl ? (
                    <img src={generatedImageUrl} alt="Result" className="results-user-image" />
                  ) : (
                    <div className="results-image-placeholder">Nessuna immagine generata</div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: skills */}
            <div className="results-skills-section">
              <h2 className="results-section-title" style={{ color: roleColor }} >Skills</h2>
              <div className="results-items-list">
                {data.skills.map((skill, index) => (
                  <div key={index} className="results-item">
                    <div className="results-item-content">
                      <div className="results-progress-bar-container">
                        <div
                          className="results-progress-bar"
                          style={{ width: `${skill.value}%`, backgroundColor: roleColor }}
                        />
                      </div>
                      <span className="results-item-label">{skill.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: tasks */}
            <div className="results-tasks-section">
              <h2 className="results-section-title" style={{ color: roleColor }}>Tasks</h2>
              <div className="results-items-list">
                {data.tasks.map((task, index) => (
                  <div key={index} className="results-item">
                    <div className="results-item-content">
                      <div className="results-progress-bar-container">
                        <div
                          className="results-progress-bar"
                          style={{ width: `${task.value}%`, backgroundColor: task.color }}
                        />
                      </div>
                      <span className="results-item-label">{task.name}</span>

                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="results-footer-container">
        <div className="results-footer-content">
           <button onClick={onBack} className="back-button">
            <svg className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="results-progress-indicator">
            <div className="results-progress-dot"></div>
            <div className="results-progress-dot"></div>
            <div className="results-progress-dot active"></div>
          </div>

          <button onClick={onClose} className="results-close-button">
            Close
            <svg className="results-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
