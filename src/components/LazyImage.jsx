// components/LazyImage.jsx
import { useState, useEffect, useRef } from 'react';

export default function LazyImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  sizes = '100vw',
  priority = false,
  blur = false
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!src) return;

    // If image is in viewport or priority, load immediately
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting || priority) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.01, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        aspectRatio: width && height ? `${width}/${height}` : undefined
      }}
    >
      {/* Blur placeholder */}
      {blur && !isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"
          style={{ filter: 'blur(20px)' }}
        />
      )}
      
      {/* Actual image */}
      {isLoaded && !hasError && (
        <img
          src={src}
          alt={alt || ''}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
      
      {/* Fallback for error */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
}