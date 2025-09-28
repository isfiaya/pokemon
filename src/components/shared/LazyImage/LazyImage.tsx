import { useState } from 'react';
import './LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const LazyImage = ({ src, alt, className = '' }: LazyImageProps) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading'
  );

  const handleLoad = () => {
    setStatus('loaded');
  };

  const handleError = () => {
    setStatus('error');
  };

  return (
    <div className={`lazy-image-container ${className}`}>
      {status === 'loading' && (
        <div className='lazy-image-placeholder'>
          <div className='lazy-image-skeleton'>
            <div className='skeleton-shimmer' />
          </div>
        </div>
      )}

      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${status}`}
          onLoad={handleLoad}
          onError={handleError}
          loading='lazy'
        />
      )}
      {status === 'error' && (
        <div className='lazy-image-error'>
          <span className='error-text'>Image unavailable</span>
        </div>
      )}
    </div>
  );
};
