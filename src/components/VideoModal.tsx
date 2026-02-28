import { X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  videoId: string;
  onClose: () => void;
  isShort?: boolean;
  sourceUrl?: string;
};

const VideoModal = ({ open, videoId, onClose, isShort, sourceUrl }: Props) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const base = "https://www.youtube.com/embed/";
  const src = `${base}${videoId}?autoplay=1&rel=0`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[420px] rounded-2xl overflow-hidden bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/70 text-white p-2 hover:bg-black/80"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="w-full aspect-[9/16]">
          <iframe
            key={videoId}
            className="h-full w-full"
            src={src}
            title="Sentinela Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
