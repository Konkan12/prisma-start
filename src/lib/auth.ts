import "dotenv/config";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

/* -------------------- Mail Transporter -------------------- */
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // 587 = false
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
    },
});

/* -------------------- Better Auth Config -------------------- */
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    trustedOrigins: [process.env.APP_URL || "http://localhost:5000"],

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
        },
    },

    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },

    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, token }) => {
            try {
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

                const info = await transporter.sendMail({
                    from: '"Prisma Blog" <prisma@gmail.com>',
                    to: user.email,
                    subject: "Verify Your Email - Prisma Blog",
                    text: `Please verify your email by clicking this link: ${verificationUrl}`,
                    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .header { background-color: #4F46E5; padding: 30px; text-align: center; color: white; }
                .content { padding: 40px 30px; text-align: center; line-height: 1.6; color: #334155; }
                .button { display: inline-block; padding: 14px 30px; background-color: #4F46E5; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: 600; margin-top: 25px; }
                .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0;">Prisma Blog</h1>
                </div>
                <div class="content">
                    <h2>ইমেইল ভেরিফিকেশন</h2>
                    <p>হ্যালো <strong>${user.name}</strong>,</p>
                    <p>Prisma Blog-এ যোগ দেওয়ার জন্য ধন্যবাদ! আপনার অ্যাকাউন্টটি সক্রিয় করতে নিচের বাটনে ক্লিক করে আপনার ইমেইল ঠিকানাটি ভেরিফাই করুন।</p>
                    <a href="${verificationUrl}" class="button">ভেরিফাই ইমেইল</a>
                    <p style="margin-top: 25px; font-size: 14px;">লিঙ্কটি কাজ না করলে নিচের ইউআরএলটি কপি করে ব্রাউজারে পেস্ট করুন:<br>
                    <span style="color: #4F46E5;">${verificationUrl}</span></p>
                </div>
                <div class="footer">
                    <p>&copy; 2026 Prisma Blog. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `
                });


                console.log("Verification email sent:", info.messageId);
            }catch(error){
               console.error("Error sending verification email:", error);
               throw error
            }
    },
    },

    // Postman / local test এর জন্য
    advanced: {
        disableCSRFCheck: true,
    },
});
