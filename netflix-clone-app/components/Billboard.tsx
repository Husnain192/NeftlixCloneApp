import React, { useCallback, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';

import PlayButton from '@/components/PlayButton';
import useBillboard from '@/hooks/useBillboard';
import useInfoModalStore from '@/hooks/useInfoModalStore';

const Billboard: React.FC = () => {
  const { openModal } = useInfoModalStore();
  const { data, isLoading, error } = useBillboard();
  const [posterSrc, setPosterSrc] = useState(data?.thumbnailUrl);

  const handleOpenModal = useCallback(() => {
    if (data?.id) openModal(data.id);
  }, [openModal, data?.id]);

  const handlePosterError = () => {
    setPosterSrc('/images/poster.png');
  };

  if (isLoading) return <div className="h-[56.25vw] bg-zinc-900 animate-pulse" />;
  if (error || !data) return <div className="h-[56.25vw] bg-zinc-900 text-white text-center pt-20">No featured movie available.</div>;

  return (
    <div className="relative h-[56.25vw]">
      <video
        poster={posterSrc}
        className="w-full h-[56.25vw] object-cover brightness-[60%] transition duration-500"
        autoPlay
        muted
        loop
        src={data.videoUrl}
        onError={() => setPosterSrc('/images/poster.png')}
      />
      <img
        src={posterSrc}
        alt="Poster fallback"
        className="hidden"
        onError={handlePosterError}
      />
      <div className="absolute top-[30%] md:top-[40%] ml-4 md:ml-16 max-w-[50%]">
        <h1 className="text-white text-2xl md:text-5xl lg:text-6xl font-bold drop-shadow-xl">
          {data.title}
        </h1>
        <p className="text-white text-sm md:text-lg mt-4 w-full drop-shadow-xl line-clamp-3">
          {data.description}
        </p>
        <div className="flex flex-row items-center mt-4 gap-3">
          <PlayButton movieId={data.id} />
          <button
            onClick={handleOpenModal}
            className="
              bg-white/30 text-white rounded-md py-2 px-4 w-auto text-sm md:text-lg font-semibold
              flex items-center hover:bg-white/20 transition
            "
            aria-label="More info about the featured movie"
          >
            <AiOutlineInfoCircle className="w-5 md:w-7 mr-1" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Billboard;