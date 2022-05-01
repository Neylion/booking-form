import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import InputLayout from './InputLayout';

interface DateInputProps {
  label: string;
  fieldConfig: UseFormRegisterReturn;
  defaultVal: Date;
  errors?: any;
}
const DateInput = ({ label, fieldConfig, defaultVal, errors }: DateInputProps) => {
  const [inputValue, setInputValue] = useState(defaultVal.toLocaleDateString('sv-SE'));

  const error = errors?.[fieldConfig.name]?.message || (!inputValue && 'Required');
  return (
    <InputLayout label={label} error={error} disabled={fieldConfig.disabled}>
      <input
        className="basis-2/3 h-full rounded-r-sm px-2 bg-inherit disabled:cursor-not-allowed" 
        type="text"
        {...fieldConfig}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </InputLayout>
  );
};

export default DateInput;
