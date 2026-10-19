import {Link} from "react-router-dom";
import {ROUTES} from "../../../routes/Routes.js";
import MenuItem from "./MenuItem.jsx";

export default function GuestLinks(){
    return (
        <>
            <Link to={ROUTES.USER_REGISTER}>
                <MenuItem name='Register'/>
            </Link>
            <Link to={ROUTES.USER_LOGIN}>
                <MenuItem name='Login'/>
            </Link>
        </>
    )
}