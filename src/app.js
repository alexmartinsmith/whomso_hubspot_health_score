import React, { useState } from 'react';

const CATEGORY_OPTIONS = {
  "Customer Engagement (Last 30 days)": [
    "Emails Sent",
    "Meetings Held",
    "Login Activity",
    "Time in Product",
    "Feature Adoption",
    "Survey Responses"
  ],
  "Customer Sentiment": [
    "CSM Sentiment",
    "Customer Feedback",
    "Net Promoter Score (NPS)"
  ],
  "Support Interactions": [
    "Support Tickets Raised",
    "Satisfaction with Support"
  ],
  "Financial Metrics": [
    "Renewal Likelihood",
    "Contract Value Growth",
    "Outstanding Payments"
  ],
  "Account Maturity": [
    "Time as Customer",
    "Lifecycle Stage",
    "Implementation Progress"
  ],
  "Product Fit and Usage": [
    "Seats Utilized vs. Purchased",
    "Expansion Readiness"
  ],
  "Customer Advocacy": [
    "Referrals Given",
    "Case Studies or Testimonials"
  ],
  "Strategic Alignment": [
    "Strategic Goals Alignment",
    "Executive Sponsor Engagement"
  ],
  "Miscellaneous": [
    "Competitor Risk",
    "Social Media Mentions",
    "Training and Certification"
  ]
};

function App() {
  const [inputs, setInputs] = useState([
    {
      id: 1,
      name: '',
      weight: 20,
      values: [{ id: 1, name: '', points: 0 }]
    }
  ]);

  // Add new input group
  const addInput = () => {
    setInputs([...inputs, {
      id: Date.now(),
      name: '',
      weight: 20,
      values: [{ id: Date.now(), name: '', points: 0 }]
    }]);
  };

  // Add new value to an input
  const addValue = (inputId) => {
    setInputs(inputs.map(input => {
      if (input.id === inputId) {
        return {
          ...input,
          values: [...input.values, { id: Date.now(), name: '', points: 0 }]
        };
      }
      return input;
    }));
  };

  // Update input name
  const updateInputName = (inputId, name) => {
    setInputs(inputs.map(input => 
      input.id === inputId ? { ...input, name } : input
    ));
  };

  // Update value name
  const updateValueName = (inputId, valueId, name) => {
    setInputs(inputs.map(input => {
      if (input.id === inputId) {
        return {
          ...input,
          values: input.values.map(value => 
            value.id === valueId ? { ...value, name } : value
          )
        };
      }
      return input;
    }));
  };

  // Adjust weight in 5% steps
  const adjustWeight = (inputId, increment) => {
    setInputs(inputs.map(input => {
      if (input.id === inputId) {
        const newWeight = Math.max(0, Math.min(100, input.weight + (increment ? 5 : -5)));
        return { ...input, weight: newWeight };
      }
      return input;
    }));
  };

  // Adjust points
  const adjustPoints = (inputId, valueId, increment) => {
    setInputs(inputs.map(input => {
      if (input.id === inputId) {
        return {
          ...input,
          values: input.values.map(value => 
            value.id === valueId 
              ? { ...value, points: value.points + (increment ? 1 : -1) }
              : value
          )
        };
      }
      return input;
    }));
  };

  // Add this new function with the other state management functions
  const removeValue = (inputId, valueId) => {
    setInputs(inputs.map(input => {
      if (input.id === inputId) {
        // Only remove if there's more than one value
        if (input.values.length > 1) {
          return {
            ...input,
            values: input.values.filter(value => value.id !== valueId)
          };
        }
      }
      return input;
    }));
  };

  // Add this new function with the other state management functions
  const removeInput = (inputId) => {
    if (inputs.length > 1) {
      setInputs(inputs.filter(input => input.id !== inputId));
    }
  };

  const totalWeight = inputs.reduce((sum, input) => sum + input.weight, 0);

  // Add this helper function to generate random colors for inputs
  const getInputColor = (index) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
      '#E67E22', '#27AE60'
    ];
    return colors[index % colors.length];
  };

  const generateExampleCompany = (number, inputs) => {
    const selectedValues = inputs.map(input => {
      if (!input.name || input.values.length === 0) return null;
      
      // For first company (lowest score), select value with lowest points
      // For second company (highest score), select value with highest points
      const value = number === 1 
        ? input.values.reduce((min, v) => v.points < min.points ? v : min, input.values[0])
        : input.values.reduce((max, v) => v.points > max.points ? v : max, input.values[0]);
      
      return {
        category: input.name,
        value: value.name,
        points: value.points,
        weight: input.weight
      };
    }).filter(Boolean);

    const healthScore = selectedValues.reduce((score, item) => {
      return score + (item.points * (item.weight / 100));
    }, 0);

    return {
      id: number,
      name: number === 1 ? "Lowest Score Example" : "Highest Score Example",
      values: selectedValues,
      healthScore: Math.round(healthScore * 10) / 10
    };
  };

  return (
    <div className="container">
      <div className="metrics-container">
        <div className="gauge-section">
          <h3>Weight Distribution</h3>
          <div className="gauge-bars">
            {inputs.map((input, index) => (
              input.weight > 0 && (
                <div
                  key={input.id}
                  className="gauge-bar"
                  style={{
                    width: `${input.weight}%`,
                    backgroundColor: getInputColor(index)
                  }}
                />
              )
            ))}
          </div>
          <div className="gauge-scale">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <div className="gauge-legend">
            {inputs.map((input, index) => (
              <div key={input.id} className="legend-item">
                <span 
                  className="legend-color" 
                  style={{ backgroundColor: getInputColor(index) }}
                />
                <span className="legend-label">
                  {input.name || 'Unnamed Input'} ({input.weight}%)
                </span>
              </div>
            ))}
          </div>
          {totalWeight > 100 && (
            <div className="weight-warning">Total weight exceeds 100%</div>
          )}
        </div>

        <div className="metrics-divider"></div>

        <div className="examples-section">
          <h3>Example Companies</h3>
          <div className="companies-container">
            {[1, 2].map(num => {
              const company = generateExampleCompany(num, inputs);
              return (
                <div key={num} className="company-card">
                  <div className="company-header">
                    <div className="company-logo">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <rect width="24" height="24" fill="#e2e8f0" rx="4"/>
                        <text x="50%" y="50%" fontSize="12" fill="#718096" 
                              textAnchor="middle" dy=".3em">
                          {num}
                        </text>
                      </svg>
                    </div>
                    <div className="company-name">{company.name}</div>
                    <div className="health-score">
                      Score: {company.healthScore}
                    </div>
                  </div>
                  <div className="company-values">
                    {company.values.map((value, index) => (
                      <div key={index} className="value-pill" 
                           title={`${value.category}: ${value.points > 0 ? '+' : ''}${value.points} pts (${value.weight}% weight)`}>
                        {value.value}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {inputs.map(input => (
        <div key={input.id} className="input-group">
          <div className="input-header">
            <select
              value={input.name}
              onChange={(e) => updateInputName(input.id, e.target.value)}
              className="name-input"
            >
              <option value="">Select a Category</option>
              {Object.entries(CATEGORY_OPTIONS).map(([groupName, options]) => (
                <optgroup key={groupName} label={groupName}>
                  {options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="weight-control">
              <button onClick={() => adjustWeight(input.id, false)}>-</button>
              <span>{input.weight}%</span>
              <button onClick={() => adjustWeight(input.id, true)}>+</button>
            </div>
            {inputs.length > 1 && (
              <button 
                onClick={() => removeInput(input.id)}
                className="remove-button"
              >
                ×
              </button>
            )}
          </div>

          <div className="values-container">
            {input.values.map(value => (
              <div key={value.id} className="value-item">
                <input
                  type="text"
                  value={value.name}
                  onChange={(e) => updateValueName(input.id, value.id, e.target.value)}
                  placeholder="Score Name"
                  className="name-input"
                />
                <div className="points-control">
                  <button onClick={() => adjustPoints(input.id, value.id, false)}>-</button>
                  <span>{value.points > 0 ? '+' : ''}{value.points} pts</span>
                  <button onClick={() => adjustPoints(input.id, value.id, true)}>+</button>
                  {input.values.length > 1 && (
                    <button 
                      onClick={() => removeValue(input.id, value.id)}
                      className="remove-button"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button 
              onClick={() => addValue(input.id)}
              className="add-button"
            >
              Add Value
            </button>
          </div>
        </div>
      ))}

      <div className="footer">
        <button onClick={addInput} className="add-button">Add Input</button>
      </div>
    </div>
  );
}
export default App;
