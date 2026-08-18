import {ROUTES} from "../routes/Routes.js";
import {useNavigate} from "react-router-dom";

export default function PageNotFoundError(){
    const navigate = useNavigate()

    return (
        <div className='absolute top-1/3 w-[90%] flex-center mx-auto'>
            <div className='flex justify-center flex-wrap'>
                <div className='w-full flex justify-center mb-3'>
                    <h1 className='text-xl font-bold'>Page not found</h1>
                </div>
                <div className='w-full flex justify-center mb-5'>
                    <p className='pl-5'>Please, make sure that you wrote down the correct address</p>
                </div>
                <div className='w-full flex justify-center mb-1'>
                    <button className='bg-sky-600 text-white p-2 cursor-pointer'
                            onClick={() => navigate(ROUTES.POST_INDEX)}
                    >Back</button>
                </div>
                <div className='w-full flex justify-center'>
                    <p className='text-xs'>Error: 404</p>
                </div>
            </div>
        </div>
    )
}