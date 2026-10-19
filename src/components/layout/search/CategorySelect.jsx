import {useCategoryStore} from "../../../store/categoryStore.js";

export default function CategorySelect({selectedCategory, setSelectedCategory}){
    const { categories } = useCategoryStore()

    const handleRemoveCategory = () => setSelectedCategory('')

    return (
        <div className='w-full mb-8'>
            <p className='inline-block mr-4'>Category: </p>
            <select className='border border-gray-300 p-2 bg-white mr-6'
                    name='category_id'
                    onChange={(e) => {
                        setSelectedCategory(e.target.value)
                    }}
                    value={selectedCategory}
            >
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <a className='bg-red-600 text-white p-2'
               onClick={handleRemoveCategory}
               href='#'
            >
                Remove
            </a>
        </div>
    )
}