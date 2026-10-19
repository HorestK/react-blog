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
        photo: '',
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
    selectedPhoto: '',
    previewURL: '',
    postPhotoFromServer: '',

    setPosts: newPosts => set(() => ({posts: newPosts})),
    setPost: newPost => set(() => ({post: newPost})),
    setPostsMeta: newPostsMeta => set(() => ({postsMeta: newPostsMeta})),
    setTags: newTags => set(() => ({tags: newTags})),
    setTag: newTag => set(() => ({tag: newTag})),
    setErrors: newErrors => set(() => ({errors: newErrors})),
    setPostNavigate: newNavigate => set(() => ({navigate: newNavigate})),
    setSelectedPhoto: newSelectedPhoto => set(() => ({selectedPhoto: newSelectedPhoto})),
    setPreviewURL: newPreviewURL => set(() => ({previewURL: newPreviewURL})),
    setPostPhotoFromServer: newPostPhotoFromServer => set( () =>
        ({postPhotoFromServer: newPostPhotoFromServer}) ),

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

        let postForm = new FormData()
        postForm.append('category_id', dataToSend.category_id)
        postForm.append('title', dataToSend.title)
        postForm.append('content', dataToSend.content)
        postForm.append('tags', JSON.stringify( dataToSend.tags ))

        if(get().selectedPhoto) postForm.append('photo', get().selectedPhoto)

        get().setPost({...get().post, tags: get().tags})
        console.log(...postForm.entries());
        try{
            axios.defaults.withCredentials = true;
            axios.defaults.withXSRFToken = true;
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res = await axios.post('http://localhost:8000/api/posts', postForm)
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

        // get().setPosts([...get().post, get().post])
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
    getPosts: async (
        setErrors,
        searchParams,
        ) => {
        try{
            const currentPage = +searchParams.get('page') || 1

            const allParams = Object.fromEntries([...searchParams])
            const allTags = searchParams.getAll("tags")

            let mainURL = ROUTES.HOST + ROUTES.POST_INDEX + '?'
            let paramsForURL = ''

            Object.entries(allParams).forEach( ([key, value]) => {
                if(key !== 'page' && key !== 'tags' ) paramsForURL += key + '=' + value + '&'
            })

            allTags.forEach((t) => {
                paramsForURL += "tags[]" + "=" + t + "&"
            })

            mainURL += paramsForURL + `page=${currentPage}&per_page=5`

            const res = await axios.get(mainURL)

            get().setPostsMeta({
                lastPage: res.data.meta.last_page
            })

            // const photoURL = res.data.data.image ? 'http://localhost:8000' + res.data.data.image : null

            get().setPosts(res.data.data.map((p)=>({
                ...p,
                ['photo']: p.image ? 'http://localhost:8000' + p.image : null
            })))
        }catch (error){
            throw error
        }
    },
    getPost: async (postId) => {
        try{
            axios.defaults.withCredentials = true;
            const res = await axios.get(`http://localhost:8000/api/posts/${postId}`)
            const photoURL = res.data.data.image ? 'http://localhost:8000' + res.data.data.image : null

            get().setPost({...res.data.data, ['photo']: photoURL})
            get().setTags(res.data.data.tags)
        }catch (error){
            throw error
        }
    },

    handleTag: (e) => {
        const name = e.target.value

        get().setTag({name: name})
    },

    storeTag: () => {
        const tagName = get().tag.name

        if(!get().tags
            .some(t => t.name === tagName) && tagName !== '')
            get().setTags([...get().tags, get().tag])

        get().setTag({
            name: '',
        },)
    },

    deleteTag: (tagNameToDelete) => {
        // const tagName = get().tag.name

        get().setTags(get().tags.filter((t) => t.name !== tagNameToDelete))
        //сделать удаление по клику
    },

    handlePhoto: (e, setPicture) => {
        const file = e.target.files[0]
        get().setSelectedPhoto(file)

        const photoURL = URL.createObjectURL(file)
        // get().setPreviewURL(photoURL)
        setPicture(photoURL)
        console.log(file);
    },

    setReaction: async (e, post) => {
        const name = e.target.name
        e.stopPropagation()

        // console.log(name);
        // if(name === 'like') post.likes = post.likes + 1
        // else if(name === 'dislike') post.dislikes = post.dislikes + 1

        try{
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            let res;

            if(name === 'like') res = await axios.put(`http://localhost:8000/api/posts/${post.id}/likes`)
            else if(name === 'dislike') res = await axios.put(`http://localhost:8000/api/posts/${post.id}/dislikes`)

            const newPost = res.data.data
            get().setPosts( get().posts.map( (p) => p.id === post.id ? newPost : p ) )
        }catch (e){
            console.error(e)
        }
    }
}))