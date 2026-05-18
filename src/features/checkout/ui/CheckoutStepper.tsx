import { Check } from 'lucide-react';
import { cn } from '@shared/lib/cn';
import { CHECKOUT_STEPS, STEP_LABELS, type CheckoutStep } from '@features/checkout/model/checkout.types';

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const currentIndex = CHECKOUT_STEPS.indexOf(currentStep);

  return (
    <div className="flex items-center justify-center gap-0">
      {CHECKOUT_STEPS.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;

        return (
          <div key={step} className="flex items-center">
            {/* Círculo */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  isCompleted && 'bg-accent text-white',
                  isActive && 'bg-accent text-white ring-4 ring-accent/20',
                  !isCompleted && !isActive && 'bg-border/50 text-text'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium whitespace-nowrap',
                  isActive ? 'text-accent' : 'text-text'
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </div>

            {/* Línea conectora */}
            {idx < CHECKOUT_STEPS.length - 1 && (
              <div
                className={cn(
                  'h-px w-12 mx-1 mb-4 transition-all',
                  idx < currentIndex ? 'bg-accent' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
