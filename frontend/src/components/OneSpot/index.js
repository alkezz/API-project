import React, { useEffect, useState } from 'react'
import * as spotActions from '../../store/spots';
import * as reviewActions from '../../store/reviews'
import * as sessionActions from '../../store/session'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import "./OneSpot.css"

function SpotById() {
    let hasReview = false
    const history = useHistory();
    const id = Number(useParams().spotId)
    const stringId = useParams().spotId
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const reviews = useSelector(state => state.reviews)
    useEffect(() => {
        dispatch(sessionActions.restoreUser())
        async function getData() {
            await dispatch(spotActions.getOne(id))
            await dispatch(reviewActions.getReviews(id))
        }
        getData()
    }, [dispatch, id])
    const reviewArray = Object.values(reviews)
    for (let i = 0; i < reviewArray.length; i++) {
        if (user === null || reviewArray[i].userId === user.id) {
            hasReview = true
        }
    }
    const allSpotsOBJ = useSelector(state => state.spots[id])
    if (!allSpotsOBJ) return null
    return (
        <>
            {allSpotsOBJ.SpotImages && (
                <div className='entire-one-spot-info'>
                    <div className='above-picture-info'>
                        <div className='one-spot-name'>
                            <h2>{allSpotsOBJ.name}</h2>
                        </div>
                        <div className='one-spot-stats'>
                            <ul className='spot-stats-ul'>
                                <li key={allSpotsOBJ.id} style={{ visibility: isNaN(allSpotsOBJ.avgStarRating) ? "hidden" : "visible" }}> <i class="fa-solid fa-star"></i> </li>
                                &nbsp;
                                <li key={allSpotsOBJ.id + 1}> {isNaN(allSpotsOBJ.avgStarRating) ? "No Reviews Yet!" : allSpotsOBJ.avgStarRating} </li>
                                &nbsp;
                                <span>·</span>
                                &nbsp;
                                <li key={allSpotsOBJ.id + 2}> {allSpotsOBJ.numReviews} Review(s) </li>
                                &nbsp;
                                <span>·</span>
                                &nbsp;
                                <li key={allSpotsOBJ.id + 3}><span><i class="fa-solid fa-medal"></i></span><span> </span>Superhost</li>
                                &nbsp;
                                <span>·</span>
                                &nbsp;
                                <li key={allSpotsOBJ.id + 4} style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{allSpotsOBJ.city}, {allSpotsOBJ.state}, {allSpotsOBJ.country}</li>
                            </ul>
                        </div>
                    </div>
                    <div id='img-div'>
                        <img id='one-allSpotsOBJ-image' src={allSpotsOBJ.SpotImages[0].url} alt="cave"></img>
                    </div>
                    &nbsp;
                    <div id='under-picture-div'>
                        <div id='actual-text-div'>
                            <h2>
                                {allSpotsOBJ.description} Hosted by {allSpotsOBJ.Owner.firstName}
                            </h2>
                            <h3>${allSpotsOBJ.price}/night</h3>
                            <div className='actual-button-container'>
                                <div className='card-button-div-container' style={{ visibility: user === null || user.id !== allSpotsOBJ.ownerId ? "hidden" : "visible" }}>
                                    <div className='button-div-container'>
                                        <button style={{ visibility: user === null || user.id !== allSpotsOBJ.ownerId ? "hidden" : "visible" }} onClick={() => history.push(`/spot/${id}/edit`)} className="edit-delete-button">Edit Spot</button>
                                        <button style={{ visibility: user === null || user.id !== allSpotsOBJ.ownerId ? "hidden" : "visible" }} onClick={() => dispatch(spotActions.deleteSpot(allSpotsOBJ)).then(() => history.push('/'))} className="edit-delete-button">Delete Spot</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <br></br>
            <div style={{ borderBottom: '1px black solid', display: 'flex', marginLeft: '20%', marginRight: '20%' }}></div>
            <div className='extra-info-div'>
                <ul style={{ listStyle: 'none' }}>
                    <li key='closed-door'>
                        <i class="fa-solid fa-door-closed"></i> &nbsp;Self check-in
                    </li>
                    <br />
                    <li key='calender'>
                        <i class="fa-solid fa-calendar"></i> &nbsp; Free cancellation for 48 hours.
                    </li>
                    <br />
                    <li key='wifi'>
                        <i class="fa-solid fa-wifi"></i> &nbsp;Free WiFi
                    </li>
                </ul>
            </div>
            <div style={{ borderBottom: '1px black solid', display: 'flex', marginLeft: '20%', marginRight: '20%' }}></div>
            <h1 style={{ display: 'flex', justifyContent: 'center' }}>Reviews:</h1>
            <div className='center-review-box'>
                {reviewArray.length >= 1 && (
                    <div style={{ border: '1px black solid' }} className='review-container-div'>
                        {reviewArray.map((review) =>
                            <div>
                                <div className='single-review-container'>
                                    <div>
                                        <i class="fa-solid fa-circle-user"></i> {review.User?.firstName} {review.User?.lastName[0]} says:
                                    </div>
                                    &nbsp;
                                    <div>
                                        &nbsp; &nbsp; &nbsp; {review.review}
                                    </div>
                                    &nbsp;
                                    <div>
                                        {[...Array(review.stars)].map((_, i) =>
                                            <i key={i} class="fa-solid fa-star"></i>
                                        )}
                                        {/* <i class="fa-solid fa-star"></i> &nbsp;{review.stars} */}
                                    </div>
                                    <div>
                                        <button onClick={async (e) => {
                                            await dispatch(reviewActions.deleteReview(review))
                                            await dispatch(spotActions.getOne(id))
                                            await dispatch(reviewActions.getReviews(id))
                                        }} style={{ visibility: user === null || user.id !== review.userId ? 'hidden' : 'visible' }} className='add-review-button'>Delete Review</button>
                                    </div>
                                </div>
                                <div style={{ borderBottom: '1px solid black' }}></div>
                            </div>
                        )}
                    </div>

                )}
                {reviewArray.length <= 0 && (
                    <>
                        <div>
                            <div>
                                No Reviews yet!
                            </div>
                            <div style={{ visibility: user === null || user.id === allSpotsOBJ.ownerId ? 'hidden' : 'visible' }}>
                                Why don't you get started and create a review for this spot!
                            </div>
                            <div className='review-button-div'>
                                <button style={{ visibility: user === null || user.id === allSpotsOBJ.ownerId ? 'hidden' : 'visible' }} className='add-review-button' onClick={() => history.push(`/spots/${stringId}/review/create`)}>Create a Review</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <br />
            <div style={{ borderBottom: '1px black solid', display: 'flex', marginLeft: '20%', marginRight: '20%' }}></div>
            <br />
            {reviewArray.length >= 1 && (
                <div className='center-review-button'>
                    <button style={{ visibility: (user === null || user.id === allSpotsOBJ.ownerId) || hasReview === true ? 'hidden' : 'visible' }} className='add-review-button' onClick={() => history.push(`/spots/${stringId}/review/create`)}>Create A Review</button>
                </div>
            )}
        </>
    )
}

export default SpotById
