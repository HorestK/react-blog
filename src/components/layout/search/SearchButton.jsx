export default function SearchButton({toggleSearch}){
    return (
        <button type='button'
                className='text-6xl text-white cursor-pointer lg:mr-4'
                onClick={toggleSearch}>
            🔎
        </button>
    )
}