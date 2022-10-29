import React from 'react';
import { 
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBIcon,

} from 'mdb-react-ui-kit';
function Rating({rating, background}) {
    const adjustedRating = Math.round(rating*2)/2;
    const numWholeStars = Math.floor(adjustedRating);
    const numHalfStar = adjustedRating > numWholeStars ? true : false;
    var wholeStarsJSX = [];
    for (let index = 0; index < numWholeStars; index++) {
        wholeStarsJSX.push(<MDBIcon icon='star'/>)        
    }
    
    return (
        <MDBCard className='h-100' background={background}>  
            <MDBCardBody>                
                {wholeStarsJSX}
                {numHalfStar && (<MDBIcon icon='star-half-alt'/>)} 
                <MDBCardText className='text-muted'>{rating} stars</MDBCardText>
            </MDBCardBody>               
        </MDBCard>
    )
}

export default Rating;