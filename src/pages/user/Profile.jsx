import {useUserStore} from "../../Store/userStore.js";
import {useEffect} from "react";

export default function Profile(){
    const {user} = useUserStore()

    useEffect(() => {
        console.log(user);
    }, []);

    return(
        <div className='mt-4 p-3'>
            <div className='flex justify-center mb-3'>
                <img src={user.avatar || '../src/assets/default-avatar.png'}
                     className='w-[250px] h-[250px]'
                />
            </div>
            <h2 className='text-center text-5xl bold mb-12'>{user.name}</h2>
            <button className='bg-sky-400 w-full text-white border rounded py-2 text-xl mb-3'>View posts</button>
            { user.can.update && <button className='bg-yellow-500 w-full text-white border rounded py-2 text-xl mb-3'>Change profile</button>}
            { (user.isAdmin ? true : false) && <button className='bg-red-600 w-full text-white border rounded py-2 text-xl mb-3'>Ban</button> }
        </div>
    )
}