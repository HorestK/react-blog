import {useEffect, useState} from "react";
import {useCommentStore} from "../Store/commentStore.js";
import {useSearchParams} from "react-router-dom";

export default function CommentItem({newComment}){
    const [isEdit, setIsEdit] = useState(false)
    const [comment, setComment] = useState({
        content: ''
    })

    const handleComment = async (e) => {
        const name = e.target.name
        const value = e.target.value

        setComment({...comment, [name]: value})
    }

    const {
        updateComment,
        deleteComment,
        comments,
        setCommentsMeta,
        commentsMeta
    } = useCommentStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const page = +searchParams.get('page')

    useEffect(() => {
        // setComment({
        //     content: newComment.content
        // })
    }, []); //Переработать логику

    return <div className='border border-gray-400 px-4 py-2 mb-3 relative'>
        {(newComment?.can?.update ?? false) &&
            <button
                className='px-2 py-1 bg-sky-600 text-white absolute right-23'
                onClick={() => {
                    setComment({
                        content: newComment.content //При нажатии на Edit сверху форма заполняется(напишем его личный handle)
                    })
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
                onClick={async () => {
                    console.log('delete')
                    if( confirm('Are you sure about it?') ) await deleteComment(newComment.id)

                    if(comments.length <= 1 && page > 1) {
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
                updateComment(e, newComment.id, comment.content)
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