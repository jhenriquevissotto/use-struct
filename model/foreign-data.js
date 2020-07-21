// import useStruct from 'use-struct'
import useStruct from '../index'

// external libs
import produce from 'immer'
import axios from 'axios'


// root struct
export default function ForeignData() {
    return useStruct({
        // ======== metadata ======== //
        // uncomment the two lines below for persist this struct in local storage
        // key: 'FOREIGN_DATA',
        // pst: true,

        // ======== state ======== //
        val: {
            description: 'Fetch data from API', 
            data: [],
        },

        // ======== reducer ======== //
        set: ({ val }) => ({
            data: ({ data }) => produce(val, val => {
                val.data = data
            })
        }),
        
        // ======== callbacks ======== //
        act: ({ val, set }) => [{
            fetchData: () => {
                const call = axios.get('https://jsonplaceholder.typicode.com/todos')

                call.then(({ data }) => {
                    set.data({ data })
                }).catch(error => {
                    console.error(error)
                })
            },
        }, [val]]
    })
}