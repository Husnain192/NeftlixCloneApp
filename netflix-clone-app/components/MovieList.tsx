import React, { memo } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { MovieInterface } from '@/types';
import MovieCard from '@/components/MovieCard';
import { isEmpty } from 'lodash';

interface MovieListProps {
  data: MovieInterface[];
  title: string;
  isLoading?: boolean;
  error?: Error | null;
}

const MovieList: React.FC<MovieListProps> = ({ data, title, isLoading, error }) => {
  if (isLoading) return <p className="text-white text-center">Loading {title.toLowerCase()}...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error.message}</p>;
  if (isEmpty(data)) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="px-4 md:px-12 mt-8 space-y-6">
      <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-semibold">{title}</h2>
      <Slider {...settings}>
        {data.map((movie) => (
          <div key={movie.id} className="px-2">
            <MovieCard data={movie} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default memo(MovieList);