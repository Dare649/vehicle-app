"use client";

import React from "react";
import Image from "next/image";

interface CardProps {
  text: string;
  backgroundImage: string; // Now accepts dynamic image URLs
  className?: string;
}

const Card: React.FC<CardProps> = ({ text, backgroundImage, className }) => {
  const fallbackImage = "/images/default-image.jpg"; // Default fallback image in public folder

  return (
    <div
      className={`w-full h-full relative rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer ${className}`}
    >
      {/* Background Image with Fallback */}
      <Image
        src={backgroundImage || fallbackImage} // Use fallback if backgroundImage is undefined
        alt={text}
        layout="fill"
        objectFit="cover"
        className="absolute"
        priority // Faster image loading
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Text Positioned at Bottom */}
      <div className="absolute bottom-4 left-4 text-white">
        <h4 className="text-lg font-semibold capitalize">{text}</h4>
      </div>
    </div>
  );
};

export default Card;
