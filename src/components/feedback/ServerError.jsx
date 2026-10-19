import {useNavigate} from "react-router-dom";

export default function ServerError({setError, reload = true}) {
    const {navigate} = useNavigate()

    return (
        <div className='absolute top-1/3 w-[90%] flex-center mx-auto'>
            <div className='flex justify-center flex-wrap'>
                <div className='w-full flex justify-center mb-3'>
                    <h1 className='text-xl font-bold'>Something went wrong</h1>
                </div>
                <div className='w-full flex justify-center mb-5'>
                    <p className='pl-5'>Please, check your internet connection and repeat</p>
                </div>
                <div className='w-full flex justify-center mb-1'>
                    {reload ? (
                            <button className='bg-sky-600 text-white p-2 cursor-pointer'
                                    onClick={() => {
                                        setError(false)
                                    }}
                            >Repeat</button>
                        )
                        : (
                            <button className='bg-sky-600 text-white p-2 cursor-pointer'
                                    onClick={() => {
                                        setError(false)
                                        navigate(-1)
                                    }}
                            >Back</button>
                        )
                    }

                </div>
                <div className='w-full flex justify-center'>
                    <p className='text-xs'>Error: 500</p>
                </div>
            </div>
        </div>
    )
}