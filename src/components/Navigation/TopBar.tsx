import React from 'react'
import { Menu, Search, Mic, Youtube } from 'lucide-react'

export const TopBar: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-yt-bg flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-yt-surface-hover rounded-full transition-colors hidden md:block">
          <Menu className="w-6 h-6 text-yt-text" />
        </button>
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => window.location.href = '/'}>
          <Youtube className="w-8 h-8 text-[#FF0000]" fill="currentColor" strokeWidth={0} />
          <span className="text-white font-youtube font-bold tracking-tighter text-xl hidden sm:block -ml-0.5">YouTube</span>
          <span className="text-yt-text-secondary text-[10px] uppercase ml-1 self-start mt-1">IN</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center max-w-[720px] gap-4 ml-8 mr-4 sm:ml-12 sm:mr-8 hidden sm:flex">
        <div className="flex-1 flex items-center">
          <div className="flex-1 flex items-center bg-[#121212] border border-[#303030] rounded-l-full px-4 py-1.5 focus-within:border-[#1c62b9] focus-within:ml-0 overflow-hidden relative group">
            <div className="absolute left-3 hidden group-focus-within:block flex items-center justify-center">
               <Search className="w-4 h-4 text-yt-text" />
            </div>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-transparent border-none outline-none text-yt-text font-youtube text-base placeholder-yt-text-secondary group-focus-within:ml-7"
            />
          </div>
          <button className="bg-[#222222] border border-l-0 border-[#303030] rounded-r-full px-5 h-[40px] hover:bg-[#303030] transition flex items-center justify-center group">
            <Search className="w-5 h-5 text-yt-text-secondary group-hover:text-yt-text" />
          </button>
        </div>
        <button className="p-2.5 bg-yt-surface hover:bg-yt-surface-hover rounded-full flex-shrink-0 transition ml-2">
          <Mic className="w-5 h-5 text-yt-text" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="p-2 sm:hidden hover:bg-yt-surface-hover rounded-full transition">
          <Search className="w-5 h-5 text-yt-text" />
        </button>
        <button className="p-2 sm:hidden hover:bg-yt-surface-hover rounded-full transition">
          <Mic className="w-5 h-5 text-yt-text" />
        </button>
        <button className="ml-2 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
          N
        </button>
      </div>
    </div>
  )
}
