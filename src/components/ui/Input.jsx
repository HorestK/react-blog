export default function Input({className='', ...props}){
    return (
        <input className={`border border-gray-500 rounded-xl w-full p-2 bg-white ${className}`}
               {...props}
        />
    )
}