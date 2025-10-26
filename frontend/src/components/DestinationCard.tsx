'use client';

import Image from 'next/image';

export default function DestinationCard({
  image,
  title,
  subtitle,
  onClick,
}: {
  image: string;
  title: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="relative cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-transform hover:scale-[1.01] text-left"
    >
      <Image
        src={image}
        alt={title}
        width={600}
        height={400}
        className="w-full h-56 object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <div className="text-lg font-semibold">{title}</div>
        {subtitle ? <div className="text-xs opacity-90">{subtitle}</div> : null}
      </div>
    </button>
  );
}
