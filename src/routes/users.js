import { Router } from "express";
const router = Router();
import getUsers from '../services/users/getUsers.js';
import getUser from "../services/users/getUser.js";
import createUser from "../services/users/createUser.js";
import updateUser from "../services/users/updateUsers.js";
import auth from '../middleware/auth.js';
import deleteUser from "../services/users/deleteUser.js";

// get amenities  - WORKS ON POSTMAN
router.get('/', async (req, res, next) => {
    try {
        const { username } = req.query;

        const filters = {};
        if (username) filters.username = username;
        const users = await getUsers(filters);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

// get amenity - WORKS ON POSTMAN
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`Received ID: ${id}`);  // Log the received ID
        const user = await getUser(id);

        if (!user) {
            return res.status(404).json({ message: `User with id ${id} could not be found` });
        } else {
            return res.status(200).json(user);
        }
    } catch (error) {
        next(error);
    }
});




import { Prisma } from "@prisma/client";
// add amenity - WORKS ON POSTMAN
router.post("/", auth, async (req, res) => {
    try {
        const { username, password, name, email, phoneNumber, profilePicture } = req.body;

        // Log the request body to check the fields
        console.log("Request Body:", req.body);

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required." });
        }

        const newUser = await createUser(username, password, name, email, phoneNumber, profilePicture);

        // Log the created user to verify
        console.log("Created User:", newUser);

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error in POST /users:", error);

        if (error.message === "Username or email already exists.") {
            return res.status(400).json({ message: error.message });
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(500).json({ message: "Database error occurred." });
        }

        res.status(500).json({ message: "An unexpected error occurred." });
    }
});





// update amenity
router.put('/:id', auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username, password, name, email, phoneNumber, profilePicture } = req.body;
        const user = await updateUser(id, { username, password, name, email, phoneNumber, profilePicture });

        if (!user) {
            res.status(404).json({
                message: `User with id ${id} not found`,
            });
        } else {
            res.status(200).send({ message: `User with id ${id} successfully updated`, })
        }
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await deleteUser(id);

        if (user) {
            // Als de gebruiker is gevonden en verwijderd
            res.status(200).json({ message: "User deleted successfully", userId: id });
        } else {
            // Als de gebruiker niet is gevonden
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        next(error);
    }
});


export default router;