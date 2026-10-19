import Tag from "../ui/Tag.jsx";
import {useEffect} from "react";
import {usePostStore} from "../../Store/postStore.js";
import {useUserStore} from "../../Store/userStore.js";
import {generatePath, Link} from "react-router-dom";
import {ROUTES} from "../../routes/Routes.js";

export default function PostItem({post, page}) {
    const {setReaction} = usePostStore()
    const {user} = useUserStore()

    return post === undefined ? false : (
        <div className='w-full border border-gray-300 py-2 px-4 mb-4'>
            <Link to={`/users/${post.user_id}`}>
                <div>
                    <img
                        src={post.userAvatar ? 'http://localhost:8000/storage/' + post.userAvatar : '../src/assets/default-avatar.png'}
                        className='w-[40px] h-[40px] inline-block mr-3 rounded-3xl'
                    />
                    <h2 className='text-xl mb-2 inline-block'>{post.user_name}</h2>
                </div>
            </Link>

            <Link className='lg:w-1/2 lg:mx-auto lg:block'
                  to={`/posts/${post.id}` + `?previous_page=${page}`}>
                <div>
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
            </Link>
            <div className='flex justify-between'>
                <div>
                    <button className='text-2xl'
                            name='like'
                            onClick={(e) => {
                                if (user.id !== '') setReaction(e, post)
                                else alert("You aren't logged. Please login")
                            }}>👍 {post.likes}</button>
                </div>
                <div>
                    <button className='text-2xl'
                            name='dislike'
                            onClick={(e) => {
                                if (user.id !== '') setReaction(e, post)
                                else alert("You aren't logged. Please login")
                            }}>👎 {post.dislikes}</button>
                </div>
                <div>
                    <button className='text-2xl'>💬 {post.commentCount}</button>
                </div>
            </div>
        </div>
    )
}