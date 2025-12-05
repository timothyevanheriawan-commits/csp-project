'use client';

import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface InstructionsStepsProps {
  instructions: string;
}

export default function InstructionsSteps({ instructions }: InstructionsStepsProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const steps = instructions.split('\n').filter(step => step.trim());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };


  return (
    <div>


      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex gap-4 p-4 rounded-xl transition-all ${completedSteps.has(index)
              ? 'bg-green-50 border border-green-200'
              : 'hover:bg-gray-50'
              }`}
          >
            <button
              onClick={() => toggleStep(index)}
              className="flex-shrink-0"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${completedSteps.has(index)
                ? 'bg-green-500 text-white'
                : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                }`}>
                {completedSteps.has(index) ? '✓' : index + 1}
              </div>
            </button>

            <div className="flex-grow">
              <p className={`leading-relaxed ${completedSteps.has(index)
                ? 'text-gray-500'
                : 'text-text-light'
                }`}>
                {step}
              </p>
            </div>

            <button
              onClick={() => toggleStep(index)}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              {completedSteps.has(index) ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}