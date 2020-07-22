// external libs
// import { useReducer } from 'react'
import { useState } from 'react'
import { useMemo } from 'react'
import { useLocalStorage } from 'react-use'
import { merge } from 'lodash'
// var pickDeep from 'deepdash/pickDeep'
// var omitDeep from 'deepdash/omitDeep'
import { pipe as Pipe } from 'ramda'
import fromEntries from 'fromentries'


// // external libs
// var { useReducer } = require('react')
// var { useState } = require('react')
// var { useMemo } = require('react')
// var { useLocalStorage } = require('react-use')
// var { merge } = require('lodash')
// // var pickDeep = require('deepdash/pickDeep')
// // var omitDeep = require('deepdash/omitDeep')
// var Pipe = require('ramda').pipe
// var fromEntries = require('fromentries')


// definitions
// const opts = {
//     onNotMatch: {
//         cloneDeep: true,
//         skipChildren: true,
//     },
// }


// functions
const _useMemo = (a, b) => useMemo(() => a, b)

const colOfObjToObj = (arr, col) => arr.map(p => p[col]).reduce((obj, props) => Object.assign(obj, props), {})
// const colOfArrToArr = (arr, col) => arr.map(p => p[col]).reduce((arr, items) => [...arr, ...items], [])



// ======== hook ======== //
function useStruct({
    key = null,
    pst = false,
    ext: extensions = [],
    str: structs    = {},
    use: hooks      = () => ({}),
    val: states     = {}, 
    set: setters    = () => ({}), 
    get: getters    = () => [{}], 
    act: actions    = () => [{}],
    efc: effects    = () => null,
}) {
    
    // ======== functions ======== //
    const withExtendedStr = structs => merge(colOfObjToObj(extensions,  'str'),     structs)
    const withExtendedUse = hooks   => merge(colOfObjToObj(extensions, 'use'),      hooks)
    const withExtendedVal = states  => merge([colOfObjToObj(extensions, 'val')],    states)
    const withExtendedGet = getters => merge([colOfObjToObj(extensions, 'get')],    getters)
    const withExtendedSet = setters => merge(colOfObjToObj(extensions,  'set'),     setters)
    const withExtendedAct = actions => merge([colOfObjToObj(extensions, 'act')],    actions)


    
    // ======== children ======== //
    const str = withExtendedStr(structs)
    


    // ======== hooks ======== //
    const use = withExtendedUse(hooks())


    
    // ======== state ======== //
    // var [val, dsp] = withExtendedVal(useReducer((stt, pld) => pld || stt, states))
    if (pst && key.length) {
        var [val, mod] = withExtendedVal(useLocalStorage(key, states))
    } else {
        var [val, mod] = withExtendedVal(useState(states))
    } 


    
    // ======== selectors ======== //
    const get = _useMemo(...(() => {
        // const str   = omitDeep(withExtendedStr(structs), ['set', 'act', 'key', 'pst', 'ext'], opts)
        const [get] = withExtendedGet(getters({ str, use, val }))
        return        withExtendedGet(getters({ str, use, val, get }))
    })())
    
    
    // ======== reducer ======== //
    const set = (() => {
        const pipe = Pipe(
            col => Object.entries(col),
            // catch the return of each settter and put it setState
            col => col.map(([key, foo]) => [key, pld => mod(stt => foo(pld) || stt)]), // for useReducer, use this: pld => dsp(foo(pld)) 
            col => fromEntries(col), 
        )
        // const str = omitDeep(withExtendedStr(structs), ['act', 'key', 'pst', 'ext'], opts)
        const set = pipe(withExtendedSet(setters({ str, use, val, get })))
        return      pipe(withExtendedSet(setters({ str, use, val, get, set })))
    })()
        

    // ======== callbacks ======== //
    const act = _useMemo(...(() => {
        // const str   = omitDeep(withExtendedStr(structs), ['key', 'pst', 'ext'], opts)
        const [act] = withExtendedAct(actions({ str, use, val, get, set }))
        return        withExtendedAct(actions({ str, use, val, get, set, act }))
    })())
    


    // ======== effects ======== //
    effects({ str, use, val, get, set, act })

    


    // ======== interface ======== //
    return ({ 
        // props and methods
        str, use, val, set, get, act,

        // shortcuts
        ...str, ...use, ...val, ...act,
    })
}


export default useStruct
// module.exports = { useStruct }




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