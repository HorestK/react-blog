import {usePostStore} from "../../Store/postStore.js";
import Tag from "../../components/Tag.jsx";
import {useEffect, useState} from "react";
import {useCategoryStore} from "../../Store/categoryStore.js";
import {useUserStore} from "../../Store/userStore.js";
import ServerError from "../../components/ServerError.jsx";
import {ROUTES} from "../../routes/Routes.js";
import {useNavigate} from "react-router-dom";
import UploadImages from "../../components/UploadImages.jsx";

export default function Create() {
    const {
        handlePost,
        post,
        storePost,
        setPost,
        handleTag,
        storeTag,
        deleteTag,
        tags,
        tag,
        errors,
        setTags
    } = usePostStore()
    const {getCategories, categories} = useCategoryStore()
    const [selectedCategory, setSelectedCategory] = useState(1)
    const [Error, setError] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const load = async ()=>{
            try{
                setTags([])
                await getCategories()
            }catch (error){
                setError(true)
            }
        }
        load()
    }, [Error]);

    useEffect(() => {
        setPost({
            category: {
                id: null,
                name: ''
            },
            title: '',
            content: '',
            tags: [],
        })
    }, []);

    return Error ? <ServerError setError={setError} reload={false}/> : (
        <form className='border border-gray-400 flex flex-wrap p-5 gap-3 lg:w-1/2 lg:mx-auto relative'
              onSubmit={(e) => {
                  storePost(e)
              }}
        >
            <input type='text'
                   placeholder='title'
                   name='title'
                   value={post.title}
                   className='border border-gray-300 rounded-xl w-1/1 p-2'
                   onChange={(e) => {
                       handlePost(e)
                   }}
            />
            <textarea placeholder='content'
                      name='content'
                      value={post.content}
                      className='border border-gray-300 rounded-xl w-1/1 p-2'
                      onChange={(e) => {
                          handlePost(e)
                      }}
            />
            <div className='w-1/1'>
                <p className='inline-block mr-4'>Category: </p>
                <select className='border border-gray-300 p-2'
                        name='category_id'
                        onChange={(e) => {
                            setSelectedCategory(handlePost(e))
                        }}
                        value={selectedCategory}
                >
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
            <UploadImages/>
            <div className='w-1/1'>
                <div>
                    <input type='text'
                           placeholder='tag'
                           name='tag'
                           className='border border-gray-300 rounded-xl w-1/2 p-2 mr-4'
                           value={tag.name}
                           onChange={(e) => {
                               handleTag(e)
                           }}
                    />
                    <a className='bg-sky-600 text-white p-2 cursor-pointer mr-5'
                       onClick={(e) => {
                           storeTag(e)
                       }}
                       href='#'
                       name='add'>
                        Add
                    </a>
                    <a className='bg-red-600 text-white p-2 cursor-pointer'
                       onClick={(e) => {
                           deleteTag(e)
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
            {errors.length > 0 &&
                <div className='flex flex-wrap w-1/1 mb-2'>
                    {errors.map((e, i) => (
                        <p key={i} className='text-red-600 text-xl'>{e.body}</p>
                    ))}
                </div>
            }
            <input type='submit'
                   value='Create'
                   className='bg-sky-600 text-white p-2 cursor-pointer'
            />
            <a
                className='cursor-pointer px-4 py-2 bg-sky-600 text-white absolute right-5 bottom-5'
                onClick={() => navigate(ROUTES.POST_INDEX)}
            >
                Back
            </a>
        </form>
    )
}