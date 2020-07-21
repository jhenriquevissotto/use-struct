// import { useReducer } from 'react'
import { useState } from 'react'
import { useMemo } from 'react'
import fromEntries from 'fromentries'
import { pipe as Pipe } from 'ramda'
import omitDeep from 'deepdash/omitDeep'
import { useLocalStorage } from 'react-use'
import { merge } from 'lodash'


const _useMemo = (a, b) => useMemo(() => a, b)


const colOfObjToObj = (arr, col) => arr.map(p => p[col]).reduce((obj, props) => Object.assign(obj, props), {})
// const colOfArrToArr = (arr, col) => arr.map(p => p[col]).reduce((arr, items) => [...arr, ...items], [])



// ======== hook ======== //
export default function useStruct({
    key = null,
    pst = false,
    ext: extensions = [],
    str: structs    = {},
    val: states     = {}, 
    set: setters    = () => ({}), 
    get: getters    = () => [{}], 
    act: actions    = () => [{}],
}) {
    
    // ======== functions ======== //
    const withExtendedStr = structs => merge(colOfObjToObj(extensions,  'str'),  structs)
    const withExtendedVal = states  => merge([colOfObjToObj(extensions, 'val')], states)
    const withExtendedGet = getters => merge([colOfObjToObj(extensions, 'get')], getters)
    const withExtendedSet = setters => merge(colOfObjToObj(extensions,  'set'),  setters)
    const withExtendedAct = actions => merge([colOfObjToObj(extensions, 'act')], actions)



    // ======== children ======== //
    const str = withExtendedStr(structs)


    
    // ======== state ======== //
    // var [val, dsp] = withExtendedVal(useReducer((stt, pld) => pld || stt, states))
    if (pst && key.length) {
        var [val, mod] = withExtendedVal(useLocalStorage(key, states))
    } else {
        var [val, mod] = withExtendedVal(useState(states))
    } 


    
    // ======== selectors ======== //
    const get = _useMemo(...(() => {
        const str   = omitDeep(withExtendedStr(structs), ['set', 'act', 'key', 'pst', 'ext'])
        const [get] = withExtendedGet(getters({ str, val }))
        return        withExtendedGet(getters({ str, val, get }))
    })())
    
    
    // ======== reducer ======== //
    const set = (() => {
        const pipe = Pipe(
            col => Object.entries(col),
            // catch the return of each settter and put it setState
            col => col.map(([key, foo]) => [key, pld => mod(stt => foo(pld) || stt)]), // for useReducer, use this: pld => dsp(foo(pld)) 
            col => fromEntries(col), 
        )
        const str = omitDeep(withExtendedStr(structs), ['act', 'key', 'pst', 'ext'])
        const set = pipe(withExtendedSet(setters({ str, val, get })))
        return      pipe(withExtendedSet(setters({ str, val, get, set })))
    })()
        

    // ======== callbacks ======== //
    const act = _useMemo(...(() => {
        const str   = omitDeep(withExtendedStr(structs), ['key', 'pst', 'ext'])
        const [act] = withExtendedAct(actions({ str, val, get, set }))
        return        withExtendedAct(actions({ str, val, get, set, act }))
    })())
    


    // ======== interface ======== //
    return ({ 
        // props and methods
        str, val, set, get, act,

        // shortcuts
        ...str, ...val, ...act,
    })
}


// options for pickDeep:
// const opts = {
//     onMatch: {
//         cloneDeep: true,
//         skipChildren: true,
//     },
// }



// const _useMemo = (obj, deps, opts) => useMemo(() => {
//     if (opts?.debounce || opts?.throttle) {
//         const [[key, val]] = Object.entries(opts)
        
//         switch (key) {
//             case 'debounce': return debounce(() => obj, val, { leading: true })()
//             case 'throttle': return throttle(() => obj, val)()
//             default:         return obj
//         }
//     } else return obj
// }, deps)