import { useContext } from 'react'


export default function createScaffoldHook(ScaffoldContext) {
    return () => useContext(ScaffoldContext)
}