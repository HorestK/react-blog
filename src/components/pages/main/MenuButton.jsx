export default function MenuButton({showMenu}){
    return (
        <button className='text-6xl text-white cursor-pointer' onClick={() => {
            showMenu()
        }}>
            ☰
        </button>
    )
}