
export const capitalizeFirstLetterOfSentences = (names: string): string => {
    const nameList = names.split(' ');

    const newNames = nameList.map(name => {
        const trimmedName = name.trim();

        if (trimmedName.length > 0) {
            const [firstLetter, ...restOfWord]= trimmedName;
            let restOfWordLower = restOfWord.map(l => l.toLowerCase());

            return firstLetter.toUpperCase() + restOfWordLower.join('');
        }

        return name;
    });

    return newNames.join(' ');
};