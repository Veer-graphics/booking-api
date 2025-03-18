import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createReview = async (userId, propertyId, rating, comment) => {
    try {
        // Validate required fields
        if (!userId || !propertyId || rating === undefined || comment === undefined) {
            throw new Error("All fields are required.");
        }

        // Check if user exists
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            throw new Error("User not found.");
        }

        // Check if property exists
        const propertyExists = await prisma.property.findUnique({ where: { id: propertyId } });
        if (!propertyExists) {
            throw new Error("Property not found.");
        }

        // Create new review
        const review = await prisma.review.create({
            data: { userId, propertyId, rating, comment }
        });

        return review;
    } catch (error) {
        console.error("Error in createReview:", error);
        throw error;
    }
};

export default createReview;
