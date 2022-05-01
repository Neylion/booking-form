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

export default InputLayout;
