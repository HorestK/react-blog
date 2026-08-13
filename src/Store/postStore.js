import {create} from 'zustand'
import axios from "axios";
import {ROUTES} from "../routes/Routes.js";
import {generatePath} from "react-router-dom";

export const usePostStore = create((set, get) => ({
    posts: [],
    post: {
        category: {
            name: ''
        },
        title: '',
        content: '',
        tags: []
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
    setNavigate: newNavigate => set(() => ({navigate: newNavigate})),

    handlePost: (e) => {
        const name = e.target.name
        const value = e.target.value
        let newErrors = []

        if(name === 'title' && value.length > 100) newErrors.push({name: 'title', body: 'Too long title'})
        if(name === 'content' && value.length > 1000) newErrors.push({name: 'content', body: 'Too long content'})

        get().setErrors(newErrors)
        get().setPost({...get().post, [name]: value})
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
        console.log(get().post);
        try{
            const res = await axios.post('http://127.0.0.1:8000/api/posts', dataToSend)
            // console.log(res)
            get().setPost({
                category: {
                    id: null,
                    name: ''
                },
                title: '',
                content: '',
                tags: []
            })
            get().setTags([])
        }
        catch (error){
            for(let [key, value] of Object.entries(error.response.data.errors)){
                newErrors.push({name: key, body: value[0]})
            }
            get().setErrors(newErrors)
        }

        // get().setPosts([...get().posts, get().post])
    },
    updatePost: async (e, postId) => {
        e.preventDefault()

        const dataToSend = {
            category_id: get().post.category.id,
            title: get().post.title,
            content: get().post.content,
            tags: get().tags
        }
        let newErrors = []

        try{
            const res = await axios.put(`http://127.0.0.1:8000/api/posts/${postId}`, dataToSend)

            get().setPost({
                category: {
                    id: '',
                    name: ''
                },
                title: '',
                content: '',
                tags: []
            })
            get().setTags([])
            get().navigate(generatePath(ROUTES.POST_SHOW, {id: postId}))
        }
        catch (error){
            for(let [key, value] of Object.entries(error.response.data.errors)){
                newErrors.push({name: key, body: value[0]})
            }
            get().setErrors(newErrors)
        }
    },
    deletePost: async (postId) => {
        if(!confirm('Are you sure about it?')) return

        const res = await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}`)

        get().navigate(ROUTES.POST_INDEX)
    },
    getPosts: async (currentPage) => {
        const res = await axios.get(ROUTES.HOST
            + ROUTES.POST_INDEX + `?page=${currentPage}&per_page=5`)
        get().setPostsMeta({
            lastPage: res.data.meta.last_page
        })
        get().setPosts(res.data.data)
    },
    getPost: async (postId) => {
        const res = await axios.get(`http://127.0.0.1:8000/api/posts/${postId}`)
        get().setPost(res.data.data)
    },

    handleTag: (e) => {
        const name = e.target.value

        get().setTag({name: name})
    },

    storeTag: (e) => {
        e.preventDefault()

        get().setTags([...get().tags, get().tag])
        get().setTag({
            name: '',
        },)
    }
}))