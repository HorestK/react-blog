import './App.css'
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import {useState} from "react";
import NavMenu from "./components/pages/main/NavMenu.jsx";
import MenuButton from "./components/pages/main/MenuButton.jsx";
import Main from "./pages/post/Main.jsx";
import {ROUTES} from "./routes/Routes.js";
import Create from "./pages/post/Create.jsx";
import Index from "./pages/post/Index.jsx";
import Show from "./pages/post/Show.jsx";
import Edit from "./pages/post/Edit.jsx";
import NavigationInitializer from "./components/NavigationInitializer.jsx";
import Register from "./pages/user/Register.jsx";
import Login from "./pages/user/Login.jsx";
import SearсhButton from "./components/pages/main/SearchButton.jsx";
import SearchMenu from "./components/pages/main/SearchMenu.jsx";
import Profile from "./pages/user/Profile.jsx";
import UserEdit from "./pages/user/Edit.jsx";

function App() {
    const [isMenu, setIsMenu] = useState(false)
    const [isSearchMenu, setIsSearchMenu] = useState(false)

    const showHamburgerMenu = function () {
        if (!isMenu) {
            setIsSearchMenu(false)
            setIsMenu(true)
        }
        else setIsMenu(false)
    }

    const closeHamburgerMenu = function () {
        if (isMenu) setIsMenu(false)
    }


    //реализовали открытие и закрытие меню
    //не забываем реализовать закрытие прошлого меню если оно открыто
    const showSearchMenu = function () {
        if (!isSearchMenu) {
            setIsMenu(false)
            setIsSearchMenu(true)
        }
        else setIsSearchMenu(false)
    }

    const closeSearchMenu = function () {
        if (isSearchMenu) setIsSearchMenu(false)
    }

    return (
        <Router>
            <NavigationInitializer/>
            <header className='flex justify-between bg-gray-500 min-h-20 px-4 fixed left-0 top-0 w-1/1 z-50'>
                <span className='text-white text-2xl flex items-center'>BLOG FOR EVERYTHING</span>
                <div className='pt-2'>
                    <SearсhButton showMenu={() => {
                        showSearchMenu()
                    }}/>
                    <MenuButton showMenu={() => {
                        showHamburgerMenu()
                    }}/>
                </div>
                {isMenu && <NavMenu closeMenu={() => {closeHamburgerMenu()}}/>}
                {isSearchMenu && <SearchMenu closeMenu={() => {closeSearchMenu()}}/>}
            </header>
            <main className='px-4 py-2 mt-20'>
                <Routes>
                    <Route path={ROUTES.MAIN_INDEX} element={<Main/>}/>
                    <Route path={ROUTES.POST_INDEX} element={<Index/>}/>
                    <Route path={ROUTES.POST_CREATE} element={<Create/>}/>

                    <Route path={ROUTES.POST_EDIT} element={<Edit/>}/>
                    <Route path={ROUTES.POST_SHOW} element={<Show/>}/>

                    <Route path={ROUTES.USER_REGISTER} element={<Register/>}/>
                    <Route path={ROUTES.USER_LOGIN} element={<Login/>}/>
                    <Route path={ROUTES.USER_PROFILE} element={<Profile/>}/>
                    <Route path={ROUTES.USER_EDIT} element={<UserEdit/>}/>
                </Routes>
            </main>
        </Router>
    )
}

export default App
