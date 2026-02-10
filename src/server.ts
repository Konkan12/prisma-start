import {prisma} from './lib/prisma';
import app from "./app"


const PORT = process.env.PORT || 5000;

async function main(){
    try{
        await prisma.$connect();
        console.log("Connected to the database");
         app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        })

    }catch(error){
        console.error("An error occurred while connecting to the database:", error)
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();