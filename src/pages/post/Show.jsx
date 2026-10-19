import Post from "../../components/post/PostItem.jsx";
import {usePostStore} from "../../store/postStore.js";
import {useEffect, useState} from "react";
import {useParams, useNavigate, generatePath, Link, useSearchParams} from "react-router-dom";
import {ROUTES} from "../../routes/Routes.js";
import {useUserStore} from "../../store/userStore.js";
import PageNotFoundError from "../../components/feedback/PageNotFoundError.jsx";
import {useCommentStore} from "../../store/commentStore.js";
import CommentItem from "../../components/comment/CommentItem.jsx";

export default function Show() {
    const {post, getPost, deletePost} = usePostStore()
    const {id} = useParams()
    const {user} = useUserStore()
    const navigate = useNavigate()
    const [Error, setError] = useState(false)
    const {
        getComments,
        comments,
        commentsMeta,
        handleComment,
        storeComment,
        setComments,
        setCommentsMeta,
        setComment,
        comment
    } = useCommentStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const previousPageFromParam = searchParams.get('previous_page') || 1
    const page = +searchParams.get('page') || 1

    let nextPage = new URLSearchParams(searchParams)
    nextPage.set('page', (page + 1))
    let previousPage = new URLSearchParams(searchParams)
    previousPage.set('page', (page - 1))

    useEffect(() => {
        const load = async () => {
            try {
                await getPost(id)
            } catch (error) {
                setError(true)
            }
        }
        load()
    }, []);

    useEffect(() => {
        const load = async () => {
            setComment({
                content: ''
            })

            try {
                await getComments(id, page)
            } catch (error) {
                setError(true)
            }
        }
        load()
    }, [Error, searchParams.toString()]);

    return Error ? <PageNotFoundError/> : (
        <div className='mb-20 lg:w-1/2 lg:mx-auto relative'>
            <Post key={id} post={post}/>
            <div className='flex w-full relative mb-12'>
                <a
                    className='cursor-pointer px-4 py-2 bg-sky-600 text-white absolute right-0'
                    onClick={() => navigate(ROUTES.POST_INDEX + `?page=${previousPageFromParam}`)}
                >
                    Back
                </a>
                {(post?.can?.update ?? false) &&
                    <Link
                        to={generatePath(ROUTES.POST_EDIT, {id: id})}
                        className='px-4 py-2 bg-sky-600 text-white absolute left-0'
                    >
                        Edit
                    </Link>
                }
                {(post?.can?.delete ?? false) &&
                    <button
                        className='cursor-pointer px-4 py-2 bg-red-600 text-white absolute left-30'
                        onClick={() => deletePost(id, setError)}
                    >
                        Delete
                    </button>
                }
            </div>
            <div className='mb-4'>
                <h1 className='text-2xl font-bold mb-3'>Comments</h1>
                {user.can.sendComment && <form className='mb-8'
                      onSubmit={(e) => {storeComment(e, id)}}
                >
                    <textarea placeholder='Text'
                              name='content'
                              className='border border-gray-300 rounded-xl w-1/1 p-2 mb-3'
                              onChange={(e) => {
                                  handleComment(e)
                              }}
                              value={comment.content}
                    />
                    <input type='submit'
                           className='bg-sky-600 text-white p-2 cursor-pointer'
                           value='Send'/>
                </form>
                }
                {comments.map((c) => (
                    <CommentItem key={c.id}
                                 newComment={c}
                                 postId={id}
                    />
                ))}
            </div>
            {comments.length !== 0 ?
            <div className='bg-gray-100 flex items-center h-10'>
                {page > 1 && (
                    <Link className='cursor-pointer px-4 py-2 bg-blue-600 text-white absolute left-0'
                          to={'?' + previousPage}
                    >
                        &lt;
                    </Link>
                )}
                 <div className='w-[5%] flex items-center absolute left-[45%]'>
                    <div className='bg-white h-5 p-3 flex items-center'>
                        {page + `/${commentsMeta.lastPage}`}
                    </div>
                </div>
                {page < commentsMeta.lastPage && (
                    <Link className='cursor-pointer px-4 py-2 bg-blue-600 text-white absolute right-0'
                          to={'?' + nextPage}
                    >
                        &gt;
                    </Link>
                )}
            </div>
                : <div className='w-full text-center mt-10'>
                    <h1 className='text-xl inline-block'>There are no comments yet</h1>
                </div>
            }
        </div>
    )
}