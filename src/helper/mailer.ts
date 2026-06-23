import nodemailer from 'nodemailer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendEmail= async ({email, emailType, userID}:any)=>{
    try {
        const transporter = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        });

        const info = await transporter.sendMail({
            from: process.env.SMTP_USER, 
            to: email, 
            subject: emailType==='Verify'?"Email for verification":"Email for resetting password", 
            html: "<b>Hello world?</b>", 
        });
        return info

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        throw new Error(error.message)
    }
}