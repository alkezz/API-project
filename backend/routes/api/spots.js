const express = require('express');
const router = express.Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, Booking, ReviewImage, SpotImage, sequelize, Sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors, handleSpotValidationErrors } = require('../../utils/validation');

router.get('/', async (req, res) => {
    const payload = []
    const spots = await Spot.findAll()
    for (let i = 0; i < spots.length; i++) {
        const aggregateData = await Spot.findOne({
            where: {
                id: i + 1
            },
            include: {
                model: Review,
                attributes: []
            },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
            ]
        });
        payload.push(aggregateData)
    }
    // const aggregateData = await Spot.findAll({
    //     include: {
    //         model: Review,
    //         attributes: []
    //     },
    //     attributes: [
    //         [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
    //     ]
    // });
    const allSpots = await Spot.findAll({
        attributes: {
            include: [
                //         [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
                [Sequelize.col('SpotImages.url'), 'previewImage']
            ],
        },
        include: [
            {
                model: Review,
                required: false,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: [],
                required: true
            }
        ]
    })
    for (let i = 0; i < allSpots.length; i++) {
        allSpots[i].setDataValue('avgRating', payload[i].dataValues.avgRating)
    }
    res.status(200).json(allSpots)
})

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req
    const payload = []
    const spots = await Spot.findAll()
    const aggregateData = await Spot.findAll({
        where: {
            ownerId: user.toSafeObject().id
        },
        include: {
            model: Review,
            attributes: []
        },
        attributes: [
            [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
        ]
    });
    console.log(aggregateData[0].dataValues.avgRating)

    const currSpots = await Spot.findAll({
        attributes: {
            include: [
                [Sequelize.col('SpotImages.url'), 'previewImage']
            ]
        },
        include: [
            {
                model: Review,
                required: false,
                attributes: []
            },
            {
                model: SpotImage,
                attributes: [],
                required: true
            }
        ],
        where: {
            ownerId: user.toSafeObject().id
        }
    })
    for (let i = 0; i < aggregateData.length; i++) {
        currSpots[i].setDataValue('avgRating', aggregateData[i].dataValues.avgRating)
    }
    res.status(200).json(currSpots)
})

router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        attributes: {
            include: [
                [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']
            ]
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            },
            {
                model: User,
                as: 'Owner',
                attributes: {
                    exclude: ['username', 'email', 'hashedPassword', 'createdAt', 'updatedAt']
                }
            }
        ],
    })
    if (spot) {
        res.status(200).json(spot)
    } else {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

const validateNewSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleSpotValidationErrors
]

router.post('/', requireAuth, validateNewSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const { user } = req
    const newSpot = await Spot.create({
        ownerId: user.toSafeObject().id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.status(201).json(newSpot)

})

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { user } = req
    const { url, preview } = req.body
    const spot = await Spot.findByPk(req.params.spotId)
    if (spot) {
        if (spot.ownerId === user.toSafeObject().id) {
            const newImage = await SpotImage.create({
                spotId: req.params.spotId,
                url,
                preview
            })
            res.status(200).json(newImage)
        } else {
            res.json({
                message: 'You must own this spot to add an image'
            })
        }
    } else {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

router.put('/:spotId', requireAuth, async (req, res) => {
    const { user } = req
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const spot = await Spot.findByPk(req.params.spotId)
    if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
        res.json({
            message: 'Validation Error',
            statusCode: 400,
            errors: {
                address: 'Street address is required',
                city: 'City is required',
                state: 'State is required',
                country: 'Country is required',
                lat: 'Latitude is not valid',
                lng: 'Longitude is not valid',
                name: 'Name must be less than 50 characters',
                description: 'Description is required',
                price: 'Price per day is required'
            }
        })
    }
    if (spot) {
        if (spot.ownerId === user.toSafeObject().id) {
            await spot.update({
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price
            })
            res.json(spot)
        } else {
            res.json({
                message: 'You must own this spot to edit it!'
            })
        }
    } else {
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})

router.delete('/:spotId', requireAuth, async (req, res) => {
    const { user } = req
    const oldSpot = await Spot.findByPk(req.params.spotId)
    if (oldSpot) {
        if (oldSpot.ownerId === user.toSafeObject().id) {
            oldSpot.destroy()
            res.json({
                message: "Successfully deleted",
                statusCode: 200
            })
        } else {
            res.json({
                message: "You can't delete a spot you don't own!",
                statusCode: 404
            })
        }
    } else {
        res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

})

module.exports = router;
