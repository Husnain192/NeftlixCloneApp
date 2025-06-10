import React, { useCallback, memo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import useCurrentUser from "@/hooks/useCurrentUser";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";

const profileImages = [
  "/images/default-blue.png",
  "/images/default-red.png",
  "/images/default-slate.png",
  "/images/default-green.png",
];

interface CardProps {
  name: string;
  imageSrc?: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ name, imageSrc, onClick }) => {
  const imgSrc =
    imageSrc || profileImages[Math.floor(Math.random() * profileImages.length)];

  return (
    <div
      className="group flex flex-col w-32 md:w-44 mx-auto transition-transform duration-300 hover:scale-105"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
      aria-label={`Select profile for ${name}`}
    >
      <div className="w-32 h-32 md:w-44 md:h-44 rounded-md flex items-center justify-center border-2 border-transparent group-hover:border-white overflow-hidden">
        <Image
          src={imgSrc}
          alt={`Profile for ${name}`}
          width={176}
          height={176}
          className="object-contain"
          draggable={false}
        />
      </div>
      <p className="mt-4 text-gray-400 text-lg md:text-2xl text-center group-hover:text-white">
        {name}
      </p>
    </div>
  );
};

const Profiles: React.FC = () => {
  const router = useRouter();
  const { data: currentUser, isLoading, error } = useCurrentUser();

  const selectProfile = useCallback(
    (userName: string) => {
      router.push("/");
    },
    [router]
  );

  if (isLoading) {
    return (
      <div className="flex items-center h-screen justify-center text-white">
        Loading profiles...
      </div>
    );
  }

  if (error || !currentUser) {
    return (
      <div className="flex items-center h-screen justify-center text-red-500">
        Error loading profile: {error?.message || "User not found"}
      </div>
    );
  }

  return (
    <div className="flex items-center h-screen justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-6xl text-white text-center font-bold mb-10">
          Who&#39;s watching?
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <Card
            name={currentUser.name || "Guest"}
            imageSrc={currentUser.image}
            onClick={() => selectProfile(currentUser.name)}
          />
        </div>
      </div>
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

export default memo(Profiles);
