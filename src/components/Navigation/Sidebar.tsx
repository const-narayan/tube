import React from 'react'
import { Home, PlaySquare, Clock, ThumbsUp, ChevronDown, MonitorPlay, History } from 'lucide-react'

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-14 left-0 bottom-0 w-[72px] xl:w-60 bg-yt-bg hover:overflow-y-auto overflow-hidden hidden md:flex flex-col py-3 z-40 pb-20 scrollbar-thin scrollbar-thumb-yt-surface-hover scrollbar-track-transparent">
      
      <div className="flex flex-col border-b border-yt-border pb-3 mb-3 px-3">
        <SidebarItem icon={<Home />} label="Home" active />
        <SidebarItem icon={<MonitorPlay />} label="Shorts" />
        <SidebarItem icon={<PlaySquare />} label="Subscriptions" />
      </div>

      <div className="flex-col border-b border-yt-border pb-3 mb-3 px-3 hidden xl:flex">
        <h3 className="flex items-center gap-2 px-3 py-2 text-yt-text font-bold font-youtube text-base hover:bg-yt-surface rounded-xl cursor-pointer">
          You <ChevronDown className="w-4 h-4" />
        </h3>
        <SidebarItem icon={<History />} label="History" />
        <SidebarItem icon={<PlaySquare />} label="Playlists" />
        <SidebarItem icon={<Clock />} label="Watch later" />
        <SidebarItem icon={<ThumbsUp />} label="Liked videos" />
      </div>
      
      <div className="flex-col pb-3 px-3 hidden xl:flex">
        <h3 className="px-3 py-2 text-yt-text font-bold font-youtube text-base mb-1">
          Subscriptions
        </h3>
        <SubscriptionItem name="Theo - t3.gg" color="bg-pink-500" hasNew />
        <SubscriptionItem name="100x Engineers" color="bg-red-500" />
        <SubscriptionItem name="Labour Law Advisor" color="bg-red-700" hasNew />
        <SubscriptionItem name="Shark Tank India" color="bg-green-600" hasNew />
        
        <div className="flex items-center gap-4 px-3 py-2 text-yt-text hover:bg-yt-surface-hover rounded-xl cursor-pointer transition-colors mt-2">
           <ChevronDown className="w-5 h-5" />
           <span className="text-sm font-youtube">Show more</span>
        </div>
      </div>
    </aside>
  )
}

const SidebarItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean }> = ({ icon, label, active }) => {
  return (
    <div className={`flex xl:flex-row flex-col items-center xl:justify-start justify-center gap-1 xl:gap-4 px-0 xl:px-3 py-4 xl:py-2.5 rounded-xl cursor-pointer transition-colors ${active ? 'bg-[#272727] hover:bg-[#3f3f3f]' : 'hover:bg-[#272727]'}`}>
      <div className={`w-6 h-6 flex-shrink-0 flex items-center justify-center ${active ? 'text-white' : 'text-[#f1f1f1]'}`}>
        {icon}
      </div>
      <span className={`text-[10px] xl:text-[14px] font-youtube truncate ${active ? 'font-medium text-white' : 'text-[#f1f1f1]'}`}>
        {label}
      </span>
    </div>
  )
}

const SubscriptionItem: React.FC<{ name: string; color: string; hasNew?: boolean }> = ({ name, color, hasNew }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 hover:bg-yt-surface rounded-xl cursor-pointer transition-colors">
      <div className="flex items-center gap-4 truncate">
        <div className={`w-6 h-6 rounded-full flex-shrink-0 ${color}`} />
        <span className="text-sm text-yt-text font-youtube truncate">{name}</span>
      </div>
      {hasNew && <div className="w-1 h-1 bg-yt-blue rounded-full flex-shrink-0" />}
    </div>
  )
}
