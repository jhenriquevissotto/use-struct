// import { useContext } from 'react'


// export default function createScaffoldHook(ScaffoldContext) {
//     return () => useContext(ScaffoldContext)
// }


var { useContext } = require('react')


function createScaffoldHook(ScaffoldContext) {
    return () => useContext(ScaffoldContext)
}

module.exports = { createScaffoldHook }