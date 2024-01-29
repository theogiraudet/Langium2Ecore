import {  EmptyFileSystem, Grammar, createLangiumGrammarServices } from "langium";
import { parseHelper } from "langium/test";

import path from "path";
import fs from 'fs-extra';


/**
 * Converts a Langium grammar's types to an Ecore model
 * @param grammarPath Path to the grammar file
 * @param outputPath Path to the output file, if not specified, the output file will be named after the grammar file
 * 
 * @throws Error if the grammarPath does not end with '.langium'
 * @throws Error if the file at grammarPath does not exist
 * @throws Error if the grammar contains lexer errors
 * @throws Error if the grammar contains parser errors
 */
export async function convertGrammarToEcore(grammarPath: string, outputPath: string | undefined) {
    if(!grammarPath.endsWith('.langium')) {
        throw new Error('File must be a Langium grammar')
    }
    if (!fs.existsSync(grammarPath)) {
        throw new Error(`File ${grammarPath} does not exist`)
    }
    if(!outputPath) {
        outputPath = path.parse(grammarPath).name + '.ecore'
    }
    const { grammar } = createLangiumGrammarServices(EmptyFileSystem);

    const grammarContent = fs.readFileSync(grammarPath, { encoding: 'utf-8' });
    const result = (await parseHelper<Grammar>(grammar)(grammarContent)).parseResult;
    
    if(result.lexerErrors?.length > 0) {
        throw new Error("Lexer errors found: " + result.lexerErrors.map(e => e.message).join("\n"))
    } else if(result.parserErrors?.length > 0) {
        throw new Error("Parser errors found: " + result.parserErrors.map(e => e.message).join("\n"))
    }
}



