import { promises as fs } from 'fs'

const letters = 'abcdefghijklmnopqrstuvwxyz'

async function readDictionary(fpath: string): Promise<string[]> {
    const data = await fs.readFile(fpath, { encoding: 'utf-8' })
    const wordLst = data.split('\n')
    return wordLst
}

async function writeSeqCnts(fpath: string, seqCnts: Map<string, number>) {
    await fs.writeFile(
        fpath,
        JSON.stringify(
            Object.fromEntries(
                seqCnts
            )
        )
    )
}

function calcSeqCnt(wordLst: string[], possSeq: string): number {
    const cnt = wordLst.reduce((accum, word) => {
        return accum + (word.includes(possSeq) ? 1 : 0)
    }, 0)
    return cnt
}

function addLetter(seqs: string[]): string[] {
    let newSeqs = []
    for (const seq of seqs) {
        for (const letter of letters) {
            newSeqs.push(seq + letter)
        }
    }
    return newSeqs
}

function buildSeqCnts(wordLst: string[], n: number): Map<string, number> {
    let seqs = ['']
    for (let i = 0; i < n; i++) {
        seqs = addLetter(seqs)
    }
    let seqCnts = new Map()
    for (const seq of seqs) {
        const cnt = calcSeqCnt(wordLst, seq)
        seqCnts.set(seq, cnt)
    }
    return seqCnts
}

async function main() {
    const wordLst = await readDictionary('./dictionary/popular.txt')
    const seqCnts = buildSeqCnts(wordLst, 2)
    await writeSeqCnts('./dictionary/two_let_cnts.json', seqCnts)
}

main()
