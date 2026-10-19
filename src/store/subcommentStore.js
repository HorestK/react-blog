import {create} from 'zustand'
import axios from "../axios.js";

export const useSubCommentStore = create( (set, get) => ({
    subcomment: {
        author: '',
        content: '',
        likes: null,
        dislikes: null,
        can: {
            update: false,
            delete: false
        }
    },
    subcomments: [],
    subCommentsMeta: {
        last_page: 1,
    },

    handleSubComment: async(e) => {
        const value = e.target.value

        get().setSubComment({...get().subcomment, ['content']: value})
    },

    setSubComment: newSubComment => set( ()=>({
        subcomment: newSubComment
    }) ),
    setSubComments: newSubComments => set( ()=>({
        subcomments: newSubComments
    }) ),
    setSubCommentsMeta: newSubCommentsMeta => set( ()=>({
        subCommentsMeta: newSubCommentsMeta
    }) ),

    setReactionSubComment: async (e, subComment, commentId) => {
        const name = e.target.name
        e.stopPropagation()

        try{
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            let res;

            if(name === 'like') res = await axios.put(`http://localhost:8000/api/subcomments/${subComment.id}/likes`)
            else if(name === 'dislike') res = await axios.put(`http://localhost:8000/api/subcomments/${subComment.id}/dislikes`)

            const newSubComment = res.data.data

            get().setSubComments([...get().subcomments
                .map( (sc) => sc.id === subComment.id ? newSubComment : sc )])

        }catch (e){
            console.error(e)
        }
    },

    deleteSubComment: async (commentId, subCommentId) => {
        try{
            axios.defaults.withXSRFToken = true;
            axios.defaults.withCredentials = true;
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res =
                await axios.delete(`http://localhost:8000/api/subcomments/${subCommentId}`)

            get().setSubComments([...get().subcomments
                .filter( sc => sc.id !== subCommentId )])
        }catch(e){
            console.log(e)
        }
    },

    updateSubComment: async (e, subCommentId, newContent, commentId) => {
        e.preventDefault()

        const dataToSend = {
            content: newContent
        }

        try{
            axios.defaults.withXSRFToken = true;
            axios.defaults.withCredentials = true;
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res =
                await axios.put(`http://localhost:8000/api/subcomments/${subCommentId}/`, dataToSend)

            const newSubComment = res.data.data

            get().setSubComments([...get().subcomments
                .map( sc => sc.id === subCommentId ? newSubComment : sc)])
        }catch(e){
            console.log(e)
        }
    },

    storeSubComment: async(e,postId, commentId ) => {
        e.preventDefault()

        const dataToSend = {
            content: get().subcomment.content
        }

        try{
            axios.defaults.withCredentials = true;
            axios.defaults.withXSRFToken = true;
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res = await axios.post( `http://localhost:8000/api/posts/${postId}/comments/${commentId}`
                , dataToSend)

            get().setSubComment({
                content: ''
            })

            get().setSubComments([...get().subcomments, res.data.data])
        }catch (e){
            console.log(e);
        }
    },

    getSubComments: async(commentId, page) => {
        try{
            const res =
                await axios.get(`http://localhost:8000/api/comments/${commentId}/subcomments?subcomment_page=${page}&subcomment_per_page=${5}`)

            get().setSubComments(res.data.data)
            get().setSubCommentsMeta(res.data.meta)
        }catch (e){
            console.log(e);
        }
    }
} ))