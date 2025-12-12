'use client';

import { useState } from 'react';
import { getImageUrl } from '@/lib/types';

interface ZoomableImageProps {
    filename: string;
    alt: string;
    index: number;
}

export default function ZoomableImage({ filename, alt, index }: ZoomableImageProps) {
    const [isZoomed, setIsZoomed] = useState(false);

    const handleImageClick = () => {
        setIsZoomed(true);
    };

    const handleCloseZoom = () => {
        setIsZoomed(false);
    };

    return (
        <>
            {/* Thumbnail Image */}
            <div
                className="relative shadow-lg rounded-sm overflow-hidden bg-white cursor-zoom-in hover:shadow-2xl transition-shadow duration-300"
                onClick={handleImageClick}
            >
                <img
                    src={getImageUrl(filename)}
                    alt={alt}
                    className="w-full h-auto object-contain max-h-[80vh] mx-auto filter sepia-[0.1]"
                />
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium opacity-0 hover:opacity-100 transition-opacity">
                        Klicken zum Vergrößern
                    </div>
                </div>
            </div>

            {/* Zoomed Modal */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={handleCloseZoom}
                >
                    <button
                        className="absolute top-4 right-4 text-white text-4xl font-light hover:text-gray-300 transition-colors z-10 w-12 h-12 flex items-center justify-center"
                        onClick={handleCloseZoom}
                        aria-label="Schließen"
                    >
                        ×
                    </button>

                    <div className="relative max-w-[95vw] max-h-[95vh] overflow-auto">
                        <img
                            src={getImageUrl(filename)}
                            alt={alt}
                            className="w-auto h-auto max-w-none cursor-zoom-out"
                            style={{ maxWidth: '200%', maxHeight: '200vh' }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white text-sm">
                        Klicken zum Schließen • Scrollen zum Zoomen
                    </div>
                </div>
            )}
        </>
    );
}
