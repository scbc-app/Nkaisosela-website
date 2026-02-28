import React, { useState, useEffect } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackUrl: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, fallbackUrl }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className} ${isLoading ? 'image-loading' : ''}`}>
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (imgSrc !== fallbackUrl) {
            setImgSrc(fallbackUrl);
          }
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default SafeImage;