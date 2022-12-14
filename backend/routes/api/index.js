const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotRouter = require('./spots.js')
const reviewRouter = require('./reviews.js')
const bookingsRouter = require('./bookings.js')
const spotImageRouter = require('./spot-images')
const reviewImageRouter = require('./review-images')
const mapsRouter = require('./maps');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/maps', mapsRouter);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotRouter)

router.use('/reviews', reviewRouter)

router.use('/bookings', bookingsRouter)

router.use('/spot-images', spotImageRouter)

router.use('/review-images', reviewImageRouter)



module.exports = router;
