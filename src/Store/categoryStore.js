import {create} from 'zustand';
import axios from "axios";
import {ROUTES} from "../routes/Routes.js";

export const useCategoryStore = create((set, get) => ({
    categories: [],

    setCategories: newCategories => set(() => ({categories: newCategories})),

    getCategories: async () => {
        try{
            const res = await axios.get(ROUTES.HOST + '/categories' + '?per_page=100')

            get().setCategories(res.data.data)
        }catch (error){
            throw error
        }
    }
}))