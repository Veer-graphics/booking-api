import { Router } from "express";

const router = Router();
import getProperties from '../services/properties/getProperties.js';
import getProperty from "../services/properties/getProperty.js";
import createProperty from "../services/properties/createProperty.js";
import updateProperty from "../services/properties/updateProperty.js";
import auth from '../middleware/auth.js';
import deleteProperty from "../services/properties/deleteProperty.js";

// get amenities  - WORKS ON POSTMAN
router.get('/', async (req, res, next) => {
    try {
        const { location, pricePerNight } = req.query; // Query parameters uitlezen

        const filters = {};
        if (location) filters.location = location;
        if (pricePerNight) filters.pricePerNight = pricePerNight;

        const properties = await getProperties(filters);
        res.status(200).json(properties);
    } catch (error) {
        next(error);
    }
});


// get amenity - WORKS ON POSTMAN
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const property = await getProperty(id);

        if (!property) {
            res.status(404).json({ message: `Property with id ${id} could not be found` })
        } else {
            res.status(200).json(property);
        }
    } catch (error) {
        next(error);
    }
})

// add amenity - WORKS ON POSTMAN
import { Prisma } from "@prisma/client";
router.post("/", auth, async (req, res) => {
    try {
        const { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, hostId } = req.body;

        // Check for missing required fields
        if (!title || !description || !location || !pricePerNight || !hostId) {
            return res.status(400).json({ message: "Title, description, location, pricePerNight, and hostId are required." });
        }

        const newProperty = await createProperty(title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, hostId);
        res.status(201).json(newProperty);
    } catch (error) {
        console.error("Error in POST /properties:", error);

        if (error.message === "Host with the given ID does not exist.") {
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
        const { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, hostId } = req.body;
        const property = await updateProperty(id, { title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, rating, hostId });

        if (!property) {
            res.status(404).json({
                message: `Property with id ${id} not found`,
            });
        } else {
            res.status(200).send({ message: `Property with id ${id} successfully updated`, })
        }
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const property = await deleteProperty(id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });  // Property niet gevonden
        }

        res.status(200).json({ message: 'Property deleted successfully', property });  // Property succesvol verwijderd
    } catch (error) {
        // Als de fout gaat over property niet gevonden, stuur een 404
        if (error.message === 'Property not found') {
            return res.status(404).json({ message: error.message });
        }

        // Anders stuur een 500 voor serverfouten
        res.status(500).json({ message: error.message });
    }
});


export default router;