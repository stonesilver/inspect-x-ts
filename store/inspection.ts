import {defineStore} from "pinia";

export const useInspection = defineStore({
    id: 'inspection',
    state: () => {
        return {
            test: 'Welcome to Pinia!'
        }
    }
})