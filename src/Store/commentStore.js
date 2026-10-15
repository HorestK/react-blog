import {create} from 'zustand'
import {ROUTES} from "../routes/Routes.js";
import axios from "../axios.js";
import {useState} from "react";

export const useCommentStore = create( (set, get) => ({
    comment: {
        content: ''
    },
    comments: [],
    commentsMeta: {
        lastPage: 1,
    },
    openedCommentId: null,

    // const [openedCommentId, setOpenedCommentId] = useState(null)

    setComment: newComment => set( ()=> ({
        comment: newComment
    }) ),
    setComments: newComments => set( ()=> ({
        comments: newComments
    }) ),
    setCommentsMeta: newCommentsMeta => set( ()=> ({
        commentsMeta: newCommentsMeta
    }) ),
    setOpenedCommentId: newOpenedCommentId => set( () => ({
        openedCommentId: newOpenedCommentId
    }) ),

    handleComment: (e) => {
        const name = e.target.name
        const value = e.target.value

        get().setComment({...get().comment, [name]: value})
    },

    getComments: async (postId, commentPage) => {
        try{
            const res = await axios.get(`http://localhost:8000/api/posts/${postId}/comments?page=${commentPage}` + '&per_page=5')

            get().setCommentsMeta({
                lastPage: res.data.meta.last_page
            })
            get().setComments(res.data.data)
        }catch(e){
            throw e
        }
    },

    storeComment: async (e, postId) => {
        e.preventDefault()

        const dataToSend = {
            content: get().comment.content
        }

        try{
            axios.defaults.withCredentials = true;
            axios.defaults.withXSRFToken = true;
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res = await axios.post( `http://localhost:8000/api/posts/${postId}/comments`
                , dataToSend)

            get().setComment({
                content: ''
            })
        }catch (e){
            console.log(e);
        }
    },

    updateComment: async (e, commentId, newContent) => {
        e.preventDefault()

        const dataToSend = {
            content: newContent
        }

        try{
            axios.defaults.withXSRFToken = true;
            axios.defaults.withCredentials = true;
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res =
                await axios.put(`http://localhost:8000/api/comments/${commentId}`, dataToSend)

            const newComment = res.data.data
            const newComments = get().comments.map( (c)=> c.id === commentId ? ({...c, content: newComment.content}) : c )
            get().setComments(newComments)
        }catch(e){
            console.log(e)
        }
    },

    deleteComment: async (commentId) => {
        try{
            axios.defaults.withXSRFToken = true;
            axios.defaults.withCredentials = true;
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            const res =
                await axios.delete(`http://localhost:8000/api/comments/${commentId}`)

            const newComments = get().comments.filter( (c)=> c.id !== commentId)
            get().setComments(newComments)
            console.log(res);
        }catch(e){
            console.log(e)
        }
    },

    setReactionComment: async (e, comment) => {
        const name = e.target.name
        e.stopPropagation()

        try{
            await axios.get('http://localhost:8000/sanctum/csrf-cookie')
            let res;

            if(name === 'like') res = await axios.put(`http://localhost:8000/api/comments/${comment.id}/likes`)
            else if(name === 'dislike') res = await axios.put(`http://localhost:8000/api/comments/${comment.id}/dislikes`)

            const newComment = res.data.data
            get().setComments( get().comments.map( (c) => c.id === comment.id ? newComment : c ) )
        }catch (e){
            console.error(e)
        }
    },

//     isOpenedReplies={openedCommentId === c.id}
// toggleReplies={ () => { setOpenedCommentId((isOpening) => isOpening ? c.id : null) }}

    isOpenedReplies: (commentId) => {
        return get().openedCommentId === commentId
    },

    toggleReplies: (isOpening, commentId) => {
        get().setOpenedCommentId(isOpening ? commentId : null)
    }
}) )