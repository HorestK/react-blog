import {usePostFilterStore} from "../../../store/postFilterStore.js";
import {usePostStore} from "../../../store/postStore.js";
import {useSearchParams} from "react-router-dom";
import {useCategoryStore} from "../../../store/categoryStore.js";
import {useEffect, useState} from "react";
import ServerError from "../../feedback/ServerError.jsx";
import Input from "../../ui/Input.jsx";
import CategorySelect from "./CategorySelect.jsx";
import TagFilter from "./TagFilter.jsx";

export default function SearchMenu({closeAll}){
    const [searchParams, setSearchParams] = useSearchParams()
    const [error, setError] = useState(false)

    const {
        tags,
        setTags,
    } = usePostStore()
    const {handlePostFilter, postFilter} = usePostFilterStore()
    const {getCategories} = useCategoryStore()

    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('category_id') || ""
    )

    useEffect(() => {
        const load = async () =>{
            try{
                const paramsTags = searchParams.getAll('tags') || []

                setTags(paramsTags.map( (t) => ({name: t}) ))
                await getCategories()
            }catch (e){
                setError(true)
            }
        }

        load()
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()

        const params = new URLSearchParams()
        if(postFilter.title) params.set('title', postFilter.title)
        if(postFilter.content) params.set('content', postFilter.content)
        if(selectedCategory) params.set('category_id', selectedCategory)
        tags.forEach( (t) => params.append('tags', t.name) )

        setSearchParams(params)
        closeAll?.()
    }

    if(error) return <ServerError setError={setError} reload={true}/>

    return (
        <form className='fixed left-0 lg:left-auto lg:right-0 top-20 w-full lg:w-96 h-full bg-gray-200 px-4 py-2'
              onSubmit={handleSubmit}
        >
            <div className='p-5 border border-black bg-white'>
                <Input type='text'
                       placeholder='Title'
                       name='title'
                       className='mb-4'
                       value={postFilter.title}
                       onChange={handlePostFilter}
                />
                <Input type='text'
                       placeholder='Content'
                       name='content'
                       className='mb-4'
                       value={postFilter.content}
                       onChange={handlePostFilter}
                />
                <CategorySelect selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                />
                <TagFilter/>
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