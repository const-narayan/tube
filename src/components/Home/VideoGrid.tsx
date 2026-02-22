import React from 'react'
import { VideoCard } from '../Video/VideoCard'
import { VirtuosoGrid } from 'react-virtuoso'
import type { VideoItem } from '../../data'

interface VideoGridProps {
  videos: VideoItem[]
  onSelectVideo: (video: VideoItem) => void
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, onSelectVideo }) => {
  return (
    <VirtuosoGrid
      useWindowScroll
      data={videos}
      listClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 px-4 md:px-6 pb-20"
      itemContent={(_index, video) => (
        <VideoCard 
          key={video.slug} 
          video={video} 
          onSelect={onSelectVideo} 
        />
      )}
    />
  )
}
