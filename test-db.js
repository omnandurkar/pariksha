const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to DB...");
        const userCount = await prisma.user.count();
        console.log("Connection successful. User count:", userCount);
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        console.log("Admin exists:", !!admin);
    } catch (e) {
        console.error("DB Connection Failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
