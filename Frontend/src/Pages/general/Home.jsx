import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'
import UserProfile  from '../general/UserProfile'
import UserLogin from '../auth/UserLogin';

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const [ currentUser, setCurrentUser ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        console.log("Saved user from localStorage:", savedUser);
        
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                console.log("Parsed user:", parsedUser);
                setCurrentUser(parsedUser);
                
                // Fetch videos if user is logged in
                axios.get("https://food-reel-mng5.onrender.com/api/food", { withCredentials: true })
                    .then(response => {
                        console.log("Videos fetched:", response.data);
                        const mappedVideos = response.data.foodItems.map(video => ({
                            ...video,
                            isLiked: video.isLiked || false, 
                            isSaved: video.isSaved || false
                        }));
                        setVideos(mappedVideos);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error fetching videos:", error);
                        setIsLoading(false);
                    })
            } catch (error) {
                console.error("Error parsing user:", error);
                localStorage.removeItem('user');
                setIsLoading(false);
            }
        } else {
            console.log("No user found - showing login");
            setIsLoading(false);
        }
    }, [])

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

    // Show loading state
    if (isLoading) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center">
                <p className="text-white text-lg">Loading...</p>
            </div>
        )
    }

    // If user not logged in, show login page
    if (!currentUser) {
        console.log("Rendering UserLogin - currentUser is null");
        return <UserLogin />
    }

    return (
        <div className="relative w-full h-screen bg-black overflow-y-auto snap-y snap-mandatory">
            <UserProfile user={currentUser} />
            <ReelFeed
                items={videos}
                onLike={likeVideo}
                onSave={saveVideo}
                emptyMessage="No videos available."
            />
        </div>
    )
}

export default Home