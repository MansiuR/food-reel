import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Reusable feed for vertical reels
// Props:
// - items: Array of video items { _id, video, description, likeCount, savesCount, commentsCount, comments, foodPartner }
// - onLike: (item) => void | Promise<void>
// - onSave: (item) => void | Promise<void>
// - emptyMessage: string
const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.' }) => {
  const videoRefs = useRef(new Map())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => { /* ignore autoplay errors */ })
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    //how are you playing each video tellme, type here: nin questio ehh aratha agilla user vid post madatane adu home page ge barutte aste , henge barutte?

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }

  return (
    <div className="w-full h-full bg-black">
      <div role="list" className="w-full">
        {items.length === 0 && (
          <div className="empty-state h-screen flex items-center justify-center">
            <p className="text-white text-lg">{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => (
          <section className='h-screen w-full flex items-center justify-center relative snap-start bg-black' key={item._id} role="listitem">
            {/* Video Container - Centered */}
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              <video
                ref={setVideoRef(item._id)}
                src={item.video}
                muted
                playsInline
                loop
                preload="metadata"
                className="w-full h-full object-cover rounded-lg"
                style={{ aspectRatio: '9/16' }}
              />
            </div>

            {/* Action Buttons - Right Side */}
            <div className="absolute right-6 bottom-24 flex flex-col gap-8">
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onLike ? () => onLike(item) : undefined}
                  className="cursor-pointer transition-transform hover:scale-110 active:scale-95 p-3 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20"
                  aria-label="Like"
                >
                  <svg
                    width="28" 
                    height="28"
                    viewBox="0 0 24 24"
                    fill={item.isLiked ? "#F2AC29" : "none"} 
                    stroke={item.isLiked ? "#F2AC29" : "white"} 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                </button>
                <span className="text-white text-sm font-semibold">{item.likeCount ?? item.likesCount ?? item.likes ?? 0}</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={onSave ? () => onSave(item) : undefined}
                  className="cursor-pointer transition-transform hover:scale-110 active:scale-95 p-3 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20"
                  aria-label="Save"
                >
                  <svg 
                    width="28"
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill={item.isSaved ? "white" : "none"}           
                    stroke={item.isSaved ? "white" : "white"}
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                  </svg>
                </button>
                <span className="text-white text-sm font-semibold">{item.savesCount ?? item.bookmarks ?? item.saves ?? 0}</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <button 
                  className="cursor-pointer transition-transform hover:scale-110 active:scale-95 p-3 bg-white/10 rounded-full backdrop-blur-sm hover:bg-white/20"
                  aria-label="Comments"
                >
                  <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  </svg>
                </button>
                <span className="text-white text-sm font-semibold">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</span>
              </div>
            </div>

            {/* Description & Store Link - Bottom Left */}
            <div className="absolute bottom-20 left-6 max-w-xs z-10">
              <p className="text-white text-sm mb-3 line-clamp-2" title={item.description}>
                {item.description}
              </p>
              {item.foodPartner && (
                <Link 
                  className="text-yellow-400  text-sm font-semibold hover:text-yellow-300 transition-colors flex items-center gap-1" 
                  to={"/food-partner/" + item.foodPartner} 
                  aria-label="Visit store"
                >
                  👉 Visit store
                </Link>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default ReelFeed