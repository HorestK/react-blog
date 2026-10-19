import {useUserStore} from "../../store/userStore.js";
import {ROUTES} from "../../routes/Routes.js";
import {useNavigate} from "react-router-dom";
import UploadImages from "../../components/post/UploadImages.jsx";

export default function Register(){
    const {handleUser, regUser, errors} = useUserStore()
    const navigate = useNavigate()

    return (
        <form className='border border-gray-400 flex flex-wrap p-5 gap-3 lg:w-1/2 lg:mx-auto relative'
              onSubmit={(e) => {
                  regUser(e)
              }}
        >
            <h1 className='text-2xl font-bold mb-4'>Register</h1>
            <input type='text'
                   placeholder='Name'
                   className='border border-gray-300 rounded-xl w-1/1 p-2'
                   autoComplete='username'
                   onChange={(e) => {
                       handleUser(e)
                   }}
                   name='name'/>
            <input type='email'
                   placeholder='Email'
                   className='border border-gray-300 rounded-xl w-1/1 p-2 mb-2'
                   autoComplete='email'
                   onChange={(e) => {
                       handleUser(e)
                   }}
                   name='email'/>
            <UploadImages isAvatar={true}/>
            <input type='password'
                   placeholder='Password'
                   className='border border-gray-300 rounded-xl w-1/1 p-2'
                   autoComplete='new-password'
                   onChange={(e) => {
                       handleUser(e)
                   }}
                   name='password'/>
            <input type='password'
                   placeholder='Password confirmation'
                   className='border border-gray-300 rounded-xl w-1/1 p-2 mb-4'
                   autoComplete='new-password'
                   onChange={(e) => {
                       handleUser(e)
                   }}
                   name='password_confirmation'/>
            {errors.length > 0 &&
                <div className='flex flex-wrap w-1/1 mb-2'>
                    {errors.map((e, i) => (
                        <p key={i} className='text-red-600 text-xl'>{e.body}</p>
                    ))}
                </div>
            }
            <input type='submit'
                   value='Register'
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