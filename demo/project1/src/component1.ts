
const fn = () => {
    return {
        onCreated: () => {
            console.log('com1 created')
        },
        onMounted: () => {
            console.log('com1 onMounted')
        },
    }
}

export default fn