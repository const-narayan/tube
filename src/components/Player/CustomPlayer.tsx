import React, { useRef, useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { VideoItem } from '../../data'

interface CustomPlayerProps {
  video: VideoItem
  playerState?: 'HIDDEN' | 'FULL' | 'MINI'
  onToggleMiniPlayer?: () => void
  onExpand?: () => void
  onClose?: () => void
  nextVideo?: VideoItem
  onPlayNext?: () => void
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export const CustomPlayer: React.FC<CustomPlayerProps> = ({ video, playerState = 'FULL', onToggleMiniPlayer, onExpand, onClose, nextVideo, onPlayNext }) => {
  const playerRef = useRef<any>(null)
  
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [showControls, setShowControls] = useState(true)

  
  const [nextCountdown, setNextCountdown] = useState<number | null>(null)
  const [actionFlash, setActionFlash] = useState<'back' | 'forward' | 'play' | 'pause' | null>(null)

  let controlsTimeout: ReturnType<typeof setTimeout>

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(controlsTimeout)
    controlsTimeout = setTimeout(() => setShowControls(false), 2500)
  }

  const triggerActionFlash = (action: 'back' | 'forward' | 'play' | 'pause') => {
    setActionFlash(action)
    setTimeout(() => setActionFlash(null), 500)
  }

  const handlePlayPause = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const newPlayingState = !playing
    setPlaying(newPlayingState)
    triggerActionFlash(newPlayingState ? 'play' : 'pause')
  }
  
  const handleSkip = (amount: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + amount, 'seconds')
      triggerActionFlash(amount > 0 ? 'forward' : 'back')
    }
  }

  const handleSeekMouseDown = () => setSeeking(true)
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => setPlayed(parseFloat(e.target.value))
  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false)
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat((e.target as HTMLInputElement).value))
    }
  }

  const handleProgress = (state: { played: number }) => {
    if (!seeking) setPlayed(state.played)
  }

  const handleEnded = () => {
    if (nextVideo) {
      setNextCountdown(3)
      setPlaying(false)
    }
  }

  useEffect(() => {
    if (nextCountdown === null) return
    if (nextCountdown <= 0) {
      setNextCountdown(null)
      onPlayNext?.()
      return
    }
    const t = setTimeout(() => setNextCountdown(c => (c ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  }, [nextCountdown, onPlayNext])

  useEffect(() => {
    setPlaying(true)
    setNextCountdown(null)
    setActionFlash(null)
  }, [video.slug])


  const isMini = playerState === 'MINI'

  return (
    <div 
      className="relative w-full h-full bg-black group flex"
      onMouseMove={!isMini ? handleMouseMove : undefined}
      onMouseLeave={!isMini ? () => setShowControls(false) : undefined}
    >
      <div className={`relative flex-shrink-0 bg-black ${isMini ? 'w-[160px] h-full' : 'w-full h-full'}`}>
        <ReactPlayer
          ref={playerRef}
          url={video.mediaUrl}
          playing={playing}
          muted={muted}
          volume={volume}
          width="100%"
          height="100%"
          controls={false}

          onProgress={handleProgress}
          onDuration={setDuration}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={handleEnded}
          config={
            video.mediaType === 'YOUTUBE' 
              ? { youtube: { playerVars: { autoplay: 1, rel: 0, modestbranding: 1, origin: window.location.origin, fs: 0 } } }
              : { file: { forceHLS: video.mediaUrl.endsWith('.m3u8') } } as any
          }
        />
      </div>

      {isMini && (
        <>
          <div className="flex-1 min-w-0 px-3 flex flex-col justify-center bg-[#212121]">
            <h4 className="text-[#f1f1f1] font-youtube font-medium text-[14px] leading-tight line-clamp-2">
              {video.title}
            </h4>
            <span className="text-[#aaaaaa] text-xs font-youtube mt-1 truncate">
              {video.channelName}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#3f3f3f]">
            <div className="h-full bg-[#ff0000]" style={{ width: `${played * 100}%` }}></div>
          </div>

          <div className="absolute inset-0 flex items-center justify-end px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="flex gap-1 pointer-events-auto bg-black/60 p-1 rounded-lg backdrop-blur-sm">
               <button onClick={handlePlayPause} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                   {playing ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
               </button>
               {onExpand && (
                 <button onClick={(e) => { e.stopPropagation(); onExpand() }} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                     <Maximize2 className="w-5 h-5" />
                 </button>
               )}
               {onClose && (
                 <button onClick={(e) => { e.stopPropagation(); onClose() }} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                     <X className="w-5 h-5" />
                 </button>
               )}
            </div>
          </div>
        </>
      )}

      {!isMini && (
        <>
          <AnimatePresence>
            {actionFlash && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <motion.div
                  className="flex items-center justify-center gap-2 rounded-full bg-black/60 px-6 py-3 text-2xl font-black text-white backdrop-blur-sm shadow-xl"
                  initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6, opacity: 0 }}
                >
                  {actionFlash === 'forward' && '⏩ +10s'}
                  {actionFlash === 'back' && '⏪ -10s'}
                  {actionFlash === 'play' && <Play className="w-8 h-8 fill-current text-white" />}
                  {actionFlash === 'pause' && <Pause className="w-8 h-8 fill-current text-white" />}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {nextCountdown !== null && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <div className="pointer-events-auto flex flex-col items-center gap-4 text-white">
                  <p className="font-youtube font-medium text-lg text-white/50 tracking-wide uppercase">Up Next</p>
                  <p className="font-youtube font-bold text-xl md:text-2xl text-center max-w-[80%]">{nextVideo?.title}</p>
                  <p className="font-youtube font-bold text-4xl mt-2">{nextCountdown}s</p>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => { setNextCountdown(null); setPlaying(true) }} className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 font-youtube font-bold transition-colors">
                      Cancel
                    </button>
                    <button onClick={() => onPlayNext?.()} className="px-6 py-2 rounded-full bg-white text-black hover:bg-gray-200 font-youtube font-bold transition-colors">
                      Play Now
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${showControls && nextCountdown === null ? 'opacity-100' : 'opacity-0'}`}
            onClick={handlePlayPause}
          >
          <div className="p-4 flex flex-col gap-2 pointer-events-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center group/scrubber cursor-pointer">
              <input
                type="range" min={0} max={0.999999} step="any" value={played}
                onMouseDown={handleSeekMouseDown} onChange={handleSeekChange} onMouseUp={handleSeekMouseUp}
                className="w-full h-1 bg-white/30 rounded-full appearance-none hover:h-1.5 transition-all outline-none accent-[#ff0000]"
              />
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-4">
                <button onClick={handlePlayPause} className="text-white hover:text-[#ff0000] transition-colors">
                  {playing ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
                <button onClick={(e) => handleSkip(-10, e)} className="text-white hover:text-gray-300 transition-colors" title="-10s">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button onClick={(e) => handleSkip(10, e)} className="text-white hover:text-gray-300 transition-colors" title="+10s">
                  <RotateCw className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 group/volume">
                  <button onClick={() => setMuted(!muted)} className="text-white hover:text-gray-300 transition-colors">
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range" min={0} max={1} step="any" value={muted ? 0 : volume}
                    onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                    className="w-0 group-hover/volume:w-16 transition-all duration-300 h-1 bg-white/30 rounded-full appearance-none accent-white origin-left"
                  />
                </div>



                <span className="text-[#f1f1f1] text-xs font-youtube font-medium ml-2">
                  {formatTime(played * duration)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
          </div>
        </>
      )}
    </div>
  )
}
