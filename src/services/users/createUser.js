import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Define once and reuse

const createUser = async (username, password, name, email, phoneNumber, profilePicture) => {
    try {
        // Validate input
        if (!username || !email) {
            throw new Error('Username and email are required.');
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            throw new Error('Username or email already exists.');
        }

        // Create new user
        const user = await prisma.user.create({
            data: { username, password, name, email, phoneNumber, profilePicture }
        });

        return user;
    } catch (error) {
        console.error("Error in createUser:", error);
        throw error; // Re-throw the error for handling in the route
    }
};

export default createUser;
