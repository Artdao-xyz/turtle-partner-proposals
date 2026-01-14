'use client';

interface VideoPlayerProps {
  loomId: string; // Para Loom embed (ID o URL completa)
  title: string;
  description: string;
  className?: string;
}

// Helper para extraer el ID de Loom desde una URL
function extractLoomId(urlOrId: string): string {
  // Si ya es un ID (sin caracteres especiales de URL), devolverlo tal cual
  if (!urlOrId.includes('loom.com')) {
    return urlOrId;
  }

  // Patrones para diferentes formatos de URL de Loom
  const patterns = [
    /loom\.com\/share\/([a-zA-Z0-9]+)/,
    /loom\.com\/embed\/([a-zA-Z0-9]+)/,
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
  loomId,
  title,
  description,
  className = '',
}: VideoPlayerProps) {
  // Extraer el ID de Loom si se proporciona una URL
  const extractedLoomId = extractLoomId(loomId);

  // URL de embed para Loom
  const loomEmbedUrl = `https://www.loom.com/embed/${extractedLoomId}`;

  return (
    <div className={`w-full max-w-6xl rounded-2xl mx-auto ${className} shadow-black-turtle`}>
      <div className="relative rounded-2xl overflow-hidden outline outline-black-highlight/10 bg-black-highlight/2 p-3">
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black rounded-xl">
          <iframe
            src={loomEmbedUrl}
            className="w-full h-full rounded-xl"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          />
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
