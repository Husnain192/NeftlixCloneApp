import React from 'react';
import MovieCard from './MovieCard';

interface MovieListProps {
  title: string;
  data: any[];
  isLoading?: boolean;
  error?: Error | null;
  layout?: 'row' | 'grid'; // Add layout prop
}

const NewMovieList: React.FC<MovieListProps> = ({ title, data, isLoading, error, layout = 'grid' }) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data.length) return <div>No items to display</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-white text-2xl font-semibold">{title}</h2>
      <div
        className={`flex ${
          layout === 'row' ? 'flex-row gap-4 pb-4' : 'flex-col'
        }`}
        style={{ WebkitOverflowScrolling: 'touch' }} // Smooth scrolling on mobile
      >
        {data.map((item) => (
          <div key={item.id} className="min-w-[200px] flex-shrink-0">
           <MovieCard data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewMovieList;