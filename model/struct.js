// import useStruct from 'use-struct'
import useStruct from '../index'

// main structs
import geometricCalculator from './geometric-calculator'
import foreignData from './foreign-data'


// root struct
export default function Struct() {
    // init child structs
    const GeometricCalculator = geometricCalculator()
    const ForeignData = foreignData()
   
    
    return useStruct({
        // ======== metadata ======== //
        key: 'ROOT_STRUCT',
        
        // ======== children ======== //
        str: {
            GeometricCalculator,
            ForeignData,
        },
    })
}