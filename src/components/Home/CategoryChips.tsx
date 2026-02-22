import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categories } from '../../data'

interface CategoryChipsProps {
  activeCategory: string
  onSelectCategory: (category: string) => void
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({ activeCategory, onSelectCategory }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const chips = ['All', ...categories.map(c => c.name)]

  const handleScroll = () => {
    if (!scrollRef.current) return
    setShowLeftArrow(scrollRef.current.scrollLeft > 0)
    setShowRightArrow(
      scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 5
    )
  }

  useEffect(() => {
    handleScroll()
    window.addEventListener('resize', handleScroll)
    return () => window.removeEventListener('resize', handleScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative flex items-center bg-yt-bg w-full py-3 mb-6">
      
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-yt-bg via-yt-bg to-transparent flex items-center justify-start z-10 pl-2">
          <button 
            onClick={() => scroll('left')}
            className="p-1 rounded-full hover:bg-yt-surface bg-yt-bg border border-yt-border shadow-md"
          >
            <ChevronLeft className="w-5 h-5 text-yt-text" />
          </button>
        </div>
      )}

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {chips.map((chip) => (
          <button
            key={chip}
            onClick={() => onSelectCategory(chip)}
            className={`px-3 py-1.5 rounded-lg text-[14px] font-youtube font-medium transition-colors ${
              activeCategory === chip 
                ? 'bg-[#f1f1f1] text-[#0f0f0f]' 
                : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#3f3f3f]'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-yt-bg via-yt-bg to-transparent flex items-center justify-end z-10 pr-2">
          <button 
            onClick={() => scroll('right')}
            className="p-1 rounded-full hover:bg-yt-surface bg-yt-bg border border-yt-border shadow-md"
          >
            <ChevronRight className="w-5 h-5 text-yt-text" />
          </button>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  )
}
