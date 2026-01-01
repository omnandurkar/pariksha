const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Fetching groups...')
    try {
        const groups = await prisma.group.findMany({
            include: {
                _count: { select: { members: true } }
            },
            orderBy: { createdAt: 'desc' }
        })
        console.log('Groups fetched successfully:', groups)
    } catch (e) {
        console.error('Error fetching groups:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
