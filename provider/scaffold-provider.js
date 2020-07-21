import ScaffoldContext from '../context'

export default function ScaffoldProvider({ children, struct }) {
    
    const Struct = struct()
    
    return (
        <ScaffoldContext.Provider value={Struct} >
            {children}
        </ScaffoldContext.Provider>
    )
}