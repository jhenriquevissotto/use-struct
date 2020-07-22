
#  Manage local and global states with one hook.
## Group States, Reducers, Selectors and Callbacks in a Struct (like a Class) and keep your code organized.
### Works globaly too (like Redux).

[Follow me on instagram! =)](https://www.instagram.com/jhenrique.vissotto)

<br />

------ Main features: -------
1. Simple and intuitive syntax (val, get, set, act).
2. Easy persistence.
3. Parent and children logic.
4. Extension and inheritance.
5. Context API.
6. Natural source code for JS and React (made with functions and Hooks).
7. Free of useEffects (side effects doesn't work in SSR).

<br />

------ Disclaimer: -----
- No TypeScript yet (sorry).
- useStruct is essentially a hook, so it will not work in Next's getInitialProps.
- Debounce and throttle effects doesn't work in selectors and callbacks too.
- In Redux a action can dispatch many others actions and modify the state multiple times sequentially. But this is impossible in useStruct. By definition a hook can modify the state only one time when called. Keep it in mind.


### Overview:

```javascript
// yarn add use-struct immer -D

import useStruct from 'use-struct'
import produce from 'immer'


const Calculator = useStruct({
    // ======== state ======== //
    val: {
        greetings: 'Hello World from first struct! :)',
        counter: 0,
    },
            

    // ======== selectors ======== //
    get: ({ val, get }) => [{
        addedCounter:       additive    => val.counter + additive,
        multipliedCounter:  multiplier  => val.counter * multiplier,
    }, [val.counter]],
    

    // ======== reducer ======== //
    set: ({ val, get }) => ({
        counter: payload => produce(val, val => {
            val.counter = payload
        }),
        increment: () => produce(val, val => {
            val.counter++
        }),
        decrement: () => produce(val, val => {
            val.counter--
        }),
    }),


    // ======== callbacks ======== //
    act: ({ val, get, set, act }) => [{
        addBy:    pld => set.add(pld),
        subBy:    pld => set.sub(pld),
        sayHello: () => {
            alert(val.greetings)
        },
    }, [val.counter]],
})
```

### In component: 

```javascript
export default function Component() {

    // like a class
    const Calculator = useStruct({ ...inputs })

    return (
        <div>
            {/* ======== STATE ======== */}
            <h1>Greetings: {Calculator.greetings}</h1>
            <h2>Current counter: {Calculator.counter}</h2>
            
            <br />
            
            {/* ======== SELECTORS ======== */}
            <h3>Added counter by 3: {Calculator.get.addedCounter(3)}</h3><br />
            <h3>Multiplied counter by 2: {Calculator.get.multipliedCounter(2)}</h3><br />
            
            <br />
            
            {/* ======== REDUCER ======== */}
            <button onClick={() => Calculator.set.increment()} >Increment</button><br />
            <button onClick={() => Calculator.set.decrement()} >Decrement</button><br />
            
            <br />
            
            {/* ======== CALLBACKS ======== */}
            <button onClick={() => Calculator.addBy(4)} >Add counter by 4</button><br />
            <button onClick={() => Calculator.subBy(2)} >Sub counter by 2</button><br />

        </div>
    )
}
```

# Examples:

### 1) Fetching data from an API

```javascript
// yarn add use-struct immer axios react-json-pretty -D

import useStruct from 'use-struct'
import produce from 'immer'
import axios from 'axios'
import RenderJson from 'react-json-pretty'


export default function Component() {
    
    // ================ structs ================ //
    const ForeignData = useStruct({
        // ======== state ======== //
        val: {
            description: 'Fetch data from API', 
            data: [],
        },

        // ======== reducer ======== //
        set: ({ val }) => ({
            data: pld => produce(val, val => {
                val.data.push(...pld)
            })
        }),
        
        // ======== callbacks ======== //
        act: ({ val, set }) => [{
            fetchData: () => {
                const call = axios.get('https://jsonplaceholder.typicode.com/todos')

                call.then(({ data }) => {
                    set.data(data)
                }).catch(error => {
                    console.error(error)
                })
            },
        }, [val]]
    })

    // ================ render ================ //
    return (
        <div>
            {/* ======== STATE ======== */}
            <h1>Description: {ForeignData.description}</h1>
            <RenderJson data={ForeignData.val} />

            {/* ======== CALLBACKS ======== */}
            <button onClick={() => ForeignData.fetchData()} >Fetch data</button>
        </div>
    )
}
```

### 2) ** New recent features: `use` for hooks and `efc` for effects. **

Such that constructor of a Class, the useStruct can invoke initial hooks too and provide them by prefix `.use`.
And even more, finally you can put side effects (such that useEffect) for react to changes of state.

Example:

```javascript
export default function Componen() {

    // ================ structs ================ //
    const Calculator = useStruct({
        // ======== hooks ======== //
        // instance hooks here and call them by prefix .use 
        use() {
            const [counter, setCounter] = useState(100)
    
            return ({ counter, setCounter })
        },
        
        // ======== selectors ======== //
        get: ({ use }) => [{
            multipliedCounter: multiplier => use.counter * multiplier
        }],
        
        // ======== callbacks ======== //
        act: ({ use }) => [{
            increment() {
                use.setCounter(x => x + 1)
            }
        }],

        // ======== effects ======== //
        // put the side effects here
        efc({ use }) {
            // print a log whenever the useState's counter is changed
            useEffect(() => {
                console.log('Counter changed. New value is:', use.counter)
            }, [use.counter])
        }
    })

    // ================ render ================ //
    return (
        <div>
            {/* ======== HOOKS ======== */}
            <h1>Counter: {Calculator.counter}</h1>

            {/* ======== CALLBACKS ======== */}
            <button onClick={() => Calculator.increment()} >increment</button>
        </div>
    )
}
```


### 3) Consult more examples in `./models` and `./pages`  folders  in the source code.
Clone the repository and test it immediately with `yarn dev` in `http://localhost:3000`.


# Bonus features:

### 1) Global structs

The library provides two extras resources: 
- `<ScaffoldProvider />` component.
- And `useScaffold()` hook.

"Scaffold" is just a alias for "Global Struct". These resoucers are a implementation of the `<Context.Provider />` and `useContext()`.

The `value` provided by `<ScaffoldProvider />` is a root instance of the `useStruct()` hook. This instance can be recovered by any component in the application using `useScaffold()`.

Implements it in 3 steps:

First, in the `./store` folder, create a function that return a instance of `useStruct()` hook.

```javascript
import useStruct from 'use-struct'

// the root struct
export default function Struct() {
    return useStruct({
        // ======== state ======== //
        val: {
            greetings: 'Hello World! :)'
        },
    })
}
```

Second. Wrap your application with the `<ScaffoldProvider struct={struct} />` passing the function above for `struct` attribute: See:

```javascript
import { ScaffoldProvider } from 'use-struct'

// the root struct
import struct from '../store/struct.js'

export default function ContainerApp() {
    return (
        <ScaffoldProvider struct={struct} >
            <RootApp />
        </ScaffoldProvider>
    )
}

```

Third. Recovery the `useStruct()` instance in some component with the `useScaffold()`.

```javascript
import { useScaffold } from 'use-struct'

export default function SomeComponent() {

    // the root struct
    const Struct = useScaffold()

    return (
        <div>
            <h1>Greetings: {Struct.greetings}</h1>
        </div>
    )
}
```

### 2) Memorizing and updating Selectors and Callbacks

Such that `useMemo `and `useCallback`, selectors `get` and callbacks `act` can be memorized too. Just add an array of dependencies after definitions.

```javascript
const Calculator = useStruct({
    // ======== state ======== //
    val: {
        counter: 123456,
    },
            
    // ======== selectors ======== //
    get: ({ val }) => [{
        calculatedCounter: () => veryVerySlowFoo(val.counter),
    }, [val.counter]], // all selectors will be recalculated whenever counter state changes.
    

    // ======== callbacks ======== //
    act: ({ get }) => [{
        logCalculatedCounter: () => {
            console.log('new value:'. val.greetings)
        },
    }, [get.calculatedCounter]], // all callbacks will be updated whenever that calculatedCounter selector changes.
})
```
If none dependencies array was added all selectors and callbacks will react at each change of state.

### 3) Wrapping others structs

A struct can wrap another and all properties and methods of the wrapred structs will are avaliable inside and outside for the wraper struct. See:

```javascript
const AdditionModule = useStruct({
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
    }),
})
```


```javascript
const SubtractionModule = useStruct({
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
    }),
})
```

####  Wrapped structs inside of the wrapper

You can access the wrapped structs by prefix `.str`.
- `str.AdditionModule.blabla`
- `str.SubtractionModule.blabla`

```javascript
const Calculator = useStruct({
    // ======== children ======== //
    str: {
        AdditionModule,
        SubtractionModule,
    },
    
    // ======== state ======== //
    val: {
        description: 'This is the Calculator Struct',
    },

    // ======== selectors ======== //
    get: ({ str }) => [{
        additionCounter: () => str.AdditionModule.counter,
        subtractionCounter: () => str.SubtractionModule.counter,
    }, [str.AdditionModule.val, str.SubtractionModule.val]],
    
    // ======== callbacks ======== //
    act: ({ str }) => [{
        incrementAndDecrementAllCounters: () => {
            str.AdditionModule.set.increment()
            str.SubtractionModule.set.decrement()
        },
    }, [str.AdditionModule.val, str.SubtractionModule.val]]
})
```

#### Wrapped structs outside of the wrapper:

You can access the wrapped structs like as child property.

- `Calculator.AdditionModule.blabla`
- `Calculator.SubtractionModule.blabla`


```javascript
export default function Component() {

    const SubtractionModule = useStruct({ ...inputs })
    const AdditionModule = useStruct({ ...inputs })
    
    const Calculator = useStruct({ 
        str: {
            AdditionModule,
            SubtractionModule,
        },
        ...inputs
    })

    return (
        <div>
            {/* ======== STATES ======== */}
            <h1>Description: {Calculator.description}</h1>

            <h3>Addition counter: {Calculator.AdditionModule.counter}</h3>
            <h3>Subtraction counter: {Calculator.SubtractionModule.counter}</h3>


            {/* ======== SELECTORS ======== */}
            <h3>Addition counter: {Calculator.get.additionCounter()}</h3>
            <h3>Subtraction counter: {Calculator.get.subtractionCounter()}</h3>


            {/* ======== CALLBACKS ======== */}
            <button onClick={() => Calculator.AdditionModule.set.increment()} >Increment</button>
            <button onClick={() => Calculator.SubtractionModule.set.decrement()} >Decrement</button>

            <button onClick={() => Calculator.incrementAndDecrementAllCounters()} >
                Increment and decrement all counters
            </button>
        </div>
    )
}
```

### 4) `str, val, get, set, act` are as a alias for `this`

In a `Class` others properties and methods can be accessed by prefix `this`. Similarly in a struct sibling properties and methods can be accessed by prefixes `str, val, get, set, act`.

See this full example: 
```javascript
const Struct = useStruct({
    // ======== children ======== //
    str: {
        ...blabla
    },

    // ======== state ======== //
    val: {
        ...blabla
    },
            
    // ======== getters ======== //
    get: ({ str, val, get }) => [{
        ...blabla
    }],
    
    // ======== reducer ======== //
    set: ({ str, val, get, set }) => ({
        ...blabla
    }),

    // ======== callbacks ======== //
    act: ({ str, val, get, set, act }) => [{
        ...blabla
    }],
})
```




### 5) Persistence

The state of each `useStruct` can be easy persisted in `local storage` adding a `key: 'STRUCT_NAME'` and `pst: true` in the hook input. See:

```javascript
// persisted struct
const Struct = useStruct({

    key: 'STRUCT_NAME',
    pst: true,

    val: {
        greetings: 'Hello World from localStorage :)',
    },
})
```

### 6) Extending others structs
Similarly to a `Class` a struct can extend many others structs and all their properties and methods will are DIRECTLY available for the extended struct WITHOUT PREFIX `.str`.

```javascript
import useStruct from 'use-struct'
import produce from 'immer'

const AdditionModule = useStruct({
    val: {
        addCounter: 0,
    },
    set: ({ val }) => ({
        increment: () => produce(val, val => {
            val.addCounter++
        })
    }),
})

const SubtractionModule = useStruct({
    val: {
        subCounter: 100,
    },
    set: ({ val }) => ({
        decrement: () => produce(val, val => {
            val.subCounter--
        }),
    }),
})
```

#### Accessing the extended features by inside

```javascript
const Calculator = useStruct({ 
    ext: [
        AdditionModule,
        SubtractionModule
    ],
    get: ({ val }) => [{
        diffCounter: () => val.subCounter - val.addCounter
    }],
    act: ({ set }) => [{
        incrementAndDecrementAllCounters: () => {
            set.increment()
            set.decrement()
        },
    }],
})
```

#### Accessing the extended features by outside

```javascript
export default function Component() {

    // ================ structs ================ //
    const SubtractionModule = useStruct({ ...inputs })
    const AdditionModule = useStruct({ ...inputs })
    
    const Calculator = useStruct({ 
        ext: [
            AdditionModule,
            SubtractionModule
        ],
        ...inputs
    })
    
    
    // ================ render ================ //
    return (
        <div>
            {/* ======== STATES ======== */}
            <h1>Addition Module Counter: {Calculator.addCounter}</h1>
            <h1>Subtraction Module Counter: {Calculator.subCounter}</h1>
            
            <h2>Diff between subCounter and addCounter {Calculator.get.diffCounter()}</h2>

            {/* ======== CALLBACKS ======== */}
            <button onClick={() => Calculator.incrementAndDecrementAllCounters()} >
                increment and decrement all counters
            </button>
        </div>
    )
}
```

As explained, `set.increment()`, `set.decrement()`, `val.subCounter` and `val.addCounter` are directly invoked by inside. And `Calculator.addCounter` and `Calculator.subCounter` are too directly invoked by outside.

In both cases looks that these props and methods was created by `Calculator` struct, but actually, their was created by extended modules and inherited by Calculator struct.

#### ATTENTION:

** To extend a struct not means create a deepClone and modify their copy, but means TO CONTROL IT DIRECTLY. All change of state will put definitely in all original states, not in deepClones. **

** In extends operations occurs a merge of props and methods. So be careful for not create nothing with the same name. If a match occurs, the wraper struct will override the features of the extension structs . **


# Details:

### 1) Shortcuts
- States `val`,  Callbacks `act` and Wrapped Structs `str` can be accessed directly by view without the prefixs `.val`, `.act`, and `.str`. 
- But all selectors `get` and reducer `set` needs be prefixed (Inside or outside of the hook).

Example with Hello World:

```javascript
export default function Component() {

    const Calculator = useStruct({ ...inputs })

    return (
        <div>
            {/* ======== STATE ======== */}
            <h1>Greetings (without .val prefix): {Calculator.greetings}</h1>
            <h1>Greetings (with .val prefix): {Calculator.val.greetings}</h1>

            {/* ======== CALLBACKS ======== */}
            <button onClick={() => Calculator.sayHello()} >Say hello (without .act prefix)</button><br />
            <button onClick={() => Calculator.act.sayHello()} >Say hello (with .act prefix)</button><br />
        </div>
    )
}
```

### 2) Forbidden keywords

Don't create none props or methods with the following keywords: `key`, `pst`, `ext`, `str`, `val`, `get`, `set` and `act`. They are reserved keywords for this hook and if you do that, bad things can to happen.

