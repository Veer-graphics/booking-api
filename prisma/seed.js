import { PrismaClient } from "@prisma/client";
import amenitiesData from '../src/data/amenities.json' assert {type: 'json'}
import bookingsData from '../src/data/bookings.json' assert {type: 'json'}
import hostsData from '../src/data/hosts.json' assert {type: 'json'}
import propertiesData from '../src/data/properties.json' assert {type: 'json'}
import reviewsData from '../src/data/reviews.json' assert {type: 'json'}
import usersData from '../src/data/users.json' assert {type: 'json'}

const prisma = new PrismaClient();

async function main() {
    const { amenities } = amenitiesData;
    const { bookings } = bookingsData;
    const { hosts } = hostsData;
    const { properties } = propertiesData;
    const { reviews } = reviewsData;
    const { users } = usersData;

    // Seed users first
    for (const user of users) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: {},
            create: user,
        });
    }

    // Seed hosts
    for (const host of hosts) {
        await prisma.host.upsert({
            where: { id: host.id },
            update: {},
            create: host,
        });
    }

    // Seed properties
    for (const property of properties) {
        await prisma.property.upsert({
            where: { id: property.id },
            update: {},
            create: property,
        });
    }

    // Seed amenities
    for (const amenity of amenities) {
        await prisma.amenity.upsert({
            where: { id: amenity.id },
            update: {},
            create: amenity,
        });
    }

    // Seed bookings
    for (const booking of bookings) {
        await prisma.booking.upsert({
            where: { id: booking.id },
            update: {},
            create: {
                id: booking.id,
                userId: booking.userId,
                propertyId: booking.propertyId,
                checkinDate: booking.checkinDate,
                checkoutDate: booking.checkoutDate,
                numberOfGuests: booking.numberOfGuests,
                totalPrice: booking.totalPrice,
                bookingStatus: booking.bookingStatus
            }
        });
    }

    // Finally, seed reviews
    for (const review of reviews) {
        await prisma.review.upsert({
            where: { id: review.id },
            update: {},
            create: review,
        });
    }
}


main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });