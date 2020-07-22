import useStruct from '../index'

import { useState, useEffect } from 'react'
import produce from 'immer'


export default () => {
    
    const Test = useStruct({
        use:() => {
            const [counter, setCounter] = useState(123)

            return ({ counter, setCounter })
        },
    })
    
    const Extensor = useStruct({
        ext: [Test],
        get: ({ use }) => [{
            multipliedCounter: () => use.counter * 10, 
        }]
    })


    
    const Wrapper = useStruct({
        str: { Test },
        act: ({ str }) => [{
            increment() {
                str.Test.setCounter(x => x + 1)
            }
        }],
        efc: ({ str }) => {
            useEffect(() => {
                console.log('counter:', str.Test.counter)
            }, [str.Test.counter])
        }
    })

    return (
        <div>
            <h1>Counter: {Extensor.use.counter}</h1>
            <h2>multiplied Counter: {Extensor.get.multipliedCounter()}</h2>
            <button onClick={() => Extensor.use.setCounter(x => x + 1)} >Increment</button>

            <hr />

            <h1>Counter: {Test.counter}</h1>
            <button onClick={() => Wrapper.increment()} >Increment</button>
        </div>
    )
}