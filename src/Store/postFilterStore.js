import {create} from 'zustand'
import axios from "../axios.js";
import {ROUTES} from "../routes/Routes.js";
import {generatePath} from "react-router-dom";

export const usePostFilterStore = create( (set, get) => ({
    postFilter: {
        title: '',
        content: '',
        category: '',
        user_name: '',
    },

    setPostFilter: newPostFilter => set( () => ({postFilter: newPostFilter}) ),

    handlePostFilter: (e) => {
        const name = e.target.name;
        const value = e.target.value;

        // console.log('name: ' + name + '; value: ' + value)

        get().setPostFilter({...get().postFilter, [name]: value})
    },

    setPostFilterOnURL: async (
        e,
        searchParams,
        setSearchParams,
        closeMenu
    ) => {
        e.preventDefault()

        const newParams = get().postFilter
        const currentSearchParams = new URLSearchParams(searchParams)

        Object.entries(newParams).forEach( ([key, value]) => {
            if(value === '' || value === null || value === undefined) currentSearchParams.delete(key)
            else currentSearchParams.set(key, value)
        })

        setSearchParams(currentSearchParams)
        closeMenu()
    }
}) )