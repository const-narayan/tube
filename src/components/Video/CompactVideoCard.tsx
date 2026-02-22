import React from 'react'
import { MoreVertical } from 'lucide-react'
import type { VideoItem } from '../../data'

interface CompactVideoCardProps {
  video: VideoItem
  onSelect: (video: VideoItem) => void
}

const formatViews = (views: number) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const formatCategory = (slug: string) => {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

export const CompactVideoCard: React.FC<CompactVideoCardProps> = ({ video, onSelect }) => {
  return (
    <div className="flex gap-2 cursor-pointer group w-full mb-2 hover:bg-yt-surface-hover/30 p-1 -ml-1 rounded-xl transition-colors relative" onClick={() => onSelect(video)}>
      <div className="relative w40 lg:w-44 flex-shrink-0 aspect-video rounded-lg overflow-hidden bg-yt-surface">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] font-youtube font-medium text-white">
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="flex flex-col min-w-0 flex-1 py-0.5 pr-6">
        <h3 className="text-[#f1f1f1] font-youtube font-medium text-[14px] leading-tight line-clamp-2 mb-1">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 mb-0.5 mt-0.5">
           <span className="bg-[#272727] text-[#aaaaaa] text-[9px] uppercase font-youtube font-bold px-1.5 py-0.5 rounded-sm">
             {formatCategory(video.categorySlug)}
           </span>
           <div className="text-[#aaaaaa] text-xs font-youtube hover:text-[#f1f1f1] transition-colors truncate">
             {video.channelName}
           </div>
        </div>
        <div className="text-[#aaaaaa] text-xs font-youtube mt-0.5">
            <span>{formatViews(video.views)} views</span>
            <span className="mx-1 text-[10px]">•</span>
            <span>{video.uploadedAt}</span>
        </div>
      </div>

      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 hover:bg-yt-surface-hover rounded-full" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="w-4 h-4 text-yt-text" />
        </button>
      </div>
    </div>
  )
}
