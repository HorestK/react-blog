import {usePostFilterStore} from "../../../Store/postFilterStore.js";
import {usePostStore} from "../../../Store/postStore.js";
import {useNavigate, useSearchParams} from "react-router-dom";

export default function SearchMenu({closeMenu}){
    const {handlePostFilter, postFilter, setPostFilterOnURL} = usePostFilterStore()
    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <form className='fixed left-0 lg:left-[80%] top-20 w-full h-1/3 bg-gray-200 px-4 py-2'
              onSubmit={(e) => {setPostFilterOnURL(
                  e,
                  searchParams,
                  setSearchParams,
                  closeMenu
              )}}
        >
            <input type='text'
                   placeholder='Title'
                   name='title'
                   className='border border-gray-500 rounded-xl w-1/1 p-2 bg-white mb-4'
                   value={postFilter.title}
                   onChange={(e) => {handlePostFilter(e)}}
            />
            <input type='text'
                   placeholder='Content'
                   name='content'
                   className='border border-gray-500 rounded-xl w-1/1 p-2 bg-white mb-4'
                   value={postFilter.content}
                   onChange={(e) => {handlePostFilter(e)}}
            />
            <input type='text'
                   placeholder='Category'
                   name='category'
                   className='border border-gray-500 rounded-xl w-1/1 p-2 bg-white mb-4'
                   value={postFilter.category}
                   onChange={(e) => {handlePostFilter(e)}}
            />
            <input type='text'
                   placeholder='User name'
                   name='user_name'
                   className='border border-gray-500 rounded-xl w-1/1 p-2 bg-white mb-4'
                   value={postFilter.userName}
                   onChange={(e) => {handlePostFilter(e)}}
            />
            <div className='w-full flex justify-end'>
                <input type='submit'
                       className='bg-sky-600 text-white p-2 cursor-pointer'
                       value='Accept'
                />
            </div>
        </form>
    )
}

/*
Как можно реализовать поисковую систему?

1. заполняем поля по которым хотим искать посты
2. нажимаем на кнопку применить
   Каким образом будем делать запрос?

   1) Нам нужно сгруппирировать параметры поиска в единую сущность
   2) Сформировать url запроса
   3) отправляем запрос на собранный url
   4) Получаем посты
 */