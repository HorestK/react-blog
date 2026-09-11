import {generatePath, Link} from "react-router-dom";
import {ROUTES} from "../routes/Routes.js";

export default function CommentItem({comment}){
    return <div className='border border-gray-400 px-4 py-2 mb-3 relative'>
        {(comment?.can?.update ?? false) &&
            <button
                className='px-2 py-1 bg-sky-600 text-white absolute right-23'
                onClick={() => {console.log('edit')}}
            >
                Edit
            </button>
        }
        {(comment?.can?.delete ?? false) &&
            <button
                className='cursor-pointer px-2 py-1 bg-red-600 text-white absolute right-3'
                onClick={() => {console.log('delete')}}
            >
                Delete
            </button>
        }
        <h1 className='mb-2 text-xl bold'>{comment.author}</h1>
        <p>{comment.content}</p>
    </div>
}