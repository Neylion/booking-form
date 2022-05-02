import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ERROR_MESSAGES, TICKET_TYPES } from '../../constants';
import { dateStringHasValidFormat } from '../../utils/dates';
import DateInput from './DateInput';
import TypeInput from './TypeInput';

const FIELD_NAMES = {
  TICKET_TYPE: 'ticketType' as const,
  DEPARTURE_DATE: 'departureDate' as const,
  RETURN_DATE: 'returnDate' as const,
};

export interface SubmitData {
  ticketType: string;
  departureDate: string;
  returnDate: string;
}

interface FormProps {
  onSubmit: (data: SubmitData) => void;
}
const Form = ({ onSubmit }: FormProps) => {
  const { register, handleSubmit, trigger, getValues, setValue, formState: { errors } } = useForm<SubmitData>({ mode: 'onBlur', reValidateMode: 'onBlur' });

  const ticketType = getValues(FIELD_NAMES.TICKET_TYPE);
  const departureDate = getValues(FIELD_NAMES.DEPARTURE_DATE);

  useEffect(() => {
    trigger(FIELD_NAMES.RETURN_DATE);
  }, [ticketType, departureDate, trigger]);

  const hasErrors = Object.keys(errors).length > 0;

  const fieldConfigs = {
    ticketType: register(FIELD_NAMES.TICKET_TYPE, { 
      required: true,
      validate: (inputValue) => {
        if (!Object.values(TICKET_TYPES).includes(inputValue)) return `Must be one of: ${Object.values(TICKET_TYPES).join(', ')}`;
        return true;
      },
    }),
    departureDate: register(FIELD_NAMES.DEPARTURE_DATE, {
      required: true,
      validate: (inputValue) => {
        if (!dateStringHasValidFormat(inputValue)) return ERROR_MESSAGES.INVALID_DATE;
        const date = new Date(inputValue);
        const todaysDate = new Date(new Date().setHours(0, 0, 0, 0));
        if (date < todaysDate) return ERROR_MESSAGES.DATE_IN_PAST;
        trigger(FIELD_NAMES.RETURN_DATE); // Re-evaluate the return date since its validation depends on this field
        return true;
      }, 
    }),
    returnDate: register(FIELD_NAMES.RETURN_DATE, { 
      validate: (inputValue) => {
        const requireReturnDate = ticketType === TICKET_TYPES.TWO_WAY;
        if (!requireReturnDate) return true;
        if (!dateStringHasValidFormat(inputValue)) return ERROR_MESSAGES.INVALID_DATE;
        const date = new Date(inputValue);
        if (departureDate && date < new Date(departureDate)) return ERROR_MESSAGES.RETURN_BEFORE_DEPARTURE;
        return true;
      }, 
      disabled: getValues(FIELD_NAMES.TICKET_TYPE) === TICKET_TYPES.ONE_WAY,
    }),
  };

  return (
    <form 
      className="flex flex-col gap-3 min-w-[300px] w-4/12 justify-center items-center" 
      onSubmit={handleSubmit(onSubmit)}
    >
      <TypeInput 
        label="Type" 
        fieldConfig={fieldConfigs.ticketType}
        value={ticketType || TICKET_TYPES.ONE_WAY}
        setValue={(value) => setValue(FIELD_NAMES.TICKET_TYPE, value, { shouldValidate: true })}
        errors={errors}
      />
      <DateInput
        label="Departure" 
        fieldConfig={fieldConfigs.departureDate} 
        defaultVal={new Date()}
        errors={errors}
      />
      <DateInput
        label="Return" 
        fieldConfig={fieldConfigs.returnDate} 
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

export default Form;
