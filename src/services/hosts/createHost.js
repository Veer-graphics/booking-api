import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Define Prisma globally

const createHost = async (username, password, name, email, phoneNumber, profilePicture, aboutMe) => {
    try {
        // Validate input
        if (!username || !email || !password) {
            throw new Error("Username, email, and password are required.");
        }

        // Check if host already exists
        const existingHost = await prisma.host.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingHost) {
            throw new Error("Username or email already exists.");
        }

        // Create host
        const host = await prisma.host.create({
            data: { username, password, name, email, phoneNumber, profilePicture, aboutMe }
        });

        return host;
    } catch (error) {
        console.error("Error in createHost:", error);
        throw error; // Re-throw for handling in route
    }
};

export default createHost;
