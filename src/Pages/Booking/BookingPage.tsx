import { useState } from 'react';
import Form, { SubmitData } from './Form';

function BookingPage() {
  const [submittedData, setSubmittedData] = useState<SubmitData | null>(null);
  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <h1 className="font-bold text-xl mb-4 text-white">
          Book a train
      </h1>
      <Form onSubmit={setSubmittedData} />
      {submittedData && (
        <div className="flex flex-col text-white mt-4 justify-center text-center">
          <p>
            Successfully submitted:
          </p>
          <p>
            {JSON.stringify(submittedData, null, 2)}
          </p>
        </div>
      )}
    </div>
  );
}

export default BookingPage;
