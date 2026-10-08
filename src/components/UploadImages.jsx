import {useEffect, useState, useRef} from "react";
import PhotoView from "./PhotoView.jsx";
import {usePostStore} from "../Store/postStore.js";
import {useUserStore} from "../Store/userStore.js";

export default function UploadImages({isAvatar = false, currentAvatar = null, imageInputRef}){
    // const [previewURL, setPreviewURL] = useState()
    // const [selectedPhoto, setSelectedPhoto] = useState()
    const [photoIsClicked, setPhotoIsClicked] = useState(false)
    const {
        handlePhoto,
        previewURL
    } = usePostStore()
    const {
        handleAvatar,
        previewURLAvatar
    } = useUserStore()
    //
    // const handlePhoto = (e) => {
    //     const file = e.target.files[0]
    //     setSelectedPhoto(file)
    //
    //     const photoURL = URL.createObjectURL(file)
    //     setPreviewURL(photoURL)
    //     console.log(file);
    // }

    const [picture, setPicture] = useState(currentAvatar ? currentAvatar : (isAvatar ? previewURLAvatar : previewURL))

    useEffect(() => {
        console.log(currentAvatar);
    }, []);

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
                     console.log('photo')
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