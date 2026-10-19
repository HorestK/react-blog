import {create} from 'zustand'

export const usePostFilterStore = create( (set, get) => ({
    postFilter: {
        title: '',
        content: '',
        category_id: '',
    },

    setPostFilter: newPostFilter => set( () => ({postFilter: newPostFilter}) ),

    handlePostFilter: (e) => {
        const name = e.target.name;
        const value = e.target.value;

        get().setPostFilter({...get().postFilter, [name]: value})

        if(name === 'category_id') return value
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
            else if(key !== 'category_id') currentSearchParams.set(key, value)
        })

        setSearchParams(currentSearchParams)
        closeMenu()
    }
}) )