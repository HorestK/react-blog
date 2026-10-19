import {useEffect, useState} from "react";
import {useCommentStore} from "../../store/commentStore.js";
import {useSearchParams} from "react-router-dom";
import {useUserStore} from "../../store/userStore.js";
import {useSubCommentStore} from "../../store/subcommentStore.js";

export default function SubcommentItem({subComment, commentId, subcommentsCount, setSubcommentsCount, page, setPage}) {
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
    } = useCommentStore()
    const {user} = useUserStore()
    const [searchParams, setSearchParams] = useSearchParams()

    const {
        subCommentsMeta,
        setReactionSubComment,
        deleteSubComment,
        updateSubComment,
        subcomments,
        setSubCommentsMeta
    } = useSubCommentStore()

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
                    if (confirm('Are you sure about it?')) {
                        setSubcommentsCount(subcommentsCount - 1)
                        await deleteSubComment(commentId, subComment.id)
                    }

                    console.log(subcomments.length);

                    if (subcomments.length <= 1 && page > 1) {
                        setPage(page - 1)
                        setSubCommentsMeta({...subCommentsMeta, ['last_page']: subCommentsMeta.last_page - 1})
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