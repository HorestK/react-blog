import {useEffect, useState} from "react";
import {useCommentStore} from "../Store/commentStore.js";
import {Link, useSearchParams} from "react-router-dom";
import SubcommentItem from "./SubcommentItem.jsx";
import {useUserStore} from "../Store/userStore.js";
import {useSubCommentStore} from "../Store/subcommentStore.js";
import axios from "../axios.js";

export default function CommentItem({newComment, postId}){
    const [isEdit, setIsEdit] = useState(false)
    const subCommentsLength = newComment.subcommentsCount ?? 0
    // const [comment, setComment] = useState({
    //     content: ''
    // })

    // const handleComment = async (e) => {
    //     const name = e.target.name
    //     const value = e.target.value
    //
    //     setComment({...comment, [name]: value})
    // }

    const {
        updateComment,
        deleteComment,
        comments,
        setCommentsMeta,
        commentsMeta,
        handleComment,
        setComment,
        comment,
        setReactionComment,
        setComments,
        isOpenedReplies,
        toggleReplies,
        openedCommentId
    } = useCommentStore()

    const {
        getSubComments,
        subcomments,
        setSubComments,
        subCommentsMeta,
        storeSubComment,
        subcomment,
        handleSubComment,
        setSubCommentsMeta
    } = useSubCommentStore()

    // const [subcomment, setSubcomment] = useState({
    //     author: '',
    //     content: '',
    //     likes: null,
    //     dislikes: null,
    //     can: {
    //         update: false,
    //         delete: false
    //     }
    // },)

    const {user} = useUserStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const page = +searchParams.get('page') || 1
    const previousPageFromParam = searchParams.get('previous_page') || 1
    // const subCommentPage = +searchParams.get('subcomment_page') || 1
    const [subCommentPage, setSubCommentPage] = useState(1)

    const [subcommentsCount, setSubcommentsCount] = useState(newComment.subcommentsCount)

    let nextPage = new URLSearchParams(searchParams)
    nextPage.set('subcomment_page', (subCommentPage + 1))
    let previousPage = new URLSearchParams(searchParams)
    previousPage.set('subcomment_page', (subCommentPage - 1))

    const [isRepliedMode, setIsRepliedMode] = useState(false)

    useEffect(() => {
        if(isOpenedReplies(newComment.id)) getSubComments(newComment.id, subCommentPage)
    }, [subCommentPage, isOpenedReplies(newComment.id)]);

    useEffect(() => {
        if(!isOpenedReplies(newComment.id)){
            setSubComments([])
            setSubCommentPage(1)
        }
    }, [isOpenedReplies(newComment.id)]);

    return <div className='border border-gray-400 px-4 py-2 mb-3 relative'>
        {(newComment?.can?.update ?? false) &&
            <button
                className='px-2 py-1 bg-sky-600 text-white absolute right-23'
                onClick={() => {
                    setComment({
                        content: newComment.content //При нажатии на Edit сверху форма заполняется(напишем его личный handle)
                    })
                    console.log('edit')
                    if (!isEdit) setIsEdit(true)
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
                    if (confirm('Are you sure about it?')) await deleteComment(newComment.id)

                    if (comments.length <= 1 && page > 1) {
                        searchParams.set('page', (page - 1))
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
            : <p className='mb-3'>{newComment.content}</p>
        }
        <button
            className='cursor-pointer px-2 py-1 bg-sky-600 text-white relative left-[87%] mb-3'
            onClick={async () => {
                console.log(isRepliedMode)
                if (isRepliedMode) setIsRepliedMode(false)
                else setIsRepliedMode(true)
            }}
        >
            Reply
        </button>
        <div className='flex gap-10'>
            <div>
                <button className='text-2xl'
                        name='like'
                        onClick={(e) => {
                            if (user.id !== '') setReactionComment(e, newComment)
                            else alert("You aren't logged. Please login")
                        }}>👍 {newComment.likes}</button>
            </div>
            <div>
                <button className='text-2xl'
                        name='dislike'
                        onClick={(e) => {
                            if (user.id !== '') setReactionComment(e, newComment)
                            else alert("You aren't logged. Please login")
                        }}>👎 {newComment.dislikes}</button>
            </div>
        </div>
        {isRepliedMode && <form className='mb-3'
                                onSubmit={(e) => {
                                    storeSubComment(e, postId, newComment.id)
                                    setSubcommentsCount(subcommentsCount + 1)

                                    // if(subcomments.length < subCommentsMeta.last_page) setSubCommentPage(subCommentPage + 1)

                                    setIsRepliedMode(false)
                                }}>
            <textarea placeholder='Text'
                      name='content'
                      className='border border-gray-300 rounded-xl w-1/1 p-2 mb-3 mt-2'
                      onChange={(e) => {
                          handleSubComment(e)
                      }}
                      value={subcomment.content}
            >
            </textarea>
            <input type='submit'
                   className='cursor-pointer px-4 py-2 bg-sky-600 text-white'
                   value='Send'
            />
        </form>}
        {subcommentsCount > 0 && (<>
                <br/>
                <button className='mb-3 font-bold text-xl text-gray-400'
                        onClick={() => {
                            if (isOpenedReplies(newComment.id)) {
                                toggleReplies(false, newComment.id)
                                setSubComments([])
                            } else {
                                getSubComments(newComment.id, subCommentPage)
                                toggleReplies(true, newComment.id)
                            }
                        }}
                >Replies({subcommentsCount})
                </button>
            </>
        )}
        <div className='ml-10'>
            {isOpenedReplies(newComment.id) && subcomments.map((sc) => (
                <SubcommentItem key={sc.id}
                                subComment={sc}
                                commentId={newComment.id}
                                subcommentsCount={subcommentsCount}
                                setSubcommentsCount={setSubcommentsCount}
                                page={subCommentPage}
                                setPage={setSubCommentPage}
                />
            ))}
        </div>
        {isOpenedReplies(newComment.id) && <div className='bg-gray-100 flex items-center h-10 mx-5'>
            {subCommentPage > 1 && (
                <button className='cursor-pointer px-4 py-2 bg-blue-600 text-white absolute left-5'
                      onClick={() => {
                          setSubCommentPage(subCommentPage - 1)
                      }}

                >
                    &lt;
                </button>
            )}
            <div className='w-[5%] flex items-center absolute left-[45%]'>
                <div className='bg-white h-5 p-3 flex items-center'>
                    {subCommentPage + `/${subCommentsMeta.last_page}`}
                </div>
            </div>
            {subCommentPage < subCommentsMeta.last_page && (
                <button className='cursor-pointer px-4 py-2 bg-blue-600 text-white absolute right-5'
                      onClick={() => { setSubCommentPage(subCommentPage + 1) }}

                >
                    &gt;
                </button>
            )}
        </div>}
    </div>
}