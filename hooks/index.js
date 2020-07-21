// import useStruct from './use-struct'
// import createScaffoldHook from './create-scaffold-hook'
// import useScaffold from './use-scaffold'

// export default useStruct
// export { useScaffold, createScaffoldHook }


var { useStruct } = require('./use-struct') 
var { createScaffoldHook } = require('./create-scaffold-hook')
var { useScaffold } = require('./use-scaffold')

module.exports = { useStruct, useScaffold, createScaffoldHook }