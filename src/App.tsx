import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import useClickOutside from './hooks/useClickOutside';

const ERROR_MESSAGES = {
  INVALID_DATE: 'Must be a valid date in the format yyyy-mm-dd',
  DATE_IN_PAST: 'Date can not be in the past',
  RETURN_BEFORE_DEPARTURE: 'Return date may not be prior to departure date',
};

const TICKET_TYPES = {
  ONE_WAY: 'One-way ticket',
  TWO_WAY: 'Two-way ticket',
};

function App() {
  return (
    <div className="flex flex-col w-screen h-screen bg-main-800 justify-center items-center">
      <h1 className="font-bold text-xl m-4 text-white">
          Book a train
      </h1>
      <Form />
    </div>
  );
}

const validDateFormat = (inputValue: string) => {
  const inputDate = new Date(inputValue);
  if (!inputDate.getTime()) return false;

  const dateSplit = inputValue.split('-');
  const hasCorrectFormat = dateSplit[0]?.length === 4 && dateSplit[1]?.length === 2 && dateSplit[2]?.length === 2;
  return hasCorrectFormat;
};

const Form = () => {
  const { register, handleSubmit, trigger, getValues, setValue, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const onSubmit = (data: any) => console.log(data);

  console.log('### fredrik: ----------');

  const ticketType = getValues('ticketType');
  const departureDate = getValues('departureDate');

  useEffect(() => {
    trigger('returnDate');
  }, [ticketType, departureDate, trigger]);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form 
      className="flex flex-col gap-3 min-w-[300px] w-4/12 justify-center items-center" 
      onSubmit={handleSubmit(onSubmit)}
    >
      <TypeInput 
        label="Type" 
        fieldConfig={register('ticketType', { 
          required: true,
          validate: (inputValue) => {
            if (!Object.values(TICKET_TYPES).includes(inputValue)) return `Must be one of: ${Object.values(TICKET_TYPES).join(', ')}`;
            return true;
          },
        })} 
        value={ticketType || TICKET_TYPES.ONE_WAY}
        setValue={(value) => setValue('ticketType', value, { shouldValidate: true })}
        errors={errors}
      />
      <DateInput
        label="Departure" 
        fieldConfig={register('departureDate', { 
          required: true,
          validate: (inputValue) => {
            if (!validDateFormat(inputValue)) return ERROR_MESSAGES.INVALID_DATE;
            const date = new Date(inputValue);
            const todaysDate = new Date(new Date().setHours(0, 0, 0, 0));
            if (date < todaysDate) return ERROR_MESSAGES.DATE_IN_PAST;
            trigger('returnDate'); // Re-evaluate the return date since its validation depends on this field
            return true;
          }, 
        })} 
        defaultVal={new Date()}
        errors={errors}
      />
      <DateInput
        label="Return" 
        fieldConfig={register('returnDate', { 
          validate: (inputValue) => {
            const requireReturnDate = ticketType === TICKET_TYPES.TWO_WAY;
            if (!requireReturnDate) return true;
            if (!validDateFormat(inputValue)) return ERROR_MESSAGES.INVALID_DATE;
            const date = new Date(inputValue);
            if (departureDate && date < new Date(departureDate)) return ERROR_MESSAGES.RETURN_BEFORE_DEPARTURE;
            return true;
          }, 
          disabled: getValues('ticketType') === TICKET_TYPES.ONE_WAY,
        })} 
        defaultVal={new Date()}
        errors={errors}
      />
      <button 
        className="bg-secondary-200 w-4/12 mt-2 p-4 font-bold rounded-sm disabled:bg-main-100 disabled:text-main-400 disabled:cursor-not-allowed"
        type="submit" 
        disabled={hasErrors}
      >
        Book
      </button>
    </form>
  );
};

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
    <InputLayout label={label} error={error}>
      <div 
        ref={ref}
        className="basis-2/3"
      >
        <div
          className="inline-flex align-top w-full h-full cursor-pointer select-none" 
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <input
            className="inline-flex align-top w-10/12 h-full px-2 cursor-pointer text-left focus:outline-1 select-none" 
            type="button"
            {...fieldConfig}
            disabled={disabled}
            value={value}
            readOnly
          />
          <div className="relative inline-flex w-2/12 h-full justify-center">
            <div 
              className={`absolute h-[17%] text-center text-main-400 text-2xl align-middle leading-[0] top-[35%] ${showDropdown && 'rotate-180 top-[55%]'} transition-all duration-300`}
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

interface InputLayoutProps {
  label: string;
  error?: any;
  children?: any;
  disabled?: boolean;
}
const InputLayout = ({ label, children, error, disabled }: InputLayoutProps) => {
  return (
    <div className={`relative w-full flex flex-col ${disabled && 'opacity-20'}`}>
      {error && <p className={'flex-1 text-red-400 pb-1 text-sm'}>{error}</p>}
      <div className="w-full flex bg-white rounded-l-sm rounded-r-sm overflow-hidden">
        <span className={`basis-1/3 ${error ? 'bg-red-200' : 'bg-secondary-100'} p-2 text-center text-sm`}>{label}</span>
        {children}
      </div>
    </div>
  );
};

export default App;
