import React from 'react'
import { MoreVertical } from 'lucide-react'
import type { VideoItem } from '../../data'

interface VideoCardProps {
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

export const VideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  return (
    <div className="flex flex-col gap-3 cursor-pointer group w-full" onClick={() => onSelect(video)}>
      <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-surface">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs font-youtube font-medium text-white">
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="flex gap-3 pr-6 relative">
        <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 mt-0.5 bg-yt-surface">
          <img src={video.channelAvatarUrl} alt={video.channelName} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col min-w-0 mt-0.5">
          <h3 className="text-[#f1f1f1] font-youtube font-semibold text-base leading-tight line-clamp-2 mb-1">
            {video.title}
          </h3>
          <div className="flex items-center gap-2 mb-0.5 mt-0.5">
             <span className="bg-[#272727] text-[#aaaaaa] text-[10px] uppercase font-youtube font-bold px-1.5 py-0.5 rounded-sm">
               {formatCategory(video.categorySlug)}
             </span>
             <div className="text-[#aaaaaa] text-[14px] font-youtube hidden md:flex items-center gap-1 hover:text-[#f1f1f1] transition-colors cursor-pointer">
               {video.channelName}
             </div>
          </div>
          <div className="text-[#aaaaaa] text-xs md:text-[14px] font-youtube flex items-center md:mt-0">
             <span className="md:hidden truncate mr-1 hover:text-[#f1f1f1] cursor-pointer">{video.channelName} • </span>
             <span>{formatViews(video.views)} views</span>
             <span className="mx-1 text-[10px]">•</span>
             <span>{video.uploadedAt}</span>
          </div>
        </div>

        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 hover:bg-yt-surface-hover rounded-full">
            <MoreVertical className="w-5 h-5 text-yt-text" />
          </button>
        </div>
      </div>
    </div>
  )
}
