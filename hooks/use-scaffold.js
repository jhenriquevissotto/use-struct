import createScaffoldHook from './create-scaffold-hook'
import ScaffoldContext from '../context'

const useScaffold = createScaffoldHook(ScaffoldContext)

export default useScaffold



// var { createScaffoldHook } = require('./create-scaffold-hook')
// var { ScaffoldContext } = require('../context')

// var useScaffold = createScaffoldHook(ScaffoldContext)

// module.exports = { useScaffold }