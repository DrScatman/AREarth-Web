import Vue from 'vue'
import Vuex from 'vuex'

import {
    Scene,
    //CubeTextureLoader,
    //sRGBEncoding,
} from 'three'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        selectedLocation: "",
        scene: new Scene(),
        locations: null,
    },
    getters: {
        locations: (state) => {
            return state.locations
        },
        selectedLocation: (state) => {
            return state.selectedLocation
        },
        scene: (state) => {
            return state.scene
        },
    },
    mutations: {
        setSelectedLocation: (state, loc) => {
            state.selectedLocation = loc
        },
        setLocations: (state, locs) => {
            state.locations = locs
        },
        setLocationCubemap: (state, payload) => {
            console.log(payload)
            let loc = payload['location']
            let urls = payload['urls']
            state.locations[loc]['urls'] = urls
            console.log(state.locations)
            /*
            let loader = new CubeTextureLoader();
            state.locations[loc]['cubemap'] = loader.load([
                urls[0],
                urls[1],
                urls[2],
                urls[3],
                urls[4],
                urls[5],
            ], () => {
                console.log("done")
                state.locations[loc]['cubemap'].encoding = sRGBEncoding
                console.log(state.locations)
            })
            */
        }
    },
})
