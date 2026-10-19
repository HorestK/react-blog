import MenuButton from "./navigation/MenuButton.jsx";
import NavMenu from "./navigation/NavMenu.jsx";
import SearchMenu from "./search/SearchMenu.jsx";
import {useState} from "react";
import SearchButton from "./search/SearchButton.jsx";

export default function Header(){
    const [activeMenu, setActiveMenu] = useState(null)

    const toggleNav = () => setActiveMenu(prev => prev === 'nav' ? null : 'nav')
    const toggleSearch = () => setActiveMenu(prev => prev === 'search' ? null : 'search')
    const closeAll = () => setActiveMenu(null)

    return (
        <header className='flex justify-between bg-gray-500 min-h-20 px-4 fixed left-0 top-0 w-full z-50'>
            <span className='text-white text-2xl flex items-center'>BLOG FOR EVERYTHING</span>
            <div className='pt-2'>
                <SearchButton toggleSearch={toggleSearch}/>
                <MenuButton toggleNav={toggleNav}/>
            </div>
            {activeMenu === 'nav' && <NavMenu closeAll={closeAll}/>}
            {activeMenu === 'search' && <SearchMenu closeAll={closeAll}/>}
        </header>
    )
}