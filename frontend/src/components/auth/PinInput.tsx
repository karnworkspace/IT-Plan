// PinInput Component - 6-digit PIN input
import React, { useState, useRef } from 'react';
import type { KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from 'antd';
import type { InputRef } from 'antd';
import './PinInput.css';

interface PinInputProps {
  length?: number;
  onChange: (pin: string) => void;
  onComplete?: (pin: string) => void;
  masked?: boolean;
  disabled?: boolean;
}

export const PinInput: React.FC<PinInputProps> = ({
  length = 6,
  onChange,
  onComplete,
  masked = true,
  disabled = false
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newValues = [...values];
    newValues[index] = value.slice(-1); // Take only last character
    setValues(newValues);

    const pin = newValues.join('');
    onChange(pin);

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all digits entered
    if (pin.length === length && onComplete) {
      onComplete(pin);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Backspace: delete and move to previous
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);

    if (!/^\d+$/.test(pastedData)) return;

    const newValues = pastedData.split('');
    const filledValues = [...newValues, ...Array(length - newValues.length).fill('')];
    setValues(filledValues);

    const pin = pastedData;
    onChange(pin);

    if (pin.length === length && onComplete) {
      onComplete(pin);
    }

    // Focus last filled input
    const lastIndex = Math.min(newValues.length, length - 1);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="pin-input-container">
      {values.map((value, index) => (
        <Input
          key={index}
          ref={(el: InputRef | null) => { inputRefs.current[index] = el?.input ?? null; }}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          maxLength={1}
          type={masked ? 'password' : 'text'}
          disabled={disabled}
          className="pin-input-box"
          inputMode="numeric"
        />
      ))}
    </div>
  );
};
