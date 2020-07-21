// import useStruct from 'use-struct'
import useStruct from '../../index'

// external libs
import produce from 'immer'


export default function MultiplicationModule() {
    return useStruct({
        // ======== metadata ======== //
        // uncomment the two lines below for persist this struct in local storage
        // key: 'DIVISION_MODULE',
        // pst: true,

        // ======== state ======== //
        val: {
            description: 'This is the Multiplication Module',
            multCounter: 100,
        },

        // ======== reducer ======== //
        set: ({ val }) => ({
            decrement: () => produce(val, val => {
                val.multCounter--
            }),
            multCounter: pld => produce(val, val => {
                val.multCounter = pld
            }),
        }),

        // ======== callbacks ======== //
        act: ({ val, set }) => [{
            divideBy: (divisor) => {
                return set.multCounter(val.multCounter / divisor)
            }
        }, [val]]

    })
}