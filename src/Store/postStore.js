import {create} from 'zustand'
import {ROUTES} from "../routes/Routes.js";
import {generatePath} from "react-router-dom";
import axios from "../axios.js";
import {isAxiosError} from "axios";

export const usePostStore = create((set, get) => ({
    posts: [],
    post: {
        category: {
            id: '',
            name: ''
        },
        title: '',
        content: '',
        tags: [],
        can: {
            update: false,
            delete: false,
        }
    },
    tags: [],
    tag: {
        name: '',
    },
    postsMeta: {
        lastPage: 1
    },
    errors: [],
    navigate: '',

    setPosts: newPosts => set(() => ({posts: newPosts})),
    setPost: newPost => set(() => ({post: newPost})),
    setPostsMeta: newPostsMeta => set(() => ({postsMeta: newPostsMeta})),
    setTags: newTags => set(() => ({tags: newTags})),
    setTag: newTag => set(() => ({tag: newTag})),
    setErrors: newErrors => set(() => ({errors: newErrors})),
    setPostNavigate: newNavigate => set(() => ({navigate: newNavigate})),

    handlePost: (e) => {
        const name = e.target.name
        const value = e.target.value
        let newErrors = []

        if(name === 'title' && value.length > 100) newErrors.push({name: 'title', body: 'Too long title'})
        if(name === 'content' && value.length > 1000) newErrors.push({name: 'content', body: 'Too long content'})

        get().setErrors(newErrors)
        get().setPost({...get().post, [name]: value})
        if(name === 'category_id') return value
    },
    storePost: async (e) => {
        e.preventDefault()

        const dataToSend = {
            ...get().post,
            tags: get().tags
        }
        let newErrors = []

        if(!dataToSend.category_id) dataToSend.category_id = 1

        get().setPost({...get().post, tags: get().tags})
        console.log(dataToSend);
        try{
            axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
            axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res = await axios.post('http://localhost:8000/api/posts', dataToSend)
            // console.log(res)
            get().setPost({
                category: {
                    id: '',
                    name: ''
                },
                title: '',
                content: '',
                tags: [],
                can: {
                    update: false,
                    delete: false,
                }
            })
            get().setTags([])
            get().navigate(ROUTES.POST_INDEX)
        }
        catch (error){
            for(let [key, value] of Object.entries(error.response.data.errors)){
                newErrors.push({name: key, body: value[0]})
            }
            get().setErrors(newErrors)
        }

        // get().setPosts([...get().posts, get().post])
    },
    updatePost: async (e, postId, setError) => {
        e.preventDefault()

        const dataToSend = {
            category_id: get().post.category.id,
            title: get().post.title,
            content: get().post.content,
            tags: get().tags
        }
        let newErrors = []

        try{
            axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
            axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res = await axios.put(`http://localhost:8000/api/posts/${postId}`, dataToSend)

            get().setPost({
                category: {
                    id: '',
                    name: ''
                },
                title: '',
                content: '',
                tags: [],
                can: {
                    update: false,
                    delete: false,
                }
            })
            get().setTags([])
            get().navigate(generatePath(ROUTES.POST_SHOW, {id: postId}))
        }
        catch (error){
            console.log(isAxiosError(error))
            if(isAxiosError(error)) setError(true)
            const data = error.response.data.errors ?? {}
            for(let [key, value] of Object.entries(data)){
                newErrors.push({name: key, body: value[0]})
            }
            get().setErrors(newErrors)
        }
    },
    deletePost: async (postId, setError) => {
        if(!confirm('Are you sure about it?')) return

        try{
            const res = await axios.delete(`http://localhost:8000/api/posts/${postId}`)

            get().navigate(ROUTES.POST_INDEX)
        }catch(error){
            setError(true)
        }
    },
    getPosts: async (currentPage) => {
        try{
            const res = await axios.get(ROUTES.HOST
                + ROUTES.POST_INDEX + `?page=${currentPage}&per_page=5`)
            get().setPostsMeta({
                lastPage: res.data.meta.last_page
            })
            get().setPosts(res.data.data)
        }catch (error){
            throw error
        }
    },
    getPost: async (postId) => {
        try{
            axios.defaults.withCredentials = true;
            const res = await axios.get(`http://localhost:8000/api/posts/${postId}`)
            console.log(res);
            get().setPost(res.data.data)
            get().setTags(res.data.data.tags)
        }catch (error){
            throw error
        }
    },

    handleTag: (e) => {
        const name = e.target.value

        get().setTag({name: name})
    },

    storeTag: (e) => {
        e.preventDefault()

        const tagName = get().tag.name
        console.log(!get().tags.some(t => t.name === tagName) || tagName !== '')
        if(!get().tags.some(t => t.name === tagName) && tagName !== '') get().setTags([...get().tags, get().tag])
        get().setTag({
            name: '',
        },)
    },

    deleteTag: (e) => {
        e.preventDefault()
        const tagName = get().tag.name

        console.log(tagName);
        console.log(get().tags.filter((t) => t.name !== tagName));
        get().setTags(get().tags.filter((t) => t.name !== tagName))
        get().setTag({
            name: '',
        },)
    }
}))