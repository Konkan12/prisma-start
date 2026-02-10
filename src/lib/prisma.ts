import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
// কাস্টম পাথ '../../generated/prisma/client' এর পরিবর্তে ডিফল্ট পাথ ব্যবহার করুন
import { PrismaClient } from '@prisma/client'; 

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };