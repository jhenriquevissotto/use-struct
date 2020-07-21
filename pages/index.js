// import { useScaffold } from 'use-struct'
// import useStruct from 'use-struct'
import { useScaffold } from '../index'
import useStruct from '../index'


// external libs
import produce from 'immer'
import RenderJson from 'react-json-pretty'


// ======== EXAMPLE PAGE ======== //
export default () => {
    

    // =============================================================================== //  
    // ================================ GLOBAL STRUCT ================================ //  
    // =============================================================================== //  
    // call the root struct provided by <ScaffoldProvider />
    const { GeometricCalculator, ForeignData } = useScaffold()


    
    // ============================================================================== //  
    // ================================ LOCAL STRUCT ================================ //  
    // ============================================================================== //  

    const AdditionModule = useStruct({
        // ======== metadata ======== //
        // uncomment the two lines below for persist this struct in local storage
        // key: 'ADDITION_MODULE',
        // pst: true,

        // ======== state ======== //
        val: {
            description: 'This is the Addition Module',
            counter: 0,
        },

        // ======== reducer ======== //
        set: ({ val }) => ({
            increment: () => produce(val, val => {
                val.counter++
            }),
            counterBy: counter => produce(val, val => {
                val.counter = counter
            }),
        }),

        // ======== callbacks ======== //
        act: ({ val, set }) => [{
            addWithDiscount: (increment, discount) => {
                return set.counterBy((val.counter + increment)*discount)
            }
        }, [val]] // update all callbacks whenever state changes
    })
    

    const SubtractionModule = useStruct({
        // ======== metadata ======== //
        // uncomment the two lines below for persist this struct in local storage
        // key: 'SUBTRACTION_MODULE',
        // pst: true,

        // ======== state ======== //
        val: {
            description: 'This is the Subtraction Module',
            counter: 100,
        },

        // ======== reducer ======== //
        set: ({ val }) => ({
            decrement: () => produce(val, val => {
                val.counter--
            }),
            counterBy: counter => produce(val, val => {
                val.counter = counter
            }),
        }),

        // ======== callbacks ======== //
        act: ({ val, set }) => [{
            subWithDiscount: (increment, discount) => {
                return set.counterBy((val.counter - increment)*discount)
            }
        }, [val]] // update all callbacks whenever state changes
    })


    const ArithmeticCalculator = useStruct({
        // ======== metadata ======== //
        key: 'ARIGHMETIC_CALCULATOR', 

        // ======== children ======== //
        str: {
            AdditionModule,
            SubtractionModule,
        },
        
        // ======== state ======== //
        val: {
            description: 'This is the Arithmetic Calculator',
        },

        // ======== selectors ======== //
        set: ({ val }) => ({
            sayHello: () => produce(val, val => {
                val.description = 'Hello World! :)'
            }),
        }),

        // ======== selectors ======== //
        get: ({ str }) => [{
            additionCounter: () => str.AdditionModule.counter,
            subtractionCounter: () => str.SubtractionModule.counter,
        }, [str.AdditionModule.val, str.SubtractionModule.val]], // update all selectors whenever children states changes
        
        // ======== callbacks ======== //
        act: ({ str }) => [{
            incrementAndDecrementAllCounters: () => {
                str.AdditionModule.set.increment()
                str.SubtractionModule.set.decrement()
            },
        }, [str.AdditionModule.val, str.SubtractionModule.val]]
    })


    // ======================================================================== //  
    // ================================ RENDER ================================ //  
    // ======================================================================== //  
    return (
        <div>
            {/* ================================================ */}
            {/* ================ GLOBAL STRUCTS ================ */}
            {/* ================================================ */}
            <h1>GLOBAL STRUCT (from Scaffold)</h1>
            <h2>Description: {GeometricCalculator.description}</h2>
            <h3>Multiplier counter: {GeometricCalculator.get.multCounter()}</h3>
            <h3>Divisor counter: {GeometricCalculator.get.divCounter()}</h3>

            <button onClick={() => GeometricCalculator.set.decrement()} >Decrement multiplier counter</button><br />
            <button onClick={() => GeometricCalculator.set.increment()} >Increment divisor counter</button><br />


            <br />
            <br />
            <h2>Description: {ForeignData.description}</h2>
            <h3>State:</h3>
            <RenderJson data={ForeignData.val} />

            <button onClick={() => ForeignData.fetchData()} >Fetch</button>





            <br />
            <hr />
            {/* =============================================== */}
            {/* ================ LOCAL STRUCTS ================ */}
            {/* =============================================== */}
            <h1>LOCAL STRUCTS</h1>
            
            {/* ======== DISPLAY ======== */}
            <h2>Description: {ArithmeticCalculator.description}</h2>
            <h3>Addition counter: {ArithmeticCalculator.get.additionCounter()}</h3>
            <h3>Subtraction counter: {ArithmeticCalculator.get.subtractionCounter()}</h3>


            {/* ======== BUTTONS ======== */}
            <button onClick={() => ArithmeticCalculator.set.sayHello()}>Say hello</button><br />
            <br />
            <button onClick={() => AdditionModule.set.increment()}>Increment addition counter</button><br />
            <button onClick={() => SubtractionModule.set.decrement()}>Decrement subtraction counter</button><br />
            <br />
            <button onClick={() => AdditionModule.addWithDiscount(2, 0.95)}>Add with discount</button><br />
            <button onClick={() => SubtractionModule.subWithDiscount(2, 0.95)}>Sub with discount</button><br />
            <br />
            <button onClick={() => ArithmeticCalculator.incrementAndDecrementAllCounters()}>Increment and decrement all counters</button><br />

        </div>
    )
}