

export const toUpperCaseFirstChar = (value: string) => {
    const [firstLetter, ...restOfWord]= value;
    return firstLetter.toUpperCase() + restOfWord.join('');
}; 