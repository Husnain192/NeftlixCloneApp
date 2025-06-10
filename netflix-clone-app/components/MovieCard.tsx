import React, { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BsPlayFill } from 'react-icons/bs';
import { BiChevronDown } from 'react-icons/bi';

import { MovieInterface } from '@/types';
import FavoriteButton from '@/components/FavoriteButton';
import useInfoModalStore from '@/hooks/useInfoModalStore';

interface MovieCardProps {
  data: MovieInterface;
}

const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
  const router = useRouter();
  const { openModal } = useInfoModalStore();
  const [imageSrc, setImageSrc] = useState(data.thumbnailUrl);

  const redirectToWatch = useCallback(() => router.push(`/watch/${data.id}`), [router, data.id]);

  const handleImageError = () => {
    setImageSrc('/images/thumbnail.jpg');
  };

  return (
    <div className="group bg-zinc-900 relative h-[12vw] w-full">
      <Image
        src={imageSrc}
        alt={data.title}
        width={300}
        height={169}
        loading="lazy"
        className="
          cursor-pointer object-cover transition duration-300 shadow-xl rounded-md
          w-full h-[12vw] group-hover:opacity-90 sm:group-hover:opacity-0
        "
        onError={handleImageError}
        onClick={redirectToWatch}
      />
      <div className="
        absolute top-0 left-0 transition duration-300 z-10
        invisible sm:visible w-full scale-0
        group-hover:scale-110 group-hover:-translate-y-[6vw] group-hover:translate-x-[2vw]
        group-hover:opacity-100
      ">
        <Image
          src={imageSrc}
          alt={data.title}
          width={300}
          height={169}
          className="cursor-pointer object-cover transition duration-300 shadow-xl rounded-t-md w-full h-[12vw]"
          onError={handleImageError}
          onClick={redirectToWatch}
        />
        <div className="bg-zinc-800 p-2 lg:p-4 absolute w-full transition shadow-md rounded-b-md">
          <div className="flex items-center gap-3">
            <button
              onClick={redirectToWatch}
              className="w-8 h-8 lg:w-10 lg:h-10 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300"
              aria-label={`Play ${data.title}`}
            >
              <BsPlayFill className="text-black w-5 lg:w-6" />
            </button>
            <FavoriteButton movieId={data.id} />
            <button
              onClick={() => openModal(data.id)}
              className="ml-auto w-8 h-8 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300"
              aria-label="More info"
            >
              <BiChevronDown className="text-white w-5 lg:w-6" />
            </button>
          </div>
          <p className="text-green-400 font-semibold mt-4">
            New <span className="text-white">2023</span>
          </p>
          <div className="flex flex-row mt-4 gap-2 items-center">
            <p className="text-white text-xs lg:text-sm">{data.duration}</p>
            <p className="text-white text-xs lg:text-sm">{data.genre}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(MovieCard);