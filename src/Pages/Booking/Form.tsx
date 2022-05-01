import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ERROR_MESSAGES, TICKET_TYPES } from '../../constants';
import { dateStringHasValidFormat } from '../../utils/dates';
import DateInput from './DateInput';
import TypeInput from './TypeInput';

const Form = () => {
  const { register, handleSubmit, trigger, getValues, setValue, formState: { errors } } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });
  const onSubmit = (data: any) => console.log(data);

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
            if (!dateStringHasValidFormat(inputValue)) return ERROR_MESSAGES.INVALID_DATE;
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
            if (!dateStringHasValidFormat(inputValue)) return ERROR_MESSAGES.INVALID_DATE;
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

export default Form;
