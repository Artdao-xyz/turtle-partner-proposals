'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoPlayerProps {
  videoSrc?: string; // Para video tag HTML5
  youtubeId?: string; // Para YouTube embed (ID o URL completa)
  vimeoId?: string; // Para Vimeo embed
  poster?: string; // Imagen de portada para video tag
  title: string;
  description: string;
  className?: string;
}

// Helper para extraer el ID de YouTube desde una URL
function extractYouTubeId(urlOrId: string): string {
  // Si ya es un ID (sin caracteres especiales de URL), devolverlo tal cual
  if (!urlOrId.includes('youtube.com') && !urlOrId.includes('youtu.be')) {
    return urlOrId;
  }

  // Patrones para diferentes formatos de URL de YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return urlOrId; // Si no se puede extraer, devolver el valor original
}

export default function VideoPlayer({
  videoSrc,
  youtubeId,
  vimeoId,
  poster,
  title,
  description,
  className = '',
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Extraer el ID de YouTube si se proporciona una URL
  const extractedYouTubeId = youtubeId ? extractYouTubeId(youtubeId) : undefined;

  const handlePlay = () => {
    if (videoSrc && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else if (youtubeId || vimeoId) {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoSrc && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Determinar qué tipo de video usar
  const hasVideoTag = !!videoSrc;
  const hasYouTube = !!extractedYouTubeId;
  const hasVimeo = !!vimeoId;

  // URL de embed para YouTube
  const youtubeEmbedUrl = extractedYouTubeId
    ? `https://www.youtube.com/embed/${extractedYouTubeId}?autoplay=1&rel=0&modestbranding=1`
    : '';

  // URL de embed para Vimeo
  const vimeoEmbedUrl = vimeoId
    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
    : '';

  return (
    <div className={`w-full max-w-6xl rounded-2xl mx-auto ${className} shadow-black-turtle`}>
      <div className="relative rounded-2xl overflow-hidden outline outline-black-highlight/10 bg-black-highlight/2 p-3">
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black rounded-xl">
          {/* Video Tag HTML5 */}
          {hasVideoTag && (
            <>
              <video
                ref={videoRef}
                src={videoSrc}
                poster={poster}
                className="w-full h-full object-cover rounded-xl"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={isPlaying}
              />
              
              {/* Custom Play Button Overlay */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl cursor-pointer"
                    onClick={handlePlay}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-1.5 w-full max-w-56 mx-auto outline outline-black-highlight/10 flex items-center gap-3 backdrop-blur-sm rounded-4xl bg-black-turtle cursor-pointer"
                      style={{
                        boxShadow: 'var(--shadow-black-turtle)',
                      }}
                    >
                      {/* Play Icon */}
                      <div className="rounded-full bg-black-highlight/10 p-2 shrink-0">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-green-turtle"
                        >
                          <path
                            d="M8 5v14l11-7z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-white-turtle font-medium text-base flex-1 text-center">Watch Video</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* YouTube Embed */}
          {hasYouTube && extractedYouTubeId && (
            <>
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  {poster && (
                    <img
                      src={poster}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                    className="relative z-10 px-6 py-3 rounded-lg bg-black-highlight/20 border border-black-highlight/30 flex items-center gap-3 backdrop-blur-sm"
                    style={{
                      boxShadow: 'var(--shadow-black-turtle)',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-green-turtle"
                    >
                      <path
                        d="M8 5v14l11-7z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-white-turtle font-medium text-base">Watch Video</span>
                  </motion.button>
                </div>
              ) : (
                <iframe
                  src={youtubeEmbedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={title}
                />
              )}
            </>
          )}

          {/* Vimeo Embed */}
          {hasVimeo && (
            <>
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  {poster && (
                    <img
                      src={poster}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                    className="relative z-10 px-6 py-3 rounded-lg bg-black-highlight/20 border border-black-highlight/30 flex items-center gap-3 backdrop-blur-sm"
                    style={{
                      boxShadow: 'var(--shadow-black-turtle)',
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-green-turtle"
                    >
                      <path
                        d="M8 5v14l11-7z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-white-turtle font-medium text-base">Watch Video</span>
                  </motion.button>
                </div>
              ) : (
                <iframe
                  src={vimeoEmbedUrl}
                  className="w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={title}
                />
              )}
            </>
          )}
        </div>

        {/* Text Below Video */}
        <div className="p-3 space-y-2">
          <h3 className="text-white-turtle text-xl font-semibold">{title}</h3>
          <p className="text-white-turtle/70 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
