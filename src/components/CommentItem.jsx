import {useEffect, useState} from "react";
import {useCommentStore} from "../Store/commentStore.js";
import {useSearchParams} from "react-router-dom";

export default function CommentItem({newComment}){
    const [isEdit, setIsEdit] = useState(false)
    const {
        handleComment,
        updateComment,
        deleteComment,
        comment,
        comments,
        setComment
    } = useCommentStore()
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        setComment({
            content: newComment.content
        })
    }, []);

    return <div className='border border-gray-400 px-4 py-2 mb-3 relative'>
        {(newComment?.can?.update ?? false) &&
            <button
                className='px-2 py-1 bg-sky-600 text-white absolute right-23'
                onClick={() => {
                    console.log('edit')
                    if(!isEdit) setIsEdit(true)
                    else setIsEdit(false)
                }}
            >
                Edit
            </button>
        }
        {(newComment?.can?.delete ?? false) &&
            <button
                className='cursor-pointer px-2 py-1 bg-red-600 text-white absolute right-3'
                onClick={() => {
                    console.log('delete')
                    if( confirm('Are you sure about it?') ) deleteComment(newComment.id)
                    if(comments.length <= 1) {
                        const page = +searchParams.get('page')
                        searchParams.set('page', (page - 1) )
                        setSearchParams(searchParams)
                    }
                }}
            >
                Delete
            </button>
        }
        <h1 className='mb-2 text-xl bold'>{newComment.author}</h1>
        {isEdit ? <form onSubmit={(e) => {
                updateComment(e, newComment.id)
                setIsEdit(false)
            }}>
            <textarea placeholder='Text'
                      name='content'
                      className='border border-gray-300 rounded-xl w-1/1 p-2 mb-3 mt-2'
                      onChange={(e) => {
                          handleComment(e)
                      }}
                      value={comment.content}
            >
            </textarea>
            <input type='submit'
                   className='cursor-pointer px-4 py-2 bg-sky-600 text-white'
                   value='Update'
            />
        </form>
            : <p>{newComment.content}</p>
        }
    </div>
}