import { motion } from 'framer-motion'
import { type VideoItem } from '../data'

const formatTime = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

type Props = {
  video: VideoItem
  categoryName: string
  onSelect: (video: VideoItem) => void
}

export default function VideoCard({ video, categoryName, onSelect }: Props) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(video)}
      className="group w-full overflow-hidden rounded-3xl border border-white/5 bg-panel/80 text-left shadow-xl backdrop-blur transition-shadow hover:shadow-glow/30"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-bold tabular-nums text-white shadow">
          {formatTime(video.duration)}
        </span>
        <span className="absolute left-2 top-2 rounded-full bg-accent/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow backdrop-blur-sm">
          {categoryName}
        </span>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
          <div className="scale-75 rounded-full bg-white/20 p-3 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3 p-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-400 text-lg font-black text-white shadow-glow">
          {(video.title[0] || 'V').toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold leading-tight text-white">
            {video.title}
          </p>
          <p className="mt-0.5 text-xs text-white/40">{categoryName}</p>
        </div>
      </div>
    </motion.button>
  )
}
