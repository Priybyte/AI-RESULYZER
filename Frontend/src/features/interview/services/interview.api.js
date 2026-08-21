import axios from "axios";

const api = axios.create({
    baseURL: "https://pri-rezulyzer-10082004.onrender.com/api",
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token") || localStorage.getItem("jwt")

    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile, roadmapDuration, roadmapUnit, technicalQuestionCount, behavioralQuestionCount }) => {

    const formData = new FormData()
    formData.append("jobDescription", jobDescription ?? "")
    formData.append("selfDescription", selfDescription ?? "")
    formData.append("roadmapDuration", roadmapDuration ?? 1)
    formData.append("roadmapUnit", roadmapUnit ?? "months")
    formData.append("technicalQuestionCount", technicalQuestionCount ?? 10)
    formData.append("behavioralQuestionCount", behavioralQuestionCount ?? 10)

    if (resumeFile instanceof File) {
        formData.append("resume", resumeFile, resumeFile.name)
    }

    const response = await api.post("/interview/", formData)

    return response.data

}


/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/interview/report/${interviewId}`)

    return response.data
}


/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/interview/")

    return response?.data
}

export const deleteInterviewReport = async (interviewId) => {
    const response = await api.delete(`/interview/${interviewId}`)

    return response.data
}


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        const response = await api.post(`/interview/resume/pdf/${interviewReportId}`, null, {
            responseType: "blob"
        })

        return response.data
    } catch (error) {
        if (error.response?.data instanceof Blob) {
            try {
                const payload = JSON.parse(await error.response.data.text())
                throw new Error(payload.message || "Unable to generate the resume PDF.")
            } catch (parseError) {
                if (parseError.message !== "Unexpected end of JSON input") throw parseError
            }
        }

        throw error
    }
}
