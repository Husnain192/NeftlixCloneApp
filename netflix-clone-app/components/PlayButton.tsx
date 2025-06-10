import React from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { useRouter } from 'next/router';

interface PlayButtonProps {
  movieId: string;
  label?: string;
}

const buttonStyles = `
  bg-white text-black rounded-md py-2 px-4 w-auto text-sm md:text-lg font-semibold
  flex items-center hover:bg-blue-100 transition-colors duration-200
`;

const PlayButton: React.FC<PlayButtonProps> = ({ movieId, label = 'Play' }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/watch/${movieId}`)}
      className={buttonStyles}
      aria-label={`Play ${label}`}
    >
      <BsPlayFill className="w-5 h-5 md:w-7 md:h-7 mr-1" />
      {label}
    </button>
  );
};

export default PlayButton;