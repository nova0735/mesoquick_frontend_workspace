import { useState } from 'react';
import { Tag, X, CheckCircle } from 'lucide-react';
import { Input, Button } from '@shared/ui';
import { validateCoupon } from '@features/checkout/api/checkout.api';

interface CouponInputProps {
  appliedCoupon: string | null;
  onApply: (coupon: string, discount: number) => void;
  onRemove: () => void;
}

export default function CouponInput({ appliedCoupon, onApply, onRemove }: CouponInputProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setMessage('');
    const result = await validateCoupon(code);
    setIsLoading(false);

    if (result.valid) {
      setIsError(false);
      setMessage(result.message);
      onApply(code.trim().toUpperCase(), result.discount);
      setCode('');
    } else {
      setIsError(true);
      setMessage(result.message);
    }
  };

  // Cupón ya aplicado
  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-accent-bg border border-accent-border">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="text-sm font-medium text-accent">{appliedCoupon} aplicado</span>
        </div>
        <button
          onClick={onRemove}
          className="text-text hover:text-red-500 transition-colors"
          aria-label="Quitar cupón"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Código de cupón"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setMessage('');
          }}
          leftIcon={<Tag className="w-4 h-4" />}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          fullWidth
        />
        <Button
          variant="outline"
          onClick={handleApply}
          isLoading={isLoading}
          disabled={!code.trim()}
          className="flex-shrink-0"
        >
          Aplicar
        </Button>
      </div>
      {message && (
        <p className={`text-xs ${isError ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
