import React from "react";
import Image, { StaticImageData } from "next/image";

interface CardProps {
  text: string;
  backgroundImage: StaticImageData;
  className?: string;
}

const Card: React.FC<CardProps> = ({ text, backgroundImage, className }) => {
  return (
    <div
      className={`w-full h-full relative rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer ${className}`}
    >
      {/* Background Image - Full Cover */}
      <Image
        src={backgroundImage}
        alt={text}
        layout="fill"
        objectFit="cover"
        className="absolute"
        priority // Ensures faster loading
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 "></div>

      {/* Text Positioned at Bottom */}
      <div className="absolute bottom-4 left-4 text-white">
        <h4 className="text-lg font-semibold capitalize">{text}</h4>
      </div>
    </div>
  );
};

export default Card;
