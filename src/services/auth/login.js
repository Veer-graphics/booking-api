import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const login = async (username, password) => {
    const secretKey = process.env.AUTH_SECRET_KEY || "3c864babacaa1471620fe6d005c0b4d262fdd1b12031b682d627260ba52ea8454e0f8121674a1eca592e50ece5300f845d746243f64d505c7006567bb871125c";
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst({
        where: { username, password },
    });

    if (!user) {
        return null;
    }

    const token = jwt.sign({ userId: user.id }, secretKey);

    return token;
};

export default login;