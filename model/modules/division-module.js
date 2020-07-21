// import useStruct from 'use-struct'
import useStruct from '../../index'

// external libs
import produce from 'immer'


export default function DivisionModule() {
    return useStruct({
        // ======== metadata ======== //
        // uncomment the two lines below for persist this struct in local storage
        // key: 'MULTIPLICATION_MODULE',
        // pst: true,

        // ======== state ======== //
        val: {
            description: 'This is the Division Module',
            divCounter: 1,
        },

        // ======== reducer ======== //
        set: ({ val }) => ({
            increment: () => produce(val, val => {
                val.divCounter++
            }),
            divCounter: pld => produce(val, val => {
                val.divCounter = pld
            }),
        }),

        // ======== callbacks ======== //
        act: ({ val, set }) => [{
            multiplyBy: (multiple) => {
                return set.divCounter(val.divCounter * multiple)
            }
        }, [val]]

    })
}