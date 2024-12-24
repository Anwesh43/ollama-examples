import { readFileSync } from "fs"
import ollama from "ollama"
const getImageDescription = async (fileName: string, prompt: string) => {
    const fileStr = readFileSync(fileName, { encoding: 'base64' })
    const response = await ollama.chat({
        model: 'llama3.2-vision',
        messages: [
            {
                role: "user",
                images: [fileStr],
                content: prompt,
            }
        ]
    })
    console.log("RESPONSE", response.message.content)
}

if (process.argv.length >= 4) {
    console.log(process.argv.splice(3, process.argv.length).join(" ").trim())
    getImageDescription(process.argv[2], process.argv.splice(3, process.argv.length).join(" ").trim())
}