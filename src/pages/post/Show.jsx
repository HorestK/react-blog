import Post from "../../components/Post.jsx";
import {usePostStore} from "../../Store/postStore.js";
import {useEffect, useState} from "react";
import {useParams, useNavigate, generatePath, Link} from "react-router-dom";
import {ROUTES} from "../../routes/Routes.js";
import {useUserStore} from "../../Store/userStore.js";
import PageNotFoundError from "../../components/PageNotFoundError.jsx";

export default function Show() {
    const {post, getPost, deletePost} = usePostStore()
    const {id} = useParams()
    const {setUser, user} = useUserStore()
    const navigate = useNavigate()
    const [Error, setError] = useState(false)

    useEffect(() => {
        const load = async() => {
            try{
                await getPost(id)
                console.log(user);

            }catch (error){
                setError(true)
            }
        }
        load()
    }, [Error]);

    return Error ? <PageNotFoundError/> : (
        <div className='mb-20 lg:w-1/2 lg:mx-auto relative'>
            <Post key={id} post={post}/>
            <div className='flex w-full relative'>
                <a
                    className='cursor-pointer px-4 py-2 bg-sky-600 text-white absolute right-0'
                    onClick={() => navigate(ROUTES.POST_INDEX)}
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
        </div>
    )
}