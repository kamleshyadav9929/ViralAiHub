import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const VideoPlayerModal = ({ videoUrl, isOpen, onClose, title }: VideoPlayerModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      // Auto play video once opened
      if (videoRef.current) {
        videoRef.current.play().catch(err => console.log('Autoplay blocked', err));
      }
    }
  }, [isOpen]);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.error(err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-3xl rounded-[28px] overflow-hidden bg-[#07070d] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-10"
          >
            {/* Title / Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 select-none bg-white/[0.01]">
              <span className="font-heading text-xs uppercase tracking-widest font-bold text-white/50">
                {title || 'Video Preview'}
              </span>
              <button
                onClick={onClose}
                className="text-white/40 hover:text-white p-1.5 hover:bg-white/5 rounded-full transition-all cursor-pointer border-0 bg-transparent"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Canvas */}
            <div className="relative aspect-video w-full bg-black group">
              <video
                ref={videoRef}
                src={videoUrl}
                loop
                playsInline
                autoPlay
                className="w-full h-full object-contain"
                onClick={handleTogglePlay}
              />

              {/* Custom Controller Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md border border-white/5 px-4 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-3">
                  {/* Play / Pause */}
                  <button
                    onClick={handleTogglePlay}
                    className="text-white hover:text-[#ff7759] transition-colors cursor-pointer bg-transparent border-0 outline-none"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>

                  {/* Volume Control */}
                  <button
                    onClick={handleToggleMute}
                    className="text-white hover:text-[#ff7759] transition-colors cursor-pointer bg-transparent border-0 outline-none"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>

                <span className="text-[10px] font-mono text-white/40 tracking-wider">
                  Loop Player
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
