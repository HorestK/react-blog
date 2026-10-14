import {useState} from "react";
import {useCommentStore} from "../Store/commentStore.js";
import {useSearchParams} from "react-router-dom";
import {useUserStore} from "../Store/userStore.js";

export default function SubcommentItem({subComment, commentId}) {
    const [isEdit, setIsEdit] = useState(false)
    const {
        updateComment,
        deleteComment,
        comments,
        setCommentsMeta,
        commentsMeta,
        storeSubComment,
        handleComment,
        setComment,
        comment,
        updateSubComment,
        deleteSubComment,
        setReactionSubComment
    } = useCommentStore()
    const {user} = useUserStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const page = +searchParams.get('page')

    return <div className='border border-gray-400 px-4 py-2 mb-3 relative'>
        {(subComment?.can?.update ?? false) &&
            <button
                className='px-2 py-1 bg-sky-600 text-white absolute right-23'
                onClick={() => {
                    setComment({
                        content: subComment.content //При нажатии на Edit сверху форма заполняется(напишем его личный handle)
                    })
                    console.log('edit')
                    if (!isEdit) setIsEdit(true)
                    else setIsEdit(false)
                }}
            >
                Edit
            </button>
        }
        {(subComment?.can?.delete ?? false) &&
            <button
                className='cursor-pointer px-2 py-1 bg-red-600 text-white absolute right-3'
                onClick={async () => {
                    console.log('delete')
                    if (confirm('Are you sure about it?')) await deleteSubComment(commentId, subComment.id)

                    if (comments.length <= 1 && page > 1) {
                        searchParams.set('page', (page - 1))
                        setSearchParams(searchParams)
                    }
                }}
            >
                Delete
            </button>
        }
        <h1 className='mb-2 text-xl bold'>{subComment.author}</h1>
        {isEdit ? <form onSubmit={(e) => {
                updateSubComment(e, subComment.id, comment.content, commentId)
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
            : <>
                <p className='mb-3'>{subComment.content}</p>
                <div className='flex gap-10'>
                    <div>
                        <button className='text-2xl'
                                name='like'
                                onClick={(e) => {
                                    if (user.id !== '') setReactionSubComment(e, subComment, commentId)
                                    else alert("You aren't logged. Please login")
                                }}>👍 {subComment.likes}</button>
                    </div>
                    <div>
                        <button className='text-2xl'
                                name='dislike'
                                onClick={(e) => {
                                    if (user.id !== '') setReactionSubComment(e, subComment, commentId)
                                    else alert("You aren't logged. Please login")
                                }}>👎 {subComment.dislikes}</button>
                    </div>
                </div>
            </>
        }
    </div>
}