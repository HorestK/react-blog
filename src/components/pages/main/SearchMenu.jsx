import {usePostFilterStore} from "../../../Store/postFilterStore.js";
import {usePostStore} from "../../../Store/postStore.js";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useCategoryStore} from "../../../Store/categoryStore.js";
import {useEffect, useState} from "react";
import ServerError from "../../ServerError.jsx";

export default function SearchMenu({closeMenu}){
    const {handlePostFilter, postFilter, setPostFilterOnURL} = usePostFilterStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const {getCategories, categories} = useCategoryStore()
    const [Error, setError] = useState(false)
    const categoryFromParam = +searchParams.get('category_id') || 1
    const [selectedCategory, setSelectedCategory] = useState(categoryFromParam)

    useEffect(() => {
        const load = async () =>{
            try{
                await getCategories()
                console.log(categories)
            }catch (e){
                setError(true)
            }
        }

        load()
    }, [Error]);

    return Error ? <ServerError setError={setError} reload={true}/> : (
        <form className='fixed left-0 lg:left-[80%] top-20 w-full h-1/4 bg-gray-200 px-4 py-2'
              onSubmit={(e) => {
                  setPostFilterOnURL(
                      e,
                      searchParams,
                      setSearchParams,
                      closeMenu
                  )
              }}
        >
            <input type='text'
                   placeholder='Title'
                   name='title'
                   className='border border-gray-500 rounded-xl w-1/1 p-2 bg-white mb-4'
                   value={postFilter.title}
                   onChange={(e) => {
                       handlePostFilter(e)
                   }}
            />
            <input type='text'
                   placeholder='Content'
                   name='content'
                   className='border border-gray-500 rounded-xl w-1/1 p-2 bg-white mb-4'
                   value={postFilter.content}
                   onChange={(e) => {
                       handlePostFilter(e)
                   }}
            />
            <div className='w-1/1'>
                <p className='inline-block mr-4'>Category: </p>
                <select className='border border-gray-300 p-2 bg-white'
                        name='category_id'
                        onChange={(e) => {
                            setSelectedCategory(handlePostFilter(e))
                        }}
                    value={selectedCategory}
                >
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
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