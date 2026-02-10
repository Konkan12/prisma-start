import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    
    // বানান সংশোধন করা হয়েছে: trustOrigins -> trustedOrigins
    trustedOrigins: [process.env.APP_URL || "http://localhost:5000"],

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER", // বানান সংশোধন করা হয়েছে
                required: false
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },

    emailAndPassword: {
        enabled: true,
        autoSingin : false,
        requireEmailVerification: true,
    },
    emailVerification: {
    sendVerificationEmail: async ( { user, url, token }, request) => {
      console.log("*** verification email send !")
    },

    // পোস্টম্যান টেস্ট করার জন্য সাময়িকভাবে এটি যোগ করুন
    advanced: {
        disableCSRFCheck: true
    }
}
});