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
         autoSignInAfterVerification: true,
        // এখানে সরাসরি 'url' ব্যবহার করুন যা Better Auth জেনারেট করে দেয়
        sendVerificationEmail: async ({ user, url, token }) => {
            try {
                const info = await transporter.sendMail({
                    // আপনার .env থেকে ইমেইলটি নিন
                    from: `"Prisma Blog" <${process.env.EMAIL_USER}>`, 
                    to: user.email,
                    subject: "Verify Your Email - Prisma Blog",
                    text: `Please verify your email by clicking this link: ${url}`,
                    html: `
                        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                            <h1>ইমেইল ভেরিফিকেশন</h1>
                            <p>হ্যালো ${user.name}, নিচে ক্লিক করে আপনার ইমেইল ভেরিফাই করুন:</p>
                            <a href="${url}" style="background: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Verify Email</a>
                        </div>
                    `
                });

                console.log("Verification email sent successfully!");
            } catch (error) {
                console.error("Error sending email:", error);
                // এটি থ্রো করলে Better Auth বুঝবে মেইল যায়নি
                throw new Error("Failed to send verification email");
            }
        },
    },
    socialProviders: {
        google: { 
            prompt: "select_account consent",
            accessType: "offline", 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            
        }, 
    },

    advanced: {
        disableCSRFCheck: true,
    },
});
