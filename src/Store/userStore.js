import {create} from 'zustand'
import {ROUTES} from "../routes/Routes.js";
import axios from "../axios.js";
import {isAxiosError} from "axios";

export const useUserStore = create((set, get) => ({
    user: {
        name: '',
        email: '',
        can: {
            create: false,
        }
    },
    errors: [],
    navigate: '',

    setErrors: newErrors => set(() => ({errors: newErrors})),
    setUser: newUser => set(() => ({user: newUser})),
    setUserNavigate: newNavigate => set(() => ({navigate: newNavigate})),

    handleUser: (e) => {
        const name = e.target.name
        const value = e.target.value
        let newErrors = []
        console.log(value);

        if(name === 'name' && value.length > 100) newErrors.push({name: 'title', body: 'Too long name'})
        if(name === 'email' && value.length > 255) newErrors.push({name: 'content', body: 'Too long email'})
        if(name === 'password' && value.length < 6) newErrors.push({name: 'content', body: 'Too short password'})

        get().setErrors(newErrors)
        get().setUser({...get().user, [name]: value})
    },

    regUser: async (e) => {
        e.preventDefault()

        let newErrors = []
        const dataToSend = {
            name: get().user.name,
            email: get().user.email,
            password: get().user.password,
            password_confirmation: get().user.password_confirmation,
        }

        try{
            axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
            axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res = await axios.post('http://localhost:8000/api/register', dataToSend)
            console.log(res);
            get().setUser(res.data.data)
            get().navigate(ROUTES.POST_INDEX)
        }
        catch (error){
            if(isAxiosError(error)) {
                newErrors.push({name: 'User', body: 'Email has already been taken'})
                get().setErrors(newErrors)
                return
            }
            for(let [key, value] of Object.entries(error.response.data.errors)){
                newErrors.push({name: key, body: value[0]})
            }
            get().setErrors(newErrors)
        }

    },

    logUser: async (e) => {
        e.preventDefault()

        let newErrors = []
        const dataToSend = {
            email: get().user.email,
            password: get().user.password,
        }

        try{
            console.log(dataToSend);
            axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
            axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res = await axios.post('http://localhost:8000/api/login', dataToSend)
            console.log(res);
            get().setUser(res.data.data)
            get().navigate(ROUTES.POST_INDEX)
        }
        catch (error){
            if(isAxiosError(error)) {
                newErrors.push({name: 'User', body: 'Email or password is incorrect'})
                get().setErrors(newErrors)
                return
            }
            for(let [key, value] of Object.entries(error.response.data.errors)){
                newErrors.push({name: key, body: value[0]})
            }
            get().setErrors(newErrors)
        }

    },

    logoutUser: async () => {
        get().setUser({
            name: '',
            email: '',
            can: {
                create: false,
            }
        })

        axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
        axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
        await axios.get('http://localhost:8000/sanctum/csrf-cookie')
        await axios.post('http://localhost:8000/api/logout')

        get().navigate(ROUTES.POST_INDEX)
    }
}))