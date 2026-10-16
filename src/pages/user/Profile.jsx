import {useUserStore} from "../../Store/userStore.js";
import {useEffect} from "react";
import {generatePath, Link, useNavigate, useParams, useSearchParams} from "react-router-dom";
import {ROUTES} from "../../routes/Routes.js";

export default function Profile(){
    const {
        user,
        anotherUser,
        getUser,
        banUser,
        deleteUser
    } = useUserStore()
    const {id} = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        getUser(id)
        console.log(user);
    }, []);

    return(
        <div className='mt-4 p-3'>
            <div className='flex justify-center mb-3'>
                <img src={anotherUser.avatar ? 'http://localhost:8000/storage/' + anotherUser.avatar : '../src/assets/default-avatar.png'}
                     className='w-[250px] h-[250px]'
                />
            </div>
            <h2 className='text-center text-5xl bold mb-12'>{anotherUser.name}</h2>
            <Link to={ROUTES.POST_INDEX + `?page=1&user_id=${id}`} className='bg-sky-400 w-full text-white border rounded py-2 text-xl mb-3 inline-block text-center' >View posts</Link>
            { (user.can.update && user.id === anotherUser.id) && <Link to={generatePath(ROUTES.USER_EDIT, {id: id})} className='bg-yellow-500 w-full text-white border rounded py-2 text-xl mb-3 inline-block text-center'>Change profile</Link>}
            { (( user.id && user.isAdmin && user.id !== anotherUser.id ) ? true : false) && <button className='bg-red-600 w-full text-white border rounded py-2 text-xl mb-3'
                                                                                   onClick={() =>  {banUser(anotherUser.id)}}
            >Ban</button> }
            { ((user.can.delete && user.id === anotherUser.id) ? true : false) && <button className='bg-red-500 w-full text-white border rounded py-2 text-xl mb-3 inline-block text-center'
                                                                                          onClick={() => {
                                                                                              deleteUser(user.id)
                                                                                              navigate('/posts')
                                                                                          }}
            >Delete</button>}
        </div>
    )
}