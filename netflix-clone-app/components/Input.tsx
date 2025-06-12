import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ id, label, error, ...props }) => {
  return (
    <div className="relative">
      <input
        id={id}
        className={`block rounded-md px-6 pt-6 pb-1 w-full text-md text-white bg-neutral-700 appearance-none focus:outline-none focus:ring-0 peer ${
          error ? 'border-b-2 border-red-600' : ''
        }`}
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute text-md text-neutral-400 duration-150 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3"
      >
        {label}
      </label>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;