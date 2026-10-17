import {useUserStore} from "../../Store/userStore.js";
import {useState} from "react";
import ServerError from "../../components/feedback/ServerError.jsx";
import {ROUTES} from "../../routes/Routes.js";
import {useNavigate} from "react-router-dom";

export default function Login(){
    const {logUser, errors, handleUser} = useUserStore()
    const navigate = useNavigate()

    return (
        <form className='border border-gray-400 flex flex-wrap p-5 gap-3 lg:w-1/2 lg:mx-auto relative'
              onSubmit={(e) => {
                  logUser(e)
              }}
        >
            <h1 className='text-2xl font-bold mb-4'>Login</h1>
            <input type='email'
                   placeholder='Email'
                   className='border border-gray-300 rounded-xl w-1/1 p-2'
                   autoComplete='email'
                   onChange={(e) => {
                       handleUser(e)
                   }}
                   name='email'/>
            <input type='password'
                   placeholder='Password'
                   className='border border-gray-300 rounded-xl w-1/1 p-2 mb-4'
                   autoComplete='current-password'
                   onChange={(e) => {
                       handleUser(e)
                   }}
                   name='password'/>
            {errors.length > 0 &&
                <div className='flex flex-wrap w-1/1 mb-2'>
                    {errors.map((e, i) => (
                        <p key={i} className='text-red-600 text-xl'>{e.body}</p>
                    ))}
                </div>
            }
            <input type='submit'
                   value='Login'
                   className='bg-sky-600 text-white p-2 cursor-pointer'/>
            <a
                className='cursor-pointer px-4 py-2 bg-sky-600 text-white absolute right-5 bottom-5'
                onClick={() => navigate(ROUTES.POST_INDEX)}
            >
                Back
            </a>

        </form>
    )
}