import { Router } from "express";

const router = Router();
import getBookings from '../services/bookings/getBookings.js';
import getBooking from "../services/bookings/getBooking.js";
import createBooking from "../services/bookings/createBooking.js";
import updateBooking from "../services/bookings/updateBooking.js";
import deleteBooking from "../services/bookings/deleteBooking.js";
import auth from '../middleware/auth.js';

// get amenities  - WORKS ON POSTMAN
router.get('/', async (req, res, next) => {
    try {
        const { userId } = req.query; // Haal queryparameters op

        const filters = {};
        if (userId) filters.userId = userId;

        const bookings = await getBookings(filters);
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
});


// get amenity - WORKS ON POSTMAN
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const booking = await getBooking(id);

        if (!booking) {
            res.status(404).json({ message: `Booking with id ${id} could not be found` })
        } else {
            res.status(200).json(booking);
        }
    } catch (error) {
        next(error);
    }
})

// add amenity - WORKS ON POSTMAN
import { Prisma } from '@prisma/client'

router.post("/", auth, async (req, res) => {
    try {
        const { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus, userId, propertyId } = req.body;

        // Validate required fields
        if (!checkinDate || !checkoutDate || !numberOfGuests || !totalPrice || !bookingStatus || !userId || !propertyId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newBooking = await createBooking(checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus, userId, propertyId);
        res.status(201).json(newBooking);
    } catch (error) {
        console.error("Error in POST /bookings:", error);

        if (error.message === "All fields are required." || error.message === "User not found." || error.message === "Property not found.") {
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
        const { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;
        const booking = await updateBooking(id, { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus });

        if (!booking) {
            res.status(404).json({
                message: `Booking with id ${id} not found`,
            });
        } else {
            res.status(200).send({ message: `Booking with id ${id} successfully updated`, })
        }
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', auth, async (req, res, next) => {
    try {
        const { id } = req.params;
        const booking = await deleteBooking(id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });  // Booking niet gevonden
        }

        res.status(200).json({ message: 'Booking deleted successfully', booking });  // Booking succesvol verwijderd
    } catch (error) {
        // Als de fout gaat over booking niet gevonden, stuur een 404
        if (error.message === 'Booking not found') {
            return res.status(404).json({ message: error.message });
        }

        // Anders stuur een 500 voor serverfouten
        res.status(500).json({ message: error.message });
    }
});


export default router;