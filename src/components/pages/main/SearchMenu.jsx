import {usePostFilterStore} from "../../../Store/postFilterStore.js";
import {usePostStore} from "../../../Store/postStore.js";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useCategoryStore} from "../../../Store/categoryStore.js";
import {useEffect, useState} from "react";
import ServerError from "../../ServerError.jsx";
import {ROUTES} from "../../../routes/Routes.js";
import Tag from "../../Tag.jsx";

export default function SearchMenu({closeMenu}){
    const {
        handleTag,
        storeTag,
        deleteTag,
        tags,
        tag,
        setTags,
    } = usePostStore()
    const {handlePostFilter, postFilter, setPostFilterOnURL} = usePostFilterStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const {getCategories, categories} = useCategoryStore()
    const [Error, setError] = useState(false)
    const categoryFromParam = +searchParams.get('category_id') || 1
    const [selectedCategory, setSelectedCategory] = useState(categoryFromParam)
    const allTagsFromParams = searchParams.getAll('tags') || []

    useEffect(() => {
        const load = async () =>{
            try{
                const newTags = allTagsFromParams.map( (t) => ({name: t}) )

                setTags(newTags)
                await getCategories()
            }catch (e){
                setError(true)
            }
        }

        load()
    }, [Error]);

    return Error ? <ServerError setError={setError} reload={true}/> : (
        <form className='fixed left-0 lg:left-[80%] top-20 w-full h-full bg-gray-200 px-4 py-2'
              onSubmit={(e) => {
                  setPostFilterOnURL(
                      e,
                      searchParams,
                      setSearchParams,
                      closeMenu,
                      tags
                  )
              }}
        >
            <div className='p-5 border border-black bg-white'>
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
                <div className='w-1/1 mb-8'>
                    <p className='inline-block mr-4'>Category: </p>
                    <select className='border border-gray-300 p-2 bg-white mr-6'
                            name='category_id'
                            onChange={(e) => {
                                const value = handlePostFilter(e)

                                setSelectedCategory(value)
                                console.log("Search params before: " + JSON.stringify(searchParams.get('category_id')) );
                                searchParams.set('category_id', value)
                                setSearchParams(searchParams)
                                console.log("Search params after: " + JSON.stringify(searchParams.get('category_id')) )
                            }}
                            value={selectedCategory}
                    >
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <a className='bg-red-600 text-white p-2'
                       onClick={() => {
                           const currentSearchParams = new URLSearchParams(searchParams)

                           currentSearchParams.delete('category_id')
                           setSearchParams(currentSearchParams)
                       }}
                       href='#'
                    >
                        Remove
                    </a>
                </div>
                <div className='w-1/1 mb-6'>
                    <div>
                        <input type='text'
                               placeholder='Tag'
                               name='tag'
                               className='border border-gray-500 rounded-xl w-1/2 p-2 mr-4 bg-white'
                               value={tag.name}
                               onChange={(e) => {
                                   handleTag(e)
                               }}
                        />
                        <a className='bg-sky-600 text-white p-2 cursor-pointer mr-5'
                           onClick={(e) => {
                               storeTag(e, searchParams, setSearchParams, true)
                           }}
                           href='#'
                           name='add'>
                            Add
                        </a>
                        <a className='bg-red-600 text-white p-2 cursor-pointer'
                           onClick={(e) => {
                               let newSearchParams = new URLSearchParams(searchParams)
                               deleteTag(e, newSearchParams, setSearchParams, true)
                           }}
                           href='#'
                           name='delete'>
                            Delete
                        </a>
                    </div>
                </div>
                {tags.length > 0 &&
                    <div className='flex flex-wrap gap-2 w-1/1'>
                        {tags.map((t, i) => (
                            <Tag key={i} name={t.name}/>
                        ))}
                    </div>
                }
                <div className='w-full flex justify-end'>
                    <input type='submit'
                           className='bg-sky-600 text-white p-2 cursor-pointer'
                           value='Accept'
                    />
                </div>
            </div>
        </form>
    )
}