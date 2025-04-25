const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });

const sendMail = (name, email, username, password, subject, message, type) => {
    const transporter = nodemailer.createTransport({
        service : "gmail",
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === "true",
        requireTLS: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    });

    return new Promise((resolve, reject) => {
        let htmlContent;

        if (type === "Credentials") {
            htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                    <div style="background-color: #f4f7f8; padding: 20px;">
                        <div style="max-width: 700px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <header style="background-color: #2B00AC; color: #ffffff; padding: 20px; text-align: center;">
                                <h2 style="margin: 0;">Welcome to Wouessi Digital 🎉</h2>
                            </header>
                            <div style="padding: 20px; color: #333333; line-height: 1.6;">
                                <p>Dear <strong>${name}</strong>,</p>
                                <p>Congratulations on joining <strong>Wouessi Digital</strong>! We are thrilled to have you onboard.</p>
                                <p>Your login credentials for the employee portal are as follows:</p>
                                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                                    <p><strong>Username:</strong> ${username}</p>
                                    <p><strong>Password:</strong> ${password}</p>
                                    <p style="font-size: 12px; color: #555;">* Please change your password upon first login.</p>
                                </div>
                                <p>Click the button below to log in:</p>
                                <div style="text-align: center; margin: 20px 0;">
                                    <a href="https://www.wouessi.com/en/" style="background-color: #2B00AC; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login Now</a>
                                </div>
                                <p>If you have any questions, feel free to contact HR.</p>
                                <p>Best regards,</p>
                                <p><strong>Wouessi Digital | HR Team</strong></p>
                            </div>
                            <footer style="background-color: #2B00AC; color: #ffffff; padding: 10px; text-align: center; font-size: 12px;">
                                &copy; ${new Date().getFullYear()} Wouessi Digital. All rights reserved.
                            </footer>
                        </div>
                    </div>
                </body>
            </html>`;
        } else {
            htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                    <div style="background-color: #f4f7f8; padding: 20px;">
                        <div style="max-width: 700px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <header style="background-color: #2B00AC; color: #ffffff; padding: 20px; text-align: center;">
                                <h2 style="margin: 0;">${subject}</h2>
                            </header>
                            <div style="padding: 20px; color: #333333; line-height: 1.6;">
                                <p><strong>Name:</strong> ${name}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Phone:</strong> ${phone}</p>
                                <p><strong>Message:</strong> ${message}</p>
                                <p>Please respond at your earliest convenience.</p>
                            </div>
                            <footer style="background-color: #2B00AC; color: #ffffff; padding: 10px; text-align: center; font-size: 12px;">
                                &copy; ${new Date().getFullYear()} Wouessi Digital. All rights reserved.
                            </footer>
                        </div>
                    </div>
                </body>
            </html>`;
        }

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email, 
            subject: type === "Credentials" ? "Your Employee Login Credentials" : subject,
            html: htmlContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({
                    status: 'error',
                    message: 'Email could not be sent. Please try again later.',
                    error: error.message, 
                });
            } else {
                resolve({
                    status: 'success',
                    message: 'Email sent successfully!',
                    response: info.response,
                });
            }
        });
    });
};

module.exports = sendMail;