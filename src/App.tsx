import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { TopBar } from './components/Navigation/TopBar'
import { Sidebar } from './components/Navigation/Sidebar'
import { CategoryChips } from './components/Home/CategoryChips'
import { VideoGrid } from './components/Home/VideoGrid'
import { PlayerPage } from './components/Player/PlayerPage'

import { categories, shuffledVideos, videos, type VideoItem } from './data'

function App() {
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [playerState, setPlayerState] = useState<'HIDDEN' | 'FULL' | 'MINI'>('HIDDEN')
  const navigate = useNavigate()

  const handleSelectVideo = useCallback((video: VideoItem) => {
    setCurrentVideo(video)
    setPlayerState('FULL')
    navigate(`/watch/${video.slug}`)
  }, [navigate])

  const handleMinimize = useCallback(() => {
    setPlayerState('MINI')
    navigate('/')
  }, [navigate])

  const handleClose = useCallback(() => {
    setPlayerState('HIDDEN')
    setCurrentVideo(null)
    navigate('/')
  }, [navigate])

  const handleExpand = useCallback(() => {
    if (currentVideo) {
      setPlayerState('FULL')
      navigate(`/watch/${currentVideo.slug}`)
    }
  }, [navigate, currentVideo])

  const relatedVideos = currentVideo
      ? shuffledVideos.filter(v => v.slug !== currentVideo.slug && v.categorySlug === currentVideo.categorySlug).slice(0, 15)
      : []

  const filteredFeedVideos = activeCategory === 'All'
      ? shuffledVideos
      : shuffledVideos.filter(v => {
          const cat = categories.find(c => c.name === activeCategory)
          return cat ? v.categorySlug === cat.slug : true
      })

  return (
    <div className="min-h-screen bg-yt-bg flex flex-col font-youtube text-yt-text">
      <TopBar />

      <div className="flex flex-1 mt-14 relative">
        {playerState !== 'FULL' && (
            <div className="hidden md:block w-[72px] xl:w-60 flex-shrink-0">
              <Sidebar />
            </div>
        )}

        <main className={`flex-1 overflow-x-hidden ${playerState === 'FULL' ? 'w-full' : ''}`}>

          <div className={`${playerState === 'FULL' ? 'hidden' : 'flex flex-col'} w-full max-w-[2200px] mx-auto`}>
            <CategoryChips
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
            <VideoGrid videos={filteredFeedVideos} onSelectVideo={handleSelectVideo} />
          </div>

          <Routes>
            <Route path="/watch/:slug" element={
              <WatchRoute
                currentVideo={currentVideo}
                setCurrentVideo={setCurrentVideo}
                setPlayerState={setPlayerState}
                relatedVideos={relatedVideos}
                onSelectRelated={handleSelectVideo}
                playerState={playerState}
                onMinimize={handleMinimize}
                onExpand={handleExpand}
                onClose={handleClose}
              />
            } />
          </Routes>

          {playerState === 'MINI' && currentVideo && (
            <PlayerPage
              video={currentVideo}
              relatedVideos={relatedVideos}
              onSelectRelated={handleSelectVideo}
              playerState={playerState}
              onMinimize={handleMinimize}
              onExpand={handleExpand}
              onClose={handleClose}
            />
          )}

        </main>
      </div>
    </div>
  )
}

function WatchRoute({
  currentVideo,
  setCurrentVideo,
  setPlayerState,
  relatedVideos,
  onSelectRelated,
  playerState,
  onMinimize,
  onExpand,
  onClose,
}: {
  currentVideo: VideoItem | null
  setCurrentVideo: (v: VideoItem | null) => void
  setPlayerState: (s: 'HIDDEN' | 'FULL' | 'MINI') => void
  relatedVideos: VideoItem[]
  onSelectRelated: (v: VideoItem) => void
  playerState: 'HIDDEN' | 'FULL' | 'MINI'
  onMinimize: () => void
  onExpand: () => void
  onClose: () => void
}) {
  const { slug } = useParams<{ slug: string }>()

  useEffect(() => {
    if (slug) {
      const found = videos.find((vid) => vid.slug === slug)
      if (found) {
        setCurrentVideo(found)
        setPlayerState('FULL')
      }
    }
  }, [slug, setCurrentVideo, setPlayerState])

  if (!currentVideo || playerState === 'MINI') return null

  return (
    <PlayerPage
      video={currentVideo}
      relatedVideos={relatedVideos}
      onSelectRelated={onSelectRelated}
      playerState={playerState}
      onMinimize={onMinimize}
      onExpand={onExpand}
      onClose={onClose}
    />
  )
}

export default App
