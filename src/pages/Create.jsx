import {usePostStore} from "../Store/postStore.js";
import Tag from "../components/Tag.jsx";
import {useEffect} from "react";
import {useCategoryStore} from "../Store/categoryStore.js";

export default function Create() {
    const {
        handlePost,
        post,
        storePost,
        handleTag,
        storeTag,
        tags,
        tag,
        errors
    } = usePostStore()
    const {getCategories, categories} = useCategoryStore()

    useEffect(() => {
        getCategories()
    }, []);

    return (
        <form className='border border-gray-400 flex flex-wrap p-5 gap-3'
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
                            handlePost(e)
                        }}
                >
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
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
                    <a className='bg-sky-600 text-white p-2 cursor-pointer'
                       onClick={(e) => {
                           storeTag(e)
                       }}
                       href='#'
                       name='add'>
                        Add
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
        </form>
    )
}