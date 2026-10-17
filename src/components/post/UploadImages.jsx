import {useEffect, useState, useRef} from "react";
import PhotoView from "../ui/PhotoView.jsx";
import {usePostStore} from "../../Store/postStore.js";
import {useUserStore} from "../../Store/userStore.js";

export default function UploadImages({isAvatar = false, currentAvatar = null, imageInputRef}){
    const [photoIsClicked, setPhotoIsClicked] = useState(false)
    const {
        handlePhoto,
        previewURL
    } = usePostStore()
    const {
        handleAvatar,
        previewURLAvatar
    } = useUserStore()

    const [picture, setPicture] = useState(currentAvatar ? currentAvatar : (isAvatar ? previewURLAvatar : previewURL))

    return (
        <div className=''>
            <div className='w-full mb-3'>
                <label className='bg-sky-600 text-white p-2 cursor-pointer'>
                    Choose {isAvatar ? 'Avatar' : 'Photo'}
                    <input type='file'
                           className='hidden'
                           name='image'
                           id='user_avatar'
                           ref={imageInputRef}
                           onChange={(e) => {
                               if(!isAvatar) handlePhoto(e, setPicture)
                               handleAvatar(e, setPicture)
                           }}
                    />
                </label>
            </div>


            {(picture || currentAvatar) && <img src={picture}
                 className='w-[125px] h-[75px] border-4 border-gray-600 rounded-[10%] mt-4 mb-2'
                 onClick={()=>{
                     setPhotoIsClicked(true)
                 }}
            >
            </img>}
            {photoIsClicked && <PhotoView previewURL={picture}
                                          isBgClicked={photoIsClicked}
                                          setIsBgClicked={setPhotoIsClicked}
            />}
        </div>
    )
}