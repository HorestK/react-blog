import Post from "../components/Post.jsx";
import {usePostStore} from "../Store/postStore.js";
import {useEffect} from "react";
import {useParams, useNavigate, generatePath, Link} from "react-router-dom";
import {ROUTES} from "../routes/Routes.js";

export default function Show() {
    const {post, getPost, deletePost} = usePostStore()
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        getPost(id)
    }, []);

    return (
        <div className='mb-20'>
            <Post key={id} post={post}/>
            <div className='flex gap-x-6'>
                <button
                    className='cursor-pointer px-4 py-2 bg-sky-600 text-white'
                    onClick={() => navigate(ROUTES.POST_INDEX)}
                >
                    Back
                </button>
                <Link
                    to={generatePath(ROUTES.POST_EDIT, {id: id})}
                    className='px-4 py-2 bg-sky-600 text-white'
                >
                    Edit
                </Link>
                <button
                    className='cursor-pointer px-4 py-2 bg-red-600 text-white'
                    onClick={() => deletePost(id)}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}