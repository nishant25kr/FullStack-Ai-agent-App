import nodemailer, { createTransport } from 'nodemailer'

export const sendMail = async (to, from, text) => {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS,
            }
        })

        const info = await transporter.sendMail({
            from: '"Inngest TMS',
            to,
            subject,
            text,
        });
        console.log("Message sent:", info.messageId)
        return info

    } catch (error) {
        console.log("Mail error:", error.message)
        throw error
    }
}