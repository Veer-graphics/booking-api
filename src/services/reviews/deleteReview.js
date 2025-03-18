import { PrismaClient } from "@prisma/client";

const deleteReview = async (id) => {
    const prisma = new PrismaClient();
    try {
        // Verwijder de review met het opgegeven ID
        const review = await prisma.review.delete({
            where: { id }
        });

        return review;  // Retourneer de verwijderde review
    } catch (error) {
        // Als review niet gevonden wordt, gooi een fout
        if (error.code === 'P2025') {
            throw new Error('Review not found');
        }
        throw error;  // Gooi andere fouten door
    }
}

export default deleteReview;
