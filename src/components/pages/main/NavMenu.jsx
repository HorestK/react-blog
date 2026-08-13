import {Link} from 'react-router-dom';
import {ROUTES} from "../../../routes/Routes.js";
import MenuItem from "./MenuItem.jsx";

export default function NavMenu({closeMenu}) {
    return (
        <nav className='fixed left-0 top-20'>
            <Link to={ROUTES.MAIN_INDEX} onClick={() => {closeMenu()}}>
                <MenuItem name='Home'/>
            </Link>
            <Link to={ROUTES.POST_INDEX} onClick={() => {closeMenu()}}>
                <MenuItem name='Posts'/>
            </Link>
            <Link to={ROUTES.POST_CREATE} onClick={() => {closeMenu()}}>
                <MenuItem name='Create'/>
            </Link>
        </nav>
    )
}