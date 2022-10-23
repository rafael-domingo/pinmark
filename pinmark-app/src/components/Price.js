import React from 'react';
import { 
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBIcon,

} from 'mdb-react-ui-kit';

function Price({price}) {
    if (price !== undefined) {
        const priceDescription = ['free', 'inexpensive', 'moderate', 'expensive', 'very expensive'];
        var priceJSX = [];
        for (let index = 0; index < price; index++) {
            priceJSX.push(<MDBIcon icon='dollar-sign'/>)        
        }
        return (
            <MDBCard className='h-100'>
                <MDBCardBody>
                    {priceJSX}
                    <MDBCardText>{priceDescription[price]}</MDBCardText>
                </MDBCardBody>
            </MDBCard>
        )
    } else {
        return (
            <MDBCard className='h-100'>
                <MDBCardBody>    
                    <MDBIcon icon='hand-holding-usd'/>
                    <MDBCardText>Free</MDBCardText>
                </MDBCardBody>
            </MDBCard>
        )
    }
    
}

export default Price;