const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const PDFDocument = require("pdfkit")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const RATE_LIMIT_MESSAGE = "API rate limit reached for today. Please try again later or upgrade your plan."

function isRateLimitError(error) {
    const status = error?.status || error?.statusCode || error?.response?.status
    const message = error?.message || ""

    return status === 429 || /quota|resource_exhausted/i.test(message)
}

function toGeminiError(error) {
    if (isRateLimitError(error)) {
        const rateLimitError = new Error(RATE_LIMIT_MESSAGE)
        rateLimitError.status = 429
        return rateLimitError
    }

    return error
}

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        })

        return JSON.parse(response.text)
    } catch (error) {
        throw toGeminiError(error)
    }


}

function decodeHtml(value) {
    return value
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim()
}

function htmlToResumeBlocks(htmlContent) {
    const sanitizedHtml = htmlContent.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, "")
    const blocks = []
    const pattern = /<(h1|h2|h3|p|li|div)[^>]*>([\s\S]*?)<\/\1>/gi
    let match

    while ((match = pattern.exec(sanitizedHtml)) !== null) {
        const text = decodeHtml(match[2])
        if (!text) continue
        const tag = match[1].toLowerCase()
        blocks.push({ text, type: tag === "h1" ? "name" : tag === "h2" ? "section" : tag === "h3" ? "role" : tag === "li" ? "bullet" : "body" })
    }

    return blocks.length ? blocks : [{ text: decodeHtml(sanitizedHtml), type: "body" }]
}

function generateProfessionalResumePdf(htmlContent) {
    const blocks = htmlToResumeBlocks(htmlContent)

    return new Promise((resolve, reject) => {
        const document = new PDFDocument({
            size: "A4",
            margins: { top: 42, right: 52, bottom: 42, left: 52 },
            info: { Title: "Resume" }
        })
        const chunks = []

        document.on("data", (chunk) => chunks.push(chunk))
        document.on("end", () => resolve(Buffer.concat(chunks)))
        document.on("error", reject)

        blocks.forEach((block, index) => {
            if (block.type === "name") {
                document.font("Helvetica-Bold").fontSize(20).fillColor("#111827").text(block.text, { align: "center" })
                document.moveDown(0.2)
            } else if (block.type === "section") {
                if (document.y > 70) document.moveDown(0.7)
                document.font("Helvetica-Bold").fontSize(10).fillColor("#1d4ed8").text(block.text.toUpperCase(), { characterSpacing: 0.8 })
                document.moveDown(0.15)
                document.strokeColor("#bfdbfe").lineWidth(0.8).moveTo(document.page.margins.left, document.y).lineTo(document.page.width - document.page.margins.right, document.y).stroke()
                document.moveDown(0.35)
            } else if (block.type === "role") {
                document.font("Helvetica-Bold").fontSize(10.5).fillColor("#111827").text(block.text, { lineGap: 1 })
                document.moveDown(0.12)
            } else if (block.type === "bullet") {
                document.font("Helvetica").fontSize(9.5).fillColor("#1f2937").text(`-  ${block.text}`, { indent: 10, hangingIndent: 10, lineGap: 2 })
                document.moveDown(0.12)
            } else {
                document.font("Helvetica").fontSize(9.5).fillColor("#374151").text(block.text, { align: index < 3 ? "center" : "left", lineGap: 2 })
                document.moveDown(0.2)
            }
        })
        document.end()
    })
}

async function generatePdfFromHtml(htmlContent) {
    return generateProfessionalResumePdf(htmlContent)
    /*
    const text = htmlContent
        .replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, "")
        .replace(/<\/(p|div|h[1-6]|li|tr)>|<br\s*\/?>/gi, "\n")
        .replace(/<li[^>]*>/gi, "• ")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\n{3,}/g, "\n\n")
        .trim()

    return new Promise((resolve, reject) => {
        const document = new PDFDocument({
            size: "A4",
            margin: 50,
            info: { Title: "Tailored Resume" }
        })
        const chunks = []

        document.on("data", (chunk) => chunks.push(chunk))
        document.on("end", () => resolve(Buffer.concat(chunks)))
        document.on("error", reject)

        document.font("Helvetica-Bold").fontSize(18).text("Tailored Resume", { align: "center" })
        document.moveDown(0.75)
        document.strokeColor("#2563eb").lineWidth(1).moveTo(50, document.y).lineTo(545, document.y).stroke()
        document.moveDown(1)
        document.font("Helvetica").fontSize(10).fillColor("#111827").text(text, {
            align: "left",
            lineGap: 3
        })
        document.end()
    })
    */
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        The response should be a JSON object with a single field "html". Use one <h1> for the candidate name, a short contact <p>, <h2> section headings, <h3> for job/project titles, <p> for descriptions, and <ul><li> for achievements. Do not use tables, columns, inline styles, images, or a document title such as "Tailored Resume".
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. Use clear sections such as Summary, Experience, Projects, Skills, and Education.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(resumePdfSchema),
            }
        })

        const jsonContent = JSON.parse(response.text)
        return generatePdfFromHtml(jsonContent.html)
    } catch (error) {
        throw toGeminiError(error)
    }

}

module.exports = { generateInterviewReport, generateResumePdf, generatePdfFromHtml, isRateLimitError, RATE_LIMIT_MESSAGE }
