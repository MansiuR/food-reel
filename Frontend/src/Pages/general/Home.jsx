import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import UserProfile  from '../general/UserProfile'
import UserLogin from '../auth/UserLogin';

const Home = () => {
    const [ videos, setVideos ] = useState([])
    // Autoplay behavior is handled inside ReelFeed
    const [ currentUser, setCurrentUser ] = useState(null) //to hold the currently logged-in user

    useEffect(() => {
        axios.get("https://food-reel-mng5.onrender.com/api/auth/user/login", { withCredentials: true })
            .then(response => {
                
                console.log(response.data);
                const mappedVideos = response.data.foodItems.map(video => ({
                    ...video,
                    isLiked: video.isLiked || false, 
                    isSaved: video.isSaved || false
                }));

                setVideos(mappedVideos)
            })
            .catch(() => { /* noop: optionally handle error */ })
            const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {

        const response = await axios.post("https://food-reel-mng5.onrender.com/api/food/like", { foodId: item._id }, {withCredentials: true})

        if(response.data.like === true){
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1, isLiked: true } : v))
        } else if(response.data.like === false){
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1, isLiked: false } : v))
        }
        
    }

    async function saveVideo(item) {
        const response = await axios.post("https://food-reel-mng5.onrender.com/api/food/save", { foodId: item._id }, { withCredentials: true })
        
        if(response.data.save === true){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1, isSaved: true } : v))
        } else if(response.data.save === false){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1, isSaved: false } : v))
        }
    }

    return (
        <div className="relative w-full h-screen bg-black overflow-y-auto snap-y snap-mandatory">
            
            {/* 5. Render the Profile widget and pass it the user data */}
            <UserProfile user={currentUser} />

            <ReelFeed
                items={UserLogin}
                onLike={likeVideo}
                onSave={saveVideo}
                emptyMessage="No videos available."
            />
        </div>
    )
}

export default Home