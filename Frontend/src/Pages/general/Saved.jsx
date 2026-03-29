import React, { useEffect, useState } from 'react'
import '../../styles/reels.css'
import axios from 'axios'

const Saved = () => {
    const [videos, setVideos] = useState([])
    const [selectedVideo, setSelectedVideo] = useState(null) // 🔥 for popup

    useEffect(() => {
        axios.get("http://localhost:3000/api/food/get-saved-videos", { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                    foodPartner: item.food.foodPartner,
                    thumbnail: item.food.thumbnail,
                    name: item.food.name
                }))
                setVideos(savedFoods)
            })
            .catch(err => console.error("Error fetching saved videos:", err))
    }, [])

    // ✅ Play video (open popup)
    const playVideo = (video) => {
        setSelectedVideo(video)
    }

    // ✅ Close popup
    const closePopup = () => {
        setSelectedVideo(null)
    }

    // Placeholder thumbnail - gray background with play icon
    const PlaceholderThumbnail = () => (
        <div style={{
            width: '200px',
            height: '200px',
            backgroundColor: '#333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: '#999'
        }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        </div>
    )

    return (
        
        <div style={{ padding: '20px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Saved Videos</h1>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#aaa' }}>Total: {videos.length}</h2>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px',
                padding: '20px'
            }}>
                {videos.map(v => (
                    <div 
                        key={v._id} 
                        onClick={() => playVideo(v)}
                        style={{
                            cursor: 'pointer',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'transform 0.2s',
                            backgroundColor: '#111'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        {v.thumbnail ? (
                            <img 
                                height={200} 
                                width={200}
                                style={{ 
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '200px'
                                }}
                                src={v.thumbnail} 
                                alt={v.name || "thumbnail"}
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextElementSibling.style.display = 'flex'
                                }}
                            />
                        ) : null}
                        <div 
                            style={{
                                display: v.thumbnail ? 'none' : 'flex',
                                width: '100%',
                                height: '200px',
                                backgroundColor: '#333',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#999'
                            }}
                        >
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        </div>
                        <div style={{ padding: '10px', backgroundColor: '#1a1a1a', minHeight: '50px' }}>
                            <p style={{ margin: '0', fontSize: '14px', color: '#fff', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {v.name || 'Untitled'}
                            </p>
                            <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#aaa' }}>
                                ❤️ {v.likeCount} • 💾 {v.savesCount}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔥 POPUP MODAL */}
            {selectedVideo && (
                <div className="video-popup">
                    
                    {/* ❌ Close Button */}
                    <span className="close-btn" onClick={closePopup}>✖</span>

                    {/* 🎥 Video Player */}
                    <video
                        src={selectedVideo.video}
                        controls
                        autoPlay
                        className="popup-video"
                    />
                </div>
            )}
        </div>
    )
}

export default Saved