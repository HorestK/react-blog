import {usePostStore} from "../../Store/postStore.js";
import {useEffect, useState} from "react";
import Post from "../../components/Post.jsx";
import {generatePath, Link, useSearchParams} from "react-router-dom";
import {ROUTES} from "../../routes/Routes.js";
import ServerError from "../../components/ServerError.jsx";
import PostsNotFound from "../../components/PostsNotFound.jsx";

export default function Index() {
    const {posts, getPosts, postsMeta} = usePostStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const page = +searchParams.get('page') || 1
    const [Error, setError] = useState(false)

    let nextParams = new URLSearchParams(searchParams)
    nextParams.set('page', (+page + 1))

    let previousParams = new URLSearchParams(searchParams)
    previousParams.set('page', (+page - 1))


    useEffect( () => {
        const load = async () => {
            try {
                await getPosts(setError, searchParams)
            }catch (error){
                setError(true)
            }
        }
        load()
    }, [searchParams.toString()]);

    return Error ? <ServerError setError={setError}/>
        : posts.length === 0
        ? <PostsNotFound/>
        : (
        <>
            <div className='mb-20 lg:mb-5'>
                {posts.map((p) => (
                    <Link key={p.id}
                          className='lg:w-1/2 lg:mx-auto lg:block'
                          to={generatePath(ROUTES.POST_SHOW, {id: p.id}) + `?previous_page=${page}`}>
                        <Post post={p}/>
                    </Link>
                ))}
            </div>
            <footer className='bg-gray-500 min-h-20 fixed left-0 bottom-0 w-1/1 lg:relative lg:flex lg:justify-center lg:gap-x-[50%]'>
                {page > 1 &&
                    <Link to={'?' + previousParams}
                          className='absolute left-[5%] lg:left-[35%] bottom-2'>
                        <span className='text-white text-7xl'>&lt;</span>
                    </Link>
                }
                <div className='w-[5%] flex items-center absolute left-[45%] bottom-7'>
                    <div className='bg-white h-5 p-3 flex items-center'>
                        {page + `/${postsMeta.lastPage}`}
                    </div>
                </div>
                {page < postsMeta.lastPage &&
                    <Link to={'?' + nextParams}
                          className='absolute right-[5%] lg:right-[40%] bottom-2'>
                        <span className='text-white text-7xl'>&gt;</span>
                    </Link>
                }
            </footer>
        </>
    )
}