import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ChevronDown, Download, MoreHorizontal, Share2, ThumbsDown, ThumbsUp, Scissors, ListPlus } from 'lucide-react'
import { Virtuoso } from 'react-virtuoso'
import type { VideoItem } from '../../data'
import { CompactVideoCard } from '../Video/CompactVideoCard'
import { CustomPlayer } from './CustomPlayer'

interface PlayerPageProps {
  video: VideoItem
  relatedVideos: VideoItem[]
  onSelectRelated: (v: VideoItem) => void
  playerState: 'HIDDEN' | 'FULL' | 'MINI'
  onMinimize: () => void
  onExpand: () => void
  onClose: () => void
}

const formatViews = (views: number) => {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

export const PlayerPage: React.FC<PlayerPageProps> = ({ video, relatedVideos, onSelectRelated, playerState, onMinimize, onExpand, onClose }) => {
  const dragControls = useAnimation()
  const isMini = playerState === 'MINI'

  useEffect(() => {
    if (!isMini) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [video.slug, isMini])

  const handleDragEnd = (_event: any, info: any) => {
    if (!isMini) {
      if (info.offset.y > 60 || info.velocity.y > 400) {
        onMinimize()
      } else {
        dragControls.start({ y: 0 })
      }
    }
  }
  
  const nextVideo = relatedVideos.length > 0 ? relatedVideos[0] : undefined;

  const renderRelatedVideo = (_index: number, v: VideoItem) => (
    <CompactVideoCard key={v.slug} video={v} onSelect={onSelectRelated} />
  )

  return (
    <div className={!isMini ? "flex flex-col lg:flex-row justify-center max-w-[1700px] mx-auto pt-6 px-4 lg:px-6 xl:px-8 gap-6 pb-20" : ""}>
      
      <div className={!isMini ? "flex-1 w-full max-w-[1080px] flex flex-col" : ""}>
        
        {!isMini && (
          <button 
            onClick={onMinimize}
            className="flex items-center gap-2 mb-3 px-3 py-1.5 w-fit hover:bg-[#272727] rounded-full text-[#f1f1f1] transition-colors"
            title="Minimize Player"
          >
             <ChevronDown className="w-5 h-5" />
             <span className="text-sm font-medium font-youtube">Minimize</span>
          </button>
        )}
        
        <motion.div
           layout
           drag={!isMini ? "y" : false}
           dragConstraints={{ top: 0, bottom: 0 }}
           dragElastic={{ top: 0.05, bottom: 0.5 }}
           onDragEnd={handleDragEnd}
           animate={dragControls}
           className={
             !isMini
               ? "w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-[#303030]/30 z-40 bg-black relative"
               : "fixed bottom-[60px] md:bottom-6 right-4 md:right-6 z-[100] w-[calc(100%-32px)] md:w-[360px] h-[90px] bg-[#212121] rounded-xl shadow-2xl flex flex-row overflow-hidden border border-[#303030] cursor-pointer hover:bg-[#303030] transition-colors"
           }
           onClick={isMini ? onExpand : undefined}
           style={{ touchAction: !isMini ? 'pan-x' : 'auto' }}
        >
           <CustomPlayer 
              video={video} 
              playerState={playerState} 
              onToggleMiniPlayer={onMinimize} 
              onExpand={onExpand}
              onClose={onClose}
              nextVideo={nextVideo}
              onPlayNext={() => nextVideo && onSelectRelated(nextVideo)}
           />
        </motion.div>

        {!isMini && (
          <>
            <h1 className="text-xl md:text-xl font-bold font-youtube text-yt-text mt-3 mb-2">
              {video.title}
            </h1>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 mt-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-yt-surface flex-shrink-0 cursor-pointer">
                   <img src={video.channelAvatarUrl} alt={video.channelName} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col cursor-pointer mr-2">
                  <span className="font-youtube font-bold text-[#f1f1f1] text-[16px] leading-tight hover:text-white">
                    {video.channelName}
                  </span>
                  <span className="font-youtube text-[12px] text-[#aaaaaa]">
                    {formatViews(video.views * 0.1)} subscribers
                  </span>
                </div>
                
                <button className="bg-[#f1f1f1] text-[#0f0f0f] hover:bg-[#d9d9d9] px-4 py-2 rounded-full font-youtube font-medium text-[14px] ml-2 transition-colors">
                  Subscribe
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
                <div className="flex bg-[#272727] rounded-full">
                  <button className="flex items-center gap-2 hover:bg-[#3f3f3f] px-4 py-[7px] rounded-l-full relative group transition-colors">
                    <ThumbsUp className="w-5 h-5 text-[#f1f1f1]" />
                    <span className="text-[14px] font-youtube font-medium text-[#f1f1f1]">{(video.views * 0.05).toFixed(0)}K</span>
                    <div className="absolute right-0 top-2 bottom-2 w-px bg-[#3f3f3f]"></div>
                  </button>
                  <button className="flex items-center hover:bg-[#3f3f3f] px-4 py-[7px] rounded-r-full transition-colors">
                    <ThumbsDown className="w-5 h-5 text-[#f1f1f1]" />
                  </button>
                </div>
                <button className="flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full px-4 py-[7px] transition-colors whitespace-nowrap">
                  <Share2 className="w-5 h-5 text-[#f1f1f1]" />
                  <span className="text-[14px] font-youtube font-medium text-[#f1f1f1]">Share</span>
                </button>
                <button className="hidden sm:flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full px-4 py-[7px] transition-colors whitespace-nowrap">
                  <Download className="w-5 h-5 text-[#f1f1f1]" />
                  <span className="text-[14px] font-youtube font-medium text-[#f1f1f1]">Download</span>
                </button>
                <button className="hidden lg:flex items-center gap-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full px-4 py-[7px] transition-colors whitespace-nowrap">
                  <Scissors className="w-5 h-5 text-[#f1f1f1]" />
                  <span className="text-[14px] font-youtube font-medium text-[#f1f1f1]">Clip</span>
                </button>
                <button className="flex items-center justify-center w-9 h-9 bg-[#272727] hover:bg-[#3f3f3f] rounded-full transition-colors flex-shrink-0">
                  <MoreHorizontal className="w-5 h-5 text-[#f1f1f1]" />
                </button>
              </div>
            </div>

            <div className="bg-[#272727] hover:bg-[#3f3f3f] cursor-pointer rounded-xl p-3 mb-6 transition-colors">
              <div className="font-youtube text-[14px] font-bold text-[#f1f1f1] flex gap-2">
                <span>{formatViews(video.views)} views</span>
                <span>{video.uploadedAt}</span>
                <span className="text-[#aaaaaa] font-normal">#AI #Tech #{video.categorySlug.replace(/-/g, '')}</span>
              </div>
              <p className="font-youtube text-[14px] text-[#f1f1f1] mt-2 leading-relaxed">
                In this video, we explore the latest insights related to {video.title}. Make sure to like and subscribe for more content! Watch until the end to discover hidden secrets.
              </p>
              <div className="font-youtube text-[14px] font-bold text-[#f1f1f1] mt-4">
                 Show more
              </div>
            </div>

            <div>
               <div className="flex items-center gap-6 mb-6">
                  <h2 className="text-xl font-youtube font-bold text-yt-text">{(video.views * 0.005).toFixed(0)} Comments</h2>
                  <div className="flex items-center gap-2 cursor-pointer font-youtube text-sm font-medium text-yt-text">
                     <ListPlus className="w-5 h-5" /> Sort by
                  </div>
               </div>
               
               <div className="flex gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center text-white font-medium">N</div>
                  <div className="flex-1 border-b border-yt-border focus-within:border-yt-text pb-1">
                     <input type="text" placeholder="Add a comment..." className="w-full bg-transparent border-none outline-none text-yt-text font-youtube text-sm placeholder-yt-text-secondary" />
                  </div>
               </div>
            </div>
          </>
        )}
      </div>

      {!isMini && (
        <div className="w-full lg:w-[400px] flex-shrink-0">
           <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 w-full">
              {['All', 'Related', 'Recently uploaded', 'Watched'].map(chip => (
                 <button key={chip} className={`px-3 py-1.5 rounded-lg text-[14px] font-youtube font-medium whitespace-nowrap transition-colors ${chip === 'All' ? 'bg-[#f1f1f1] text-[#0f0f0f]' : 'bg-[#272727] hover:bg-[#3f3f3f] text-[#f1f1f1]'}`}>
                    {chip}
                 </button>
              ))}
           </div>

           <div className="w-full">
             <Virtuoso
                useWindowScroll
                data={relatedVideos}
                itemContent={renderRelatedVideo}
             />
           </div>
        </div>
      )}
    </div>
  )
}
