import React, { useCallback, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import PlayButton from '@/components/PlayButton';
import FavoriteButton from '@/components/FavoriteButton';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import useMovie from '@/hooks/useMovie';

interface InfoModalProps {
  visible?: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ visible, onClose }) => {
  const [isVisible, setIsVisible] = useState<boolean>(!!visible);
  const [posterSrc, setPosterSrc] = useState<string | undefined>();

  const { movieId } = useInfoModalStore();
  const { data = {} } = useMovie(movieId);

  useEffect(() => {
    setIsVisible(!!visible);
    setPosterSrc(data?.thumbnailUrl);
  }, [visible, data?.thumbnailUrl]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handlePosterError = () => {
    setPosterSrc('/images/poster.png');
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="z-50 transition duration-300 bg-black bg-opacity-80 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="relative w-auto mx-auto max-w-3xl rounded-md overflow-hidden">
        <div className={`${isVisible ? 'scale-100' : 'scale-0'} transform duration-300 relative flex-auto bg-zinc-900 drop-shadow-md`}>
          <div className="relative h-96">
            <video
              poster={posterSrc}
              autoPlay
              muted
              loop
              src={data?.videoUrl}
              className="w-full brightness-[60%] object-cover h-full"
              onError={() => setPosterSrc('/images/poster.png')}
            />
            <img
              src={posterSrc}
              alt="Poster fallback"
              className="hidden"
              onError={handlePosterError}
            />
            <div
              onClick={handleClose}
              className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black bg-opacity-70 flex items-center justify-center"
            >
              <AiOutlineClose className="text-white w-6" />
            </div>
            <div className="absolute bottom-[10%] left-10">
              <p className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-8 drop-shadow-xl">
                {data?.title}
              </p>
              <div className="flex flex-row gap-4 items-center">
                <PlayButton movieId={data?.id} />
                <FavoriteButton movieId={data?.id} />
              </div>
            </div>
          </div>
          <div className="px-12 py-8">
            <div className="flex flex-row items-center gap-2 mb-8">
              <p className="text-green-400 font-semibold text-lg">
                New
              </p>
              <p className="text-white text-lg">
                {data?.duration}
              </p>
              <p className="text-white text-lg">
                {data?.genre}
              </p>
            </div>
            <p className="text-white text-lg">
              {data?.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;