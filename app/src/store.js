import Vue from 'vue'
import Vuex from 'vuex'

import {
    sRGBEncoding,
} from 'three'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        //selected location by user for model location by location id
        selectedLocation: "",

        //object that bundles locations with a key of the id
        //to get name, description, urls, and texture
        locations: null,

    },
    getters: {
        locations: (state) => {
            return state.locations
        },
        selectedLocation: (state) => {
            return state.selectedLocation
        },
    },
    mutations: {
        setSelectedLocation: (state, loc) => {
            state.selectedLocation = loc
        },
        setLocations: (state, locs) => {
            state.locations = locs
        },
        setLocationUrls: (state, payload) => {
            let loc = payload['location']
            let urls = payload['urls']
            state.locations[loc]['urls'] = urls
        },
        setLocationCubemapTexture: (state, payload) => {
            let loc = payload['location']
            let texture = payload['texture']
            texture.encoding = sRGBEncoding
            state.locations[loc]['texture'] = texture
        },
        clearAll: (state) => {
            state.selectedLocation = "";
            state.locations = null;
        }
    },
})
