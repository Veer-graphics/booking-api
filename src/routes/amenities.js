import { Router } from "express";

const router = Router();
import getAmenities from '../services/amenities/getAmenities.js';
import getAmenity from "../services/amenities/getAmenity.js";
import createAmenity from "../services/amenities/createAmenity.js";
import updateAmenity from "../services/amenities/updateAmenity.js";
import auth from '../middleware/auth.js';
import deleteAmenity from "../services/amenities/deleteAmenity.js";

// get amenities  - WORKS ON POSTMAN
router.get('/', async (req, res, next) => {
    try {
        const amenities = await getAmenities();
        res.status(200).json(amenities);
    } catch (error) {
        next(error);
    }
});

// get amenity - WORKS ON POSTMAN
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const amenity = await getAmenity(id);

        if (!amenity) {
            res.status(404).json({ message: `Amenity with id ${id} could not be found` })
        } else {
            res.status(200).json(amenity);
        }
    } catch (error) {
        next(error);
    }
})

// add amenity - WORKS ON POSTMAN
import { Prisma } from '@prisma/client'
router.post("/", auth, async (req, res) => {
    try {
        const { name } = req.body;

        // Check if name is provided
        if (!name) {
            return res.status(400).json({ message: "Amenity name is required." });
        }

        const newAmenity = await createAmenity(name);
        res.status(201).json(newAmenity);
    } catch (error) {
        console.error("Error in POST /amenities:", error);

        if (error.message === "Amenity name is required.") {
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
        const { name } = req.body;
        const amenity = await updateAmenity(id, { name });

        if (!amenity) {
            res.status(404).json({
                message: `Category with id ${id} not found`,
            });
        } else {
            res.status(200).send({ message: `Category with id ${id} successfully updated`, })
        }
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const amenity = await deleteAmenity(id);

        if (!amenity) {
            return res.status(404).json({ message: 'Amenity not found' });  // Amenity niet gevonden
        }

        res.status(200).json({ message: 'Amenity deleted successfully', amenity });  // Amenity succesvol verwijderd
    } catch (error) {
        // Als de fout gaat over amenity niet gevonden, stuur een 404
        if (error.message === 'Amenity not found') {
            return res.status(404).json({ message: error.message });
        }

        // Anders stuur een 500 voor serverfouten
        res.status(500).json({ message: error.message });
    }
});


export default router;