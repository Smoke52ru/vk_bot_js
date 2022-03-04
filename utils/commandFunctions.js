export const makeCommandArray = (prefixesArr, commandWordsArr) => {
    return prefixesArr.map(pref => commandWordsArr.map(word => pref + word))
        .flat(1)

}
export const expandCommandsObject = (commandsObj, prefixesArr) => {
    return Object.keys(commandsObj).reduce((acc, command) => {
        acc[command] = makeCommandArray(prefixesArr, commandsObj[command])
        return acc
    }, {})
}
