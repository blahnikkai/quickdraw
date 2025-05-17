enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
    DYNAMIC = "dynamic",
}

export function strToDifficulty(difficultyStr: string): Difficulty {
    console.log(difficultyStr.toUpperCase());
    const difficulty: Difficulty | undefined = Difficulty[difficultyStr.toUpperCase() as keyof typeof Difficulty];
    if(difficulty === undefined) {
        throw Error("string can't be converted to Difficulty");
    }
    return difficulty
}

export default Difficulty;