const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env' });



const sendMail = (name, email, phone, subject, message, type) => {

    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.Email,
            pass: process.env.Pass,
        }
    });

    return new Promise((resolve, reject) => {
        let htmlContent;

        if (type === "contact") {
            htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                    <div style="background-color: #f4f7f8; padding: 10px;">
                        <div style="max-width: 800px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <header style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
                                <h1 style="margin: 0;">New Contact Us Form Submission</h1>
                            </header>
                            <div style="padding: 20px; color: #333333; line-height: 1.6;">
                                <p>A new message has been received through the contact form:</p>
                                <div style="margin: 20px 0;">
                                    <div style="margin-bottom: 10px;">
                                        <strong>Name:</strong> <span>${name}</span>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <strong>Email:</strong> <span>${email}</span>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <strong>Phone:</strong> <span>${phone}</span>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <strong>Subject:</strong> <span>${subject}</span>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <strong>Message:</strong> <span>${message}</span>
                                    </div>
                                </div>
                                <p style="margin-top: 20px;">Please respond to the inquiry at your earliest convenience.</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>`;
        } else if (type === "newsletter") {
            htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                    <div style="background-color: #f4f7f8; padding: 10px;">
                        <div style="max-width: 800px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <header style="background-color: #28a745; color: #ffffff; padding: 20px; text-align: center;">
                                <h1 style="margin: 0;">New Newsletter Subscription</h1>
                            </header>
                            <div style="padding: 20px; color: #333333; line-height: 1.6;">
                                <p>A new subscriber has joined the newsletter:</p>
                                <div style="margin: 20px 0;">
                                    <div style="margin-bottom: 10px;">
                                        <strong>Name:</strong> <span>${name}</span>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <strong>Email:</strong> <span>${email}</span>
                                    </div>
                                </div>
                                <p style="margin-top: 20px;">Make sure to welcome them and provide the latest updates!</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>`;
        }

        const mailOptions = {
            from: process.env.Email,
            to: process.env.ReceiveEmail, // Send to admin instead of the user
            subject: type === "contact" ? "New Contact Us Submission" : "New Newsletter Subscription",
            html: htmlContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject({
                    status: 'error',
                    message: 'Email could not be sent. Please try again later.',
                    error: error.message, // Include error message for debugging purposes
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
