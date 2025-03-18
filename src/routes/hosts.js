import { Router } from "express";

const router = Router();
import getHosts from '../services/hosts/getHosts.js';
import getHost from "../services/hosts/getHost.js";
import createHost from "../services/hosts/createHost.js";
import updateHost from "../services/hosts/updateHost.js";
import deleteHost from "../services/hosts/deleteHost.js";
import auth from '../middleware/auth.js';

// get amenities  - WORKS ON POSTMAN
router.get('/', async (req, res, next) => {
    try {
        const { name } = req.query;
        const filters = {};
        if (name) filters.name = name;

        const hosts = await getHosts(filters);
        res.status(200).json(hosts);
    } catch (error) {
        next(error);
    }
});

// get amenity - WORKS ON POSTMAN
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const host = await getHost(id);

        if (!host) {
            res.status(404).json({ message: `Host with id ${id} could not be found` })
        } else {
            res.status(200).json(host);
        }
    } catch (error) {
        next(error);
    }
})

import { Prisma } from "@prisma/client";
// add amenity - WORKS ON POSTMAN
router.post("/", auth, async (req, res) => {
    try {
        const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;

        // Ensure required fields are present
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email, and password are required." });
        }

        const newHost = await createHost(username, password, name, email, phoneNumber, profilePicture, aboutMe);
        res.status(201).json(newHost);
    } catch (error) {
        console.error("Error in POST /hosts:", error);

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
        const { username, password, name, email, phoneNumber, profilePicture, aboutMe } = req.body;
        const host = await updateHost(id, { username, password, name, email, phoneNumber, profilePicture, aboutMe });

        if (!host) {
            res.status(404).json({
                message: `Host with id ${id} not found`,
            });
        } else {
            res.status(200).send({ message: `Host with id ${id} successfully updated`, })
        }
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const host = await deleteHost(id);

        if (!host) {
            return res.status(404).json({ message: 'Host not found' });  // Host niet gevonden
        }

        res.status(200).json({ message: 'Host deleted successfully', host });  // Host succesvol verwijderd
    } catch (error) {
        // Als de fout gaat over host niet gevonden, stuur een 404
        if (error.message === 'Host not found') {
            return res.status(404).json({ message: error.message });
        }

        // Anders stuur een 500 voor serverfouten
        res.status(500).json({ message: error.message });
    }
});


export default router;