import React from 'react';
import { Check } from 'lucide-react';

export const STEPS = [
  { id: 1, name: 'Contact', label: 'Contact Details' },
  { id: 2, name: 'Target Role', label: 'Target Job' },
  { id: 3, name: 'Experience', label: 'Work History' },
  { id: 4, name: 'Education', label: 'Education' },
  { id: 5, name: 'Skills', label: 'Skills' },
  { id: 6, name: 'Projects & More', label: 'Projects & Credentials' },
  { id: 7, name: 'AI Review', label: 'Generate' }
];

export const StepIndicator = ({ currentStep, onSelectStep }) => {
  const currentStepObj = STEPS.find((s) => s.id === currentStep) || STEPS[0];

  return (
    <div className="step-indicator-container">
      {/* Mobile Step Status Badge */}
      <div className="mobile-step-badge-row">
        <span className="mobile-step-counter">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="mobile-step-name">{currentStepObj.label}</span>
      </div>

      <div className="step-progress-bar-bg">
        <div
          className="step-progress-bar-fill"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      <div className="step-items-wrapper">
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <button
              key={step.id}
              type="button"
              className={`step-item-btn ${isCurrent ? 'active' : ''} ${
                isCompleted ? 'completed' : ''
              }`}
              onClick={() => onSelectStep && onSelectStep(step.id)}
              title={step.label}
              aria-label={`Go to step ${step.id}: ${step.label}`}
            >
              <div className="step-circle">
                {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
              </div>
              <span className="step-label">{step.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
