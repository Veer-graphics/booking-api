import { Router } from "express";

const router = Router();
import getReviews from '../services/reviews/getReviews.js';
import getReview from "../services/reviews/getReview.js";
import createReview from "../services/reviews/createReview.js";
import updateReview from "../services/reviews/updateReview.js";
import auth from '../middleware/auth.js';
import deleteReview from "../services/reviews/deleteReview.js";

// get amenities  - WORKS ON POSTMAN
router.get('/', async (req, res, next) => {
    try {
        const reviews = await getReviews();
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
});

// get amenity - WORKS ON POSTMAN
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await getReview(id);

        if (!review) {
            res.status(404).json({ message: `Review with id ${id} could not be found` })
        } else {
            res.status(200).json(review);
        }
    } catch (error) {
        next(error);
    }
})

// add amenity - WORKS ON POSTMAN
router.post('/', auth, async (req, res) => {
    try {
        const { userId, propertyId, rating, comment } = req.body;

        // Validate required fields
        if (!userId || !propertyId || rating === undefined || comment === undefined) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newReview = await createReview(userId, propertyId, rating, comment);
        res.status(201).json(newReview);
    } catch (error) {
        console.error("Error in POST /reviews:", error);

        if (error.message === "All fields are required." || error.message === "User not found." || error.message === "Property not found.") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "An unexpected error occurred." });
    }
});


// update amenity
router.put('/:id', auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId, propertyId, rating, comment } = req.body;
        const review = await updateReview(id, { userId, propertyId, rating, comment });

        if (!review) {
            res.status(404).json({
                message: `Review with id ${id} not found`,
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
        const review = await deleteReview(id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });  // Review niet gevonden
        }

        res.status(200).json({ message: 'Review deleted successfully', review });  // Review succesvol verwijderd
    } catch (error) {
        // Als de fout gaat over review niet gevonden, stuur een 404
        if (error.message === 'Review not found') {
            return res.status(404).json({ message: error.message });
        }

        // Anders stuur een 500 voor serverfouten
        res.status(500).json({ message: error.message });
    }
});


export default router;