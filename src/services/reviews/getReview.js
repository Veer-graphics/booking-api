import { PrismaClient } from "@prisma/client";

const getReview = async (id) => {
    const prisma = new PrismaClient();
    const review = await prisma.review.findUnique({
        where: { id },
    });

    return review;
}

export default getReview;