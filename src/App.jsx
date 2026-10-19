import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ROUTES} from "./routes/Routes.js";
import Create from "./pages/post/Create.jsx";
import Index from "./pages/post/Index.jsx";
import Show from "./pages/post/Show.jsx";
import Edit from "./pages/post/Edit.jsx";
import NavigationInitializer from "./providers/NavigationInitializer.jsx";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Profile from "./pages/user/Profile.jsx";
import UserEdit from "./pages/user/Edit.jsx";
import Header from "./components/layout/Header.jsx";
import Home from "./pages/Home.jsx";
import PageNotFoundError from "./components/feedback/PageNotFoundError.jsx";

function App() {
    return (
        <Router>
            <NavigationInitializer/>
            <Header/>
            <main className='px-4 py-2 mt-20'>
                <Routes>
                    <Route path={ROUTES.MAIN_INDEX} element={<Home/>}/>
                    <Route path={ROUTES.POST_INDEX} element={<Index/>}/>
                    <Route path={ROUTES.POST_CREATE} element={<Create/>}/>

                    <Route path={ROUTES.POST_EDIT} element={<Edit/>}/>
                    <Route path={ROUTES.POST_SHOW} element={<Show/>}/>

                    <Route path={ROUTES.USER_REGISTER} element={<Register/>}/>
                    <Route path={ROUTES.USER_LOGIN} element={<Login/>}/>
                    <Route path={ROUTES.USER_PROFILE} element={<Profile/>}/>
                    <Route path={ROUTES.USER_EDIT} element={<UserEdit/>}/>

                    <Route path='*' element={<PageNotFoundError/>}/>
                </Routes>
            </main>
        </Router>
    )
}

export default App
