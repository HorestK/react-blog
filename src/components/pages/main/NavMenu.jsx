import {Link} from 'react-router-dom';
import {ROUTES} from "../../../routes/Routes.js";
import MenuItem from "./MenuItem.jsx";
import {useUserStore} from "../../../Store/userStore.js";

export default function NavMenu({closeMenu}) {
    const {user, logoutUser} = useUserStore()

    return (
        <nav className='fixed left-0 lg:left-[80%] top-20 w-full'>
            {/*<Link to={ROUTES.MAIN_INDEX} onClick={() => {closeMenu()}}>*/}
            {/*    <MenuItem name='Home'/>*/}
            {/*</Link>*/}
            <Link to={ROUTES.POST_INDEX + '?page=1'} onClick={() => {closeMenu()}}>
                <MenuItem name='Posts'/>
            </Link>
            {user.can.create &&
                <>
                    <Link to={ROUTES.POST_CREATE} onClick={() => {closeMenu()}}>
                        <MenuItem name='Create'/>
                    </Link>
                    <a className='' onClick={() => {
                        closeMenu()
                        logoutUser()
                    }}>
                        <MenuItem name='Logout'/>
                    </a>
                </>
            }
            {user.can.create ||
                <>
                    <Link to={ROUTES.USER_REGISTER} onClick={() => {closeMenu()}}>
                        <MenuItem name='Register'/>
                    </Link>
                    <Link to={ROUTES.USER_LOGIN} onClick={() => {closeMenu()}}>
                        <MenuItem name='Login'/>
                    </Link>
                </>
            }
        </nav>
    )
}