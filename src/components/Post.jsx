import Tag from "./Tag.jsx";
import {useEffect} from "react";

export default function ({post}) {
    return post === undefined ? false : (
        <div className='w-full border border-gray-300 py-2 px-4 mb-4'>
            <h2 className='text-xl mb-2'>{post.user_name}</h2>
            {post.photo && <img src={post.photo}
                                className='mb-2'
            />}
            <h1 className='text-xl font-bold mb-2'>{post.title}</h1>
            <h2 className='text-xl mb-4'>{post.category.name}</h2>
            <p className='mb-4'>{post.content}</p>
            <div className='flex w-1/1 flex-wrap gap-3 mb-4'>
                {post.tags.map((t) => (
                    <Tag key={t.id} name={t.name}/>
                ))}
            </div>
        </div>
    )
}