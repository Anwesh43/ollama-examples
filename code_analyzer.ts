import { writeFileSync } from "fs";
import ollama from "ollama";
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
const CodeOutput = z.object({
    code: z.string(),
    expalantion: z.string(),
})
const fileExtension: Record<string, string> = {
    'javascript': 'js',
    'typescript': 'ts',
    'python': 'py',
    'kotlin': 'kt',
    'java': 'java',
    'golang': 'go'
}
console.log("FORMAT", zodToJsonSchema(CodeOutput))
const getCodeInput = async (problem: string, language: string) => {
    const response = await ollama.chat({
        model: 'coding_model',
        messages: [
            {
                role: "system",
                content: "You are a helpful coding assistant you should always respond to user with a structured json with code part being in `code` key and explanation part in `explanation` part",
            },
            {
                role: "user",
                content: `Write a program in ${language} for following problem statement : ${problem}`
            }
        ],
        format: zodToJsonSchema(CodeOutput),
    })
    const codeOutputObj = CodeOutput.parse(JSON.parse(response.message.content))
    console.log("CODE_OUTPUT", codeOutputObj.code.replace(/\`/g, ''))
    writeFileSync(`program.${fileExtension[language]}`, Buffer.from(codeOutputObj.code))

}

if (process.argv.length >= 4) {
    const language = process.argv[2]
    const problem = process.argv.splice(3, process.argv.length).join(" ").trim()
    console.log("LANGUAGE", language, "PROBLEM", problem)

    getCodeInput(problem, language)
}