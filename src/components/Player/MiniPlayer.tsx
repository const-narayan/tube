import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, X, Maximize2 } from 'lucide-react'
import type { VideoItem } from '../../data'

interface MiniPlayerProps {
  video: VideoItem
  onExpand: () => void
  onClose: () => void
  isPlaying?: boolean
  onTogglePlay?: () => void
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ 
  video, 
  onExpand, 
  onClose
}) => {
  const [playing, setPlaying] = useState(true)
  const [played, setPlayed] = useState(0)

  return (
    <div className="w-[320px] bg-[#212121] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#303030] cursor-pointer hover:bg-[#303030] transition-colors group">
      <div className="flex items-center h-[90px]" onClick={onExpand}>
        <div className="w-[160px] h-full flex-shrink-0 bg-black relative">
           <ReactPlayer
             url={video.mediaUrl}
             playing={playing}
             width="100%"
             height="100%"
             controls={false}
             onProgress={(s: { played: number }) => setPlayed(s.played)}
             style={{ position: 'absolute', top: 0, left: 0 }}
             config={{ youtube: { playerVars: { autoplay: 1, rel: 0, modestbranding: 1 }}}}
           />
        </div>
        
        <div className="flex-1 min-w-0 px-3 flex flex-col">
          <h4 className="text-[#f1f1f1] font-youtube font-medium text-[14px] leading-tight line-clamp-2">
            {video.title}
          </h4>
          <span className="text-[#aaaaaa] text-xs font-youtube mt-1 truncate">
            {video.channelName}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-end px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex gap-1 pointer-events-auto bg-black/60 p-1 rounded-lg backdrop-blur-sm">
             <button onClick={(e) => { e.stopPropagation(); setPlaying(!playing) }} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                 {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
             </button>
             <button onClick={(e) => { e.stopPropagation(); onExpand() }} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                 <Maximize2 className="w-5 h-5" />
             </button>
             <button onClick={(e) => { e.stopPropagation(); onClose() }} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                 <X className="w-5 h-5" />
             </button>
          </div>
      </div>

      <div className="w-full h-[3px] bg-[#3f3f3f]">
         <div className="h-full bg-[#ff0000]" style={{ width: `${played * 100}%` }}></div>
      </div>
    </div>
  )
}
