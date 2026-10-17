import {useUserStore} from "../../Store/userStore.js";
import {ROUTES} from "../../routes/Routes.js";
import {useNavigate, useParams} from "react-router-dom";
import UploadImages from "../../components/post/UploadImages.jsx";
import {useEffect, useRef, useState} from "react";
import axios from "../../axios.js";

export default function Edit() {
    const {
        handleUser,
        updateUser,
        errors,
        setSelectedAvatar
    } = useUserStore()
    const navigate = useNavigate()
    const {user} = useUserStore()
    const {id} = useParams()
    const [imageFile, setImageFile] = useState()
    const imageInputRef = new useRef(null)
    const [needToDeleteAvatar, setNeedToDeleteAvatar] = useState(false)

    //Чтобы удалить картинку нужно подать знак
    //При отправке пустого файла аватарка сохраняется
    //Дадим ключевое слово для бэкэнда
    //При определении этого слова изображение удаляется

    return (
        <form className='border border-gray-400 flex flex-wrap p-5 gap-3 lg:w-1/2 lg:mx-auto relative'
              onSubmit={(e) => {
                  updateUser(e, id, needToDeleteAvatar)
              }}
        >
            <h1 className='text-2xl font-bold mb-4'>Edit</h1>
            <input type='text'
                   placeholder='Name'
                   className='border border-gray-300 rounded-xl w-1/1 p-2'
                   autoComplete='username'
                   value={user.name}
                   onChange={(e) => {
                       handleUser(e)
                   }}
                   name='name'/>
            {!needToDeleteAvatar && <UploadImages isAvatar={true}
                          currentAvatar={user.avatar}
                          imageInputRef={imageInputRef}
            />}
            {(user.avatar && !needToDeleteAvatar) && <div className='flex items-center'>
                <a className='bg-red-600
                               text-white
                               p-2
                               cursor-pointer
                               h-10'

                   onClick={(e) => {
                       e.preventDefault()
                       if(confirm('Are you sure about it?')) setNeedToDeleteAvatar(true)
                   }}
                   href='#'
                >Delete
                </a>
            </div>}
            <input type='password'
                   placeholder='New password'
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
                   value='Update'
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