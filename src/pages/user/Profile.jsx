import {useUserStore} from "../../Store/userStore.js";

export default function Profile(){
    const {user} = useUserStore()

    return(
        <div className='mt-4 p-3'>
            <div className='flex justify-center mb-3'>
                <img src='../src/assets/default-avatar.png'
                     className='w-[250px] h-[250px]'
                />
            </div>
            <h2 className='text-center text-5xl bold mb-12'>{user.name}</h2>
            <button className='bg-sky-400 w-full text-white border rounded py-2 text-xl mb-3'>View posts</button>
            <button className='bg-yellow-500 w-full text-white border rounded py-2 text-xl mb-3'>Change profile</button>
            <button className='bg-red-600 w-full text-white border rounded py-2 text-xl mb-3'>Ban</button>
        </div>
    )
}