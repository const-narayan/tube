import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import ReactPlayer from 'react-player'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'classnames'
import { groupedVideos, type VideoItem } from '../data'



const formatTime = (s: number) => {
  if (!s || Number.isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}



const PlayIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
)
const PauseIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
)
const CloseIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
)
const ChevronDown = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
)
const SkipBackIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" /><text x="10" y="15.5" fontSize="7" fontWeight="bold" fill="currentColor" textAnchor="middle">10</text></svg>
)
const SkipForwardIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" /><text x="14" y="15.5" fontSize="7" fontWeight="bold" fill="currentColor" textAnchor="middle">10</text></svg>
)



type Props = {
  video: VideoItem
  onClose: () => void
  onSelect: (video: VideoItem) => void
  isMinimized: boolean
  setIsMinimized: (v: boolean) => void
}



export default function PlayerOverlay({
  video,
  onClose,
  onSelect,
  isMinimized,
  setIsMinimized,
}: Props) {
  const playerRef = useRef<any>(null)
  const related = useMemo(
    () => groupedVideos[video.categorySlug]?.filter((v) => v.slug !== video.slug) || [],
    [video.categorySlug, video.slug],
  )
  const allInCategory = useMemo(() => groupedVideos[video.categorySlug] || [], [video.categorySlug])
  const currentIndex = allInCategory.findIndex((v) => v.slug === video.slug)

  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(video.duration)
  const [showList, setShowList] = useState(false)
  const [nextCountdown, setNextCountdown] = useState<number | null>(null)
  const [skipFlash, setSkipFlash] = useState<'back' | 'forward' | null>(null)

  useEffect(() => {
    setPlaying(true)
    setProgress(0)
    setDuration(video.duration)
    setNextCountdown(null)
    setSkipFlash(null)
  }, [video.slug])

  useEffect(() => {
    if (nextCountdown === null) return
    if (nextCountdown <= 0) {
      setNextCountdown(null)
      playNext()
      return
    }
    const t = setTimeout(() => setNextCountdown((c) => (c ?? 1) - 1), 1000)
    return () => clearTimeout(t)
  }, [nextCountdown])

  const playNext = useCallback(() => {
    if (allInCategory.length <= 1) return
    const next = allInCategory[(currentIndex + 1) % allInCategory.length]
    if (!next) return
    onSelect(next)
  }, [allInCategory, currentIndex, onSelect])

  const handleSeek = (v: number) => {
    playerRef.current?.seekTo(v, 'seconds')
    setProgress(v)
  }

  const handleSkip = (delta: number) => {
    const target = Math.min(Math.max(progress + delta, 0), duration || progress + delta)
    handleSeek(target)
    setSkipFlash(delta > 0 ? 'forward' : 'back')
    setTimeout(() => setSkipFlash(null), 500)
  }

  const handleEnded = () => {
    if (allInCategory.length > 1) {
      setNextCountdown(3)
      setPlaying(false)
    }
  }

  if (isMinimized) {
    return (
      <motion.div
        layout
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed bottom-4 right-3 left-3 z-50 flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-panel/95 shadow-2xl backdrop-blur-xl sm:left-auto sm:w-[400px]"
        onClick={() => setIsMinimized(false)}
      >
        <div className="relative h-[68px] w-[120px] flex-shrink-0 overflow-hidden bg-black">
          <ReactPlayer
            url={video.mediaUrl}
            playing={playing}
            muted
            width="100%"
            height="100%"
            controls={false}
            config={{ youtube: { playerVars: { rel: 0, modestbranding: 1 } } } as any}
          />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 pr-1">
          <p className="line-clamp-1 text-sm font-semibold text-white">{video.title}</p>
          <p className="text-xs text-white/40">{video.categorySlug.replace(/-/g, ' ')}</p>
        </div>

        <div className="flex items-center gap-1 pr-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="rounded-full p-2 text-white transition hover:bg-white/10"
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <CloseIcon />
          </button>
        </div>
      </motion.div>
    )
  }


  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="fixed inset-0 z-50 flex flex-col bg-ink overflow-hidden"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div
          className="relative w-full flex-shrink-0 bg-black"
          style={{ aspectRatio: '16/9', maxHeight: '45vh' }}
        >
          <ReactPlayer
            ref={playerRef}
            url={video.mediaUrl}
            playing={playing}
            width="100%"
            height="100%"
            muted={false}
            controls
            config={
              video.mediaType === 'YOUTUBE' 
                ? {
                    youtube: {
                      playerVars: {
                        rel: 0,
                        modestbranding: 1,
                        playsinline: 1,
                        origin: window.location.origin,
                      },
                    },
                  }
                : {
                    file: { forceHLS: video.mediaUrl.endsWith('.m3u8') },
                  } as any
            }
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onProgress={(s: any) => setProgress(s.playedSeconds)}
            onDuration={(d: number) => setDuration(d || video.duration)}
            onEnded={handleEnded}
          />

          <AnimatePresence>
            {skipFlash && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="flex items-center gap-2 rounded-full bg-black/60 px-6 py-3 text-2xl font-black text-white backdrop-blur-sm"
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                >
                  {skipFlash === 'forward' ? '⏩ +10s' : '⏪ -10s'}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute left-0 right-0 top-0 z-[60] flex items-center justify-between px-4 pb-8 pt-3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <button
            onClick={onClose}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
          >
            <ChevronDown />
            <span>Close</span>
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="pointer-events-auto rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/80 backdrop-blur-sm transition hover:bg-white/20"
          >
            Minimize
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto bg-ink">
          <div className="border-b border-white/5 px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold leading-snug text-white">{video.title}</h3>
                <span className="mt-1 inline-block rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                  {video.categorySlug.replace(/-/g, ' ')}
                </span>
              </div>
              <div className="flex-shrink-0 text-right text-xs tabular-nums text-white/50">
                <span className="text-white/80">{formatTime(progress)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSkip(-10)}
                  className="rounded-full bg-white/5 p-2.5 text-white transition hover:bg-white/10 active:scale-95"
                  title="Skip back 10s"
                >
                  <SkipBackIcon />
                </button>
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="rounded-full bg-accent px-5 py-2.5 text-white shadow-glow transition hover:brightness-110 active:scale-95"
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                  onClick={() => handleSkip(10)}
                  className="rounded-full bg-white/5 p-2.5 text-white transition hover:bg-white/10 active:scale-95"
                  title="Skip forward 10s"
                >
                  <SkipForwardIcon />
                </button>
              </div>
              <button
                onClick={() => setShowList((v) => !v)}
                className={clsx(
                  'rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition',
                  showList
                    ? 'bg-accent/20 text-accent'
                    : 'bg-white/5 text-white/60 hover:bg-white/10',
                )}
              >
                {showList ? 'Hide list' : `More (${related.length})`}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {nextCountdown !== null && (
              <motion.div
                className="mx-4 mt-3 flex items-center justify-between rounded-2xl bg-accent/10 px-4 py-3 text-sm text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span className="font-medium">
                  Up next in <span className="font-bold text-accent">{nextCountdown}s</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNextCountdown(null)
                      setPlaying(true)
                    }}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase hover:bg-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={playNext}
                    className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase text-white"
                  >
                    Play now
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showList && (
              <motion.div
                className="flex-1 px-4 py-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                  More in {video.categorySlug.replace(/-/g, ' ')}
                </p>
                <div className="flex flex-col gap-2">
                  {related.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => onSelect(item)}
                      className={clsx(
                        'flex items-center gap-3 rounded-2xl p-2 text-left transition',
                        'bg-white/[0.03] hover:bg-white/[0.07]',
                      )}
                    >
                      <div className="relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-black">
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-px text-[10px] font-bold tabular-nums text-white">
                          {formatTime(item.duration)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold leading-tight text-white">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-xs text-white/40">
                          {item.categorySlug.replace(/-/g, ' ')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showList && (
            <button
              onClick={() => setShowList(true)}
              className="mx-4 mt-3 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 py-4 text-sm text-white/30 transition hover:border-white/20 hover:text-white/50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              Show {related.length} related videos
            </button>
          )}
        </div>
      </motion.div>
    </>
  )
}
