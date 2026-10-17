import {createPortal} from 'react-dom'
import {useState} from "react";

export default function PhotoView({previewURL, isBgClicked, setIsBgClicked}){
    // const [isBgClicked, setIsBgClicked] = useState(false)

    const closeImageView = () => {
        if(isBgClicked) setIsBgClicked(false)
        console.log('clicked')
    }

    return isBgClicked && createPortal(
        <div className='w-full h-full flex justify-center items-center absolute top-0 left-0'>
            <img src={previewURL}
                 className='w-[75%] h-[35%] opacity-100 z-50'
            ></img>
            <div
                className='w-full h-full bg-black opacity-50 absolute top-0 left-0'
                onClick={() => {closeImageView()}}
            >

            </div>
        </div>
        , document.body)
}