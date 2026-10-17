export default function PostsNotFound() {
    return (
        <div className='absolute top-1/3 w-[90%] flex-center mx-auto'>
            <div className='flex justify-center flex-wrap'>
                <div className='w-full flex justify-center mb-3'>
                    <h1 className='text-xl font-bold'>Posts not found</h1>
                </div>
                <div className='w-full flex justify-center mb-5'>
                    <p className='pl-5'>Try find posts again</p>
                </div>
            </div>
        </div>
    )
}