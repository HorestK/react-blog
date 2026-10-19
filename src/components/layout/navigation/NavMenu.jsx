import {Link} from 'react-router-dom';
import {ROUTES} from "../../../routes/Routes.js";
import MenuItem from "./MenuItem.jsx";
import {useUserStore} from "../../../store/userStore.js";
import AuthorizedLinks from "./AuthorizedLinks.jsx";
import GuestLinks from "./GuestLinks.jsx";

export default function NavMenu({closeAll}) {
    const {user, logoutUser} = useUserStore()

    const isAutheficated = Boolean(user?.id)

    return (
        <nav className='fixed left-0 lg:left-auto lg:right-0 top-20 w-full lg:w-56'
             onClick={closeAll}
        >
            {isAutheficated
                ? <AuthorizedLinks userId={user.id}
                                   handleLogout={logoutUser}
                />
                : <GuestLinks/>
            }
            <Link to={ROUTES.POST_INDEX + '?page=1'}>
                <MenuItem name='Posts'/>
            </Link>
        </nav>
    )
}