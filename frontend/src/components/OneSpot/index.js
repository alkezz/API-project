import React, { useEffect } from 'react'
import * as spotActions from '../../store/spots';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import "./OneSpot.css"

function SpotById() {
    const id = Number(useParams().spotId)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(spotActions.getOne(id))
    }, [dispatch, id])
    const allSpotsOBJ = useSelector(state => state.spots[id])
    if (!allSpotsOBJ) return null
    return (
        <>
            {allSpotsOBJ.SpotImages && (
                <div>
                    <div>
                        <h2>{allSpotsOBJ.name}</h2>
                    </div>
                    <div>
                        <ul >
                            <li> <i class="fa-solid fa-star"></i> </li>
                            <span> </span>
                            <li> {allSpotsOBJ.avgStarRating} </li>
                            <span> </span>
                            <li> {allSpotsOBJ.numReviews} Review(s) </li>
                            <span> </span>
                            <li><span><i class="fa-solid fa-medal"></i></span>Superhost</li>
                            <span> </span>
                            <li>{allSpotsOBJ.city}, {allSpotsOBJ.state}, {allSpotsOBJ.country}</li>
                        </ul>
                    </div>
                    <div>
                        <img id='one-allSpotsOBJ-image' src={allSpotsOBJ.SpotImages[0].url} alt="cave"></img>
                    </div>
                    <br />
                    <div id='under-picture-text'>
                        <h2>
                            {allSpotsOBJ.description} Hosted by {allSpotsOBJ.Owner.firstName}
                        </h2>
                    </div>
                </div>
            )}
        </>
    )
}

export default SpotById