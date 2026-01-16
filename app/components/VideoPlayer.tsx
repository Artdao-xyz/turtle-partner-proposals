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
    <div className={`w-full max-w-5xl rounded-2xl mx-auto px-4 lg:px-0 ${className} shadow-black-turtle`}>
      <div className="relative rounded-2xl overflow-hidden outline outline-black-highlight/10 bg-black-highlight/2 p-2 lg:p-3">
        {/* Video Container */}
        <div className="relative w-full bg-black rounded-xl" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              id="loom-embed"
              src={loomEmbedUrl}
              frameBorder="0"
              allowFullScreen
              title={title}
              tabIndex={-1}
              style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              loading="lazy"
            />
        </div>

        {/* Text Below Video */}
        <div className="p-2 lg:p-3 space-y-1.5 lg:space-y-2">
          <h3 className="text-[#eff8ed] text-lg lg:text-2xl font-semibold">{title}</h3>
          <p className="text-white/50 text-xs lg:text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
