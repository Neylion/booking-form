import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import { useState } from 'react';

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

const Form = () => {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <form 
      className="flex flex-col gap-3 min-w-[300px] w-4/12 justify-center items-center" 
      onSubmit={handleSubmit(onSubmit)}
    >
      <DateInput
        label="Departure" 
        fieldConfig={register('departureDate', { required: true })} 
        defaultVal={new Date()}
      />
      <button 
        className="bg-secondary-200 w-4/12 mt-2 p-4 font-bold"
        type="submit" 
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
}
const DateInput = ({ label, fieldConfig, disabled, defaultVal }: DateInputProps) => {
  const [inputValue, setInputValue] = useState(defaultVal.toLocaleDateString('sv-SE'));

  return (
    <div className="w-full flex">
      <span className="basis-1/3 bg-secondary-100 rounded-l-sm p-2 text-center">{label}</span>
      <input 
        className="basis-2/3 h-full rounded-r-sm px-2 disabled:bg-red-500" 
        type="text" 
        {...fieldConfig} 
        disabled={disabled} 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default App;
