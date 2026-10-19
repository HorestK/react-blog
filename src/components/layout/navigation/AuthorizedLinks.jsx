import {generatePath, Link} from "react-router-dom";
import {ROUTES} from "../../../routes/Routes.js";
import MenuItem from "./MenuItem.jsx";

export default function AuthorizedLinks({userId, handleLogout}){
    return (
        <>
            <Link to={generatePath(ROUTES.USER_PROFILE, {id: userId})}>
                <MenuItem name='Profile'/>
            </Link>
            <Link to={ROUTES.POST_CREATE}>
                <MenuItem name='Create'/>
            </Link>
            <a onClick={handleLogout}
               href='#'
            >
                <MenuItem name='Logout'/>
            </a>
        </>
    )
}