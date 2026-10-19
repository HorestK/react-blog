import {useNavigate} from "react-router-dom";
import {usePostStore} from "../Store/postStore.js";
import {useEffect} from "react";
import {useUserStore} from "../Store/userStore.js";


export default function NavigationInitializer(){
    const navigate = useNavigate()
    const setPostNavigate = usePostStore((state) => state.setPostNavigate)
    const setUserNavigate = useUserStore((state) => state.setUserNavigate)

    useEffect(() => {
        setPostNavigate(navigate)
    },[navigate, setPostNavigate])

    useEffect(() => {
        setUserNavigate(navigate)
    },[navigate, setUserNavigate])

    return null
}