import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import { useState } from 'react';

const ERROR_MESSAGES = {
  INVALID_DATE: 'Must be a valid date in the format yyyy-mm-dd',
  DATE_IN_PAST: 'Date can not be in the past',
  RETURN_BEFORE_DEPARTURE: 'Return date may not be prior to departure date',
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
  const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const onSubmit = (data: any) => console.log(data);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form 
      className="flex flex-col gap-3 min-w-[300px] w-4/12 justify-center items-center" 
      onSubmit={handleSubmit(onSubmit)}
    >
      <DateInput
        label="Departure" 
        fieldConfig={register('departureDate', { 
          required: true,
          validate: (inputValue) => {
            if (!validDateFormat(inputValue)) return ERROR_MESSAGES.INVALID_DATE;
            const date = new Date(inputValue);
            const todaysDate = new Date(new Date().setHours(0, 0, 0, 0));
            if (date < todaysDate) return ERROR_MESSAGES.DATE_IN_PAST;
            return true;
          }, 
        })} 
        defaultVal={new Date()}
        errors={errors}
      />
      <button 
        className="bg-secondary-200 w-4/12 mt-2 p-4 font-bold disabled:bg-main-100 disabled:text-main-400 disabled:cursor-not-allowed"
        type="submit" 
        disabled={hasErrors}
      >
        Book
      </button>
    </form>
  );
};

interface DateInputProps {
  label: string;
  fieldConfig: UseFormRegisterReturn;
  disabled?: boolean;
  defaultVal: Date;
  errors?: any;
}
const DateInput = ({ label, fieldConfig, disabled, defaultVal, errors }: DateInputProps) => {
  const [inputValue, setInputValue] = useState(defaultVal.toLocaleDateString('sv-SE'));

  const error = errors?.[fieldConfig.name]?.message || (!inputValue && 'Required');

  return (
    <InputLayout label={label} error={error}>
      <input
        className="basis-2/3 h-full rounded-r-sm px-2 disabled:bg-red-500 transition-all" 
        type="text"
        {...fieldConfig}
        disabled={disabled}
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
}
const InputLayout = ({ label, children, error }: InputLayoutProps) => {
  return (
    <div className="w-full flex flex-col">
      {error && <p className={'flex-1 text-red-400 pb-1 text-sm'}>{error}</p>}
      <div className="w-full flex">
        <span className={`basis-1/3 ${error ? 'bg-red-200' : 'bg-secondary-100'} rounded-l-sm p-2 text-center text-sm`}>{label}</span>
        {children}
      </div>
    </div>
  );
};

export default App;
