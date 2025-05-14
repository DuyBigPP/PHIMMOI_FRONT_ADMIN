"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import * as React from "react";

// --------------------------------
// Types
// --------------------------------
export type IStep = {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
};

interface IStepIndicatorProps {
  steps: IStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

// --------------------------------
// Hooks
// --------------------------------
export const useSteps = (initialStep = 1, totalSteps: number) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(Math.min(Math.max(1, step), totalSteps));
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return {
    currentStep,
    nextStep,
    previousStep,
    goToStep,
    isFirstStep,
    isLastStep,
  };
};

// --------------------------------
// Components
// --------------------------------
export function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  className,
}: IStepIndicatorProps) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className={cn("w-full max-w-3xl mx-auto px-4", className)}>
      <div className="flex items-center justify-between relative">
        {/* Progress Bar */}
        <div className="absolute left-0 top-[22px] w-full">
          <Progress value={progressPercentage} className="h-[4px]" />
        </div>

        {/* Steps */}
        <div className="relative z-10 flex justify-between w-full">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            const isCurrentStep = currentStep === step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center gap-2"
                onClick={() => onStepClick?.(step.id)}
              >
                <div
                  className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                    isCurrentStep && "ring-8 ring-primary/20",
                    onStepClick && "cursor-pointer hover:opacity-80"
                  )}
                >
                  <Icon className={cn("size-6")} />
                </div>
                <span
                  className={cn(
                    "text-xl font-medium text-center transition-colors duration-300",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
