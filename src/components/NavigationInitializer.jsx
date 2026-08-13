import {useNavigate} from "react-router-dom";
import {usePostStore} from "../Store/postStore.js";
import {useEffect} from "react";


export default function NavigationInitializer(){
    const navigate = useNavigate()
    const setNavigate = usePostStore((state) => state.setNavigate)

    useEffect(() => {
        setNavigate(navigate)
    },[navigate, setNavigate])

    return null
}