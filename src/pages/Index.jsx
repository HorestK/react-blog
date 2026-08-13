import {usePostStore} from "../Store/postStore.js";
import {useEffect, useState} from "react";
import Post from "../components/Post.jsx";
import {generatePath, Link, useSearchParams} from "react-router-dom";
import {ROUTES} from "../routes/Routes.js";

export default function Index() {
    const {posts, getPosts, postsMeta} = usePostStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const page = +searchParams.get('page') || 1

    useEffect(() => {
        getPosts(page)
    }, [page]);

    return (
        <>
            <div className='mb-20'>
                {posts.map((p) => (
                    <Link key={p.id}
                          to={generatePath(ROUTES.POST_SHOW, {id: p.id})}>
                        <Post post={p}/>
                    </Link>
                ))}
            </div>
            <footer className='bg-gray-500 min-h-20 fixed left-0 bottom-0 w-1/1'>
                {page > 1 &&
                    <Link to={`?page=${page - 1}`} className='fixed left-[5%] bottom-2'>
                        <span className='text-white text-7xl'>&lt;</span>
                    </Link>
                }
                <div className='w-[5%] flex items-center fixed left-[45%] bottom-7'>
                    <div className='bg-white h-5 p-3 flex items-center'>
                        {page + `/${postsMeta.lastPage}`}
                    </div>
                </div>
                {page < postsMeta.lastPage &&
                    <Link to={`?page=${page + 1}`} className='fixed right-[5%] bottom-2'>
                        <span className='text-white text-7xl'>&gt;</span>
                    </Link>
                }
            </footer>
        </>
    )
}