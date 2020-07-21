// import useStruct from 'use-struct'
import useStruct from '../index'

// others structs
import multiplicationModule from './modules/multiplication-module'
import divisionModule from './modules/division-module'



// root struct
export default function GeometricCalculator() {
    // init child structs
    const DivisionModule        = divisionModule()
    const MultiplicationModule  = multiplicationModule()
   
    
    return useStruct({
        // ======== metadata ======== //
        key: 'GEOMETRIC_CALCULATOR',

        // ======== extends ======== //
        ext: [
            MultiplicationModule,
            DivisionModule,
        ],
        // ======== state ======== //
        val: {
            description: 'This is the Geometric Calculator',
        },
        // ======== selectors ======== //
        get: ({ val }) => [{
            multCounter: () => val.multCounter,
            divCounter: () => val.divCounter,
        }, [val]]
    })
}