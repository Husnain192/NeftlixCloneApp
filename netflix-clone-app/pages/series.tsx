import React, { memo } from "react";
import dynamic from "next/dynamic";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Dynamically import components that rely on client-side features
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  {
    ssr: false,
  }
);
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const InfoModal = dynamic(() => import("@/components/InfoModal"), {
  ssr: false,
});

import useMovieList from "@/hooks/useMovieList";
import useInfoModalStore from "@/hooks/useInfoModalStore";
import NewMovieList from "@/components/NewMovieList";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
  </div>
);

const Series: React.FC = () => {
  const { data: movies = [], isLoading, error } = useMovieList();
  const { isOpen, closeModal } = useInfoModalStore();

  // Filter movies for series (assuming genre includes 'Drama' or 'Comedy' or adjust as needed)
  const seriesMovies = movies.filter((movie: { genre: string | string[] }) =>
    Array.isArray(movie.genre)
      ? ["Drama", "Comedy"].some((g) => movie.genre.includes(g))
      : movie.genre === "Drama" || movie.genre === "Comedy"
  );

  // Handle error state with toast
  React.useEffect(() => {
    if (error) {
      toast.error(`Error loading series: ${error.message}`);
    }
  }, [error]);

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 min-h-screen">
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto"
      >
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold mb-8 tracking-tight">
          Series
        </h1>
        {isLoading ? (
          <div className="text-white text-center text-lg">
            <LoadingSpinner />
            <p className="mt-4 text-gray-300">Loading series...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center text-lg bg-gray-800 p-6 rounded-lg shadow-lg">
            Error loading series: {error.message}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Try Again
            </button>
          </div>
        ) : seriesMovies.length === 0 ? (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white text-center py-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              No Series Available
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto mb-6">
              We couldnt find any series. Check back later or browse other
              categories.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Browse Movies
            </button>
          </MotionDiv>
        ) : (
          <NewMovieList
            title="Series"
            data={seriesMovies}
            isLoading={isLoading}
            error={error}
            layout="row" // Pass layout prop to enforce single row
          />
        )}
      </MotionDiv>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default memo(Series);
