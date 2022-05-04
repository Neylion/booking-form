import { useRef, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { TICKET_TYPES } from '../../constants';
import useClickOutside from '../../hooks/useClickOutside';
import InputLayout from './InputLayout';

interface TypeInputProps {
  label: string;
  fieldConfig: UseFormRegisterReturn;
  disabled?: boolean;
  value: string;
  setValue: (value: string) => void;
  errors?: any;
}
const TypeInput = ({ label, fieldConfig, disabled, value, setValue, errors }: TypeInputProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const error = errors?.[fieldConfig.name]?.message || (!value && 'Required');

  const ref = useRef(null);
  useClickOutside(ref, () => setShowDropdown(false));

  const handleTypeClick = (type: string) => {
    setShowDropdown(false);
    setValue(type);
  };

  return (
    <InputLayout name={fieldConfig.name} label={label} error={error}>
      <div 
        ref={ref}
        className="basis-2/3"
      >
        <div
          className="inline-flex w-full h-full cursor-pointer select-none" 
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <input
            id={fieldConfig.name}
            className="inline-flex w-10/12 h-full px-2 cursor-pointer text-left focus:outline-1 select-none" 
            type="button"
            {...fieldConfig}
            disabled={disabled}
            value={value}
            readOnly
          />
          <div className="relative inline-flex w-2/12 h-full justify-center">
            <div 
              className={`absolute h-[17%] text-main-400 text-2xl leading-[0] top-[35%] ${showDropdown && 'rotate-180 top-[55%]'} transition-all duration-300`}
            >
              &#8964;
            </div>
          </div>
        </div>
        {showDropdown && (
          <div className="absolute flex flex-col w-full left-0 z-10 bg-white rounded-sm mt-[0.1rem] shadow-lg">
            {Object.values(TICKET_TYPES).map((type, index) => (
              <button 
                key={`${index}-${type}`}
                className={`w-11/12 m-auto hover:bg-secondary-50 p-1 ${index && 'border-t-2'}`}
                onClick={() => handleTypeClick(type)}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </InputLayout>
  );
};

export default TypeInput;
