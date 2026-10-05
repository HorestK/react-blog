import {create} from 'zustand'
import {ROUTES} from "../routes/Routes.js";
import axios from "../axios.js";
import {isAxiosError} from "axios";

export const useUserStore = create((set, get) => ({
    user: {
        id: '',
        name: '',
        email: '',
        avatar: '',
        isAdmin: '',
        can: {
            create: false,
            sendComment: false
        }
    },
    errors: [],
    navigate: '',
    selectedAvatar: '',
    previewURLAvatar: '',

    setErrors: newErrors => set(() => ({errors: newErrors})),
    setUser: newUser => set(() => ({user: newUser})),
    setUserNavigate: newNavigate => set(() => ({navigate: newNavigate})),
    setSelectedAvatar: newSelectedPhoto => set(() => ({selectedAvatar: newSelectedPhoto})),
    setPreviewURLAvatar: newPreviewURL => set(() => ({previewURLAvatar: newPreviewURL})),

    handleUser: (e) => {
        const name = e.target.name
        const value = e.target.value
        let newErrors = []

        if(name === 'name' && value.length > 100) newErrors.push({name: 'title', body: 'Too long name'})
        if(name === 'email' && value.length > 255) newErrors.push({name: 'content', body: 'Too long email'})
        if(name === 'password' && value.length < 6) newErrors.push({name: 'content', body: 'Too short password'})

        get().setErrors(newErrors)
        get().setUser({...get().user, [name]: value})
    },

    regUser: async (e) => {
        e.preventDefault()

        //собрать объект FormData

        let newErrors = []
        const dataToSend = {
            name: get().user.name,
            email: get().user.email,
            password: get().user.password,
            password_confirmation: get().user.password_confirmation,
            avatar: get().selectedAvatar
        }

        console.log(dataToSend)

        let formData = new FormData()
        formData.append('name', dataToSend.name)
        formData.append('email', dataToSend.email)
        formData.append('password', dataToSend.password)
        formData.append('password_confirmation', dataToSend.password_confirmation)
        formData.append('avatar', dataToSend.avatar)

        try{
            axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
            axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res = await axios.post('http://localhost:8000/api/register', formData)

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
            // axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
            // axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
            axios.defaults.withCredentials = true;
            axios.defaults.withXSRFToken = true;
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res = await axios.post('http://localhost:8000/api/login', dataToSend)
            const avatarURL = res.data.data.avatar ? "http://localhost:8000/storage/" + res.data.data.avatar : null

            console.log(JSON.stringify(res.data.data));
            get().setUser({...res.data.data, ['avatar']: avatarURL})
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

        // axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
        // axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
        axios.defaults.withCredentials = true;
        axios.defaults.withXSRFToken = true;
        await axios.get('http://localhost:8000/sanctum/csrf-cookie')
        await axios.post('http://localhost:8000/api/logout')

        get().navigate(ROUTES.POST_INDEX)
    },

    handleAvatar: (e) => {
        const file = e.target.files[0]
        get().setSelectedAvatar(file)

        const photoURL = URL.createObjectURL(file)
        get().setPreviewURLAvatar(photoURL)
        console.log(get().previewURLAvatar);
        console.log(file);
    }
}))