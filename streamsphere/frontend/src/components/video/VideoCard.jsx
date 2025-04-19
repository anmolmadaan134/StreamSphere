import {Link} from 'react-router-dom'
import { formatRelativeTime, formatViewCount } from '../../utils/helper';

const VideoCard = ({video})=>{
    //Destructure video properties

    const{
        _id,
        title = 'Video Title',
        thumbnailUrl = 'https://via.placeholder.com/320x180',
        user = {username:'username'},
        views=0,
        createdAt=new Date().toISOString(),
        duration=0
    } = video || {}


    return (
        <div>
            <Link to={`/video/${_id}`} className='block'>
            <div className='relative'>
                <img src={thumbnailUrl} alt={title}  />

                {/* Video duration badge */}
                <div>
                    {Math.floor(duration/60)}:{(duration%60).toString().padStart(2,'0')}
                </div>
            </div>
            </Link>

        <div>
            <div>
                <div>
                    {user.profileImage ? (
                         <img 
                         src={user.profileImage} 
                         alt={user.username} 
                         className="w-9 h-9 rounded-full" 
                       />
                    ):(
                        <span className="text-sm font-semibold">
                        {user.username?.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
            </div>

            <div>
            <Link to={`/video/${_id}`} className='block'>
            <h3>{title}</h3></Link>

            <Link to={`/channel/${user._id}`} className='mt-1 block'>
            <p>
                {user.username}
            </p>
            </Link>

            <div>
                <span>{formatViewCount(views)} views</span>
                <span className='mx-1'>.</span>
                <span>{formatRelativeTime(createdAt)}</span>
            </div>
            </div>
        </div>

        </div>
    )

}

export default VideoCard;