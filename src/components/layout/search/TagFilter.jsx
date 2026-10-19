import Input from "../../ui/Input.jsx";
import Tag from "../../ui/Tag.jsx";
import {usePostStore} from "../../../store/postStore.js";

export default function TagFilter({searchParams, setSearchParams}) {
    const {
        handleTag,
        storeTag,
        deleteTag,
        tag,
        tags
    } = usePostStore()

    return (
        <>
            <div className='w-full mb-6'>
                <div>
                    <input type='text'
                           placeholder='Tag'
                           name='tag'
                           className='border border-gray-500 rounded-xl w-1/2 p-2 bg-white mr-4'
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
                    {/*<a className='bg-red-600 text-white p-2 cursor-pointer'*/}
                    {/*   onClick={(e) => {*/}
                    {/*       let newSearchParams = new URLSearchParams(searchParams)*/}
                    {/*       deleteTag(e, newSearchParams, setSearchParams, true)*/}
                    {/*   }}*/}
                    {/*   href='#'*/}
                    {/*   name='delete'>*/}
                    {/*    Delete*/}
                    {/*</a>*/}
                </div>
            </div>
            {
                tags.length > 0 &&
                <div className='flex flex-wrap gap-2 w-full'>
                    {tags.map((t, i) => (
                        <Tag key={i} name={t.name}/>
                    ))}
                </div>
            }
        </>
    )
}