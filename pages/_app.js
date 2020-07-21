// import { ScaffoldProvider } from 'use-struct'
import { ScaffoldProvider } from '../index'


// the root struct
import struct from '../model/struct'



// ================ ROOT APP ================ //
export default function App({ Component, initialProps }) {
    return (
        <ScaffoldProvider struct={struct} >
            <Component {...initialProps} />
        </ScaffoldProvider>
    )
}



// ===================================================== //
// ================ NEXT INITIAL CONFIG ================ //
// ===================================================== //
App.getInitialProps = async ({ Component, ctx }) => {
    let initialProps = {}
    
    if (Component.getInitialProps) {
        initialProps = await Component.getInitialProps({ ctx })
    }

    return ({ initialProps })
}