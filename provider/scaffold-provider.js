// import ScaffoldContext from '../context'

var { ScaffoldContext } = require('../context')


function ScaffoldProvider({ children, struct }) {
    
    const Struct = struct()
    
    return (
        <ScaffoldContext.Provider value={Struct} >
            {children}
        </ScaffoldContext.Provider>
    )
}

module.exports = { ScaffoldProvider }