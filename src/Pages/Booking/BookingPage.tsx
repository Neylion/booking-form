import Form from './Form';

function BookingPage() {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <h1 className="font-bold text-xl mb-4 text-white">
          Book a train
      </h1>
      <Form />
    </div>
  );
}

export default BookingPage;
