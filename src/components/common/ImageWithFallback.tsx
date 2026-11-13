import React, { useState } from 'react';
import { Sprout } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFF4F0] text-[#14532D] border border-[#DFE6E0] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sprout className="w-7 h-7 opacity-60 mb-1.5" />
        {fallbackLabel && (
          <span className="text-xs font-medium text-[#526058] px-3 text-center">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
