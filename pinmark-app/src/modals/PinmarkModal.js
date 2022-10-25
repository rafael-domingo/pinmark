import { 
    MDBModalHeader,
    MDBModalBody,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBBtn,
    MDBIcon,
    MDBCardText,
    MDBBadge,    
} from 'mdb-react-ui-kit';
import React from 'react';
import Rating from '../components/Rating';
import Price from '../components/Price';
import Category from '../components/Category';

function PinmarkModal({detailInfo, handleCloseModal, handleDeletePinmark}) {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current.scrollTo(0,0);
    });
    console.log(detailInfo);

    return (
        <>
            <MDBModalHeader className="bg-image" style={{padding: 0}}>                       
                <img position="top" overlay style={{width: '100%', height: '35vh', objectFit: 'cover'}} src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${detailInfo.pinmark?.photoURL}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}/>  
                <div
                    className='mask'
                    style={{
                    background: 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0) 50%, hsla(0, 0%, 0%, 0.5))',
                    }}>
                    <div className='bottom-0 d-flex align-items-end h-100 text-center justify-content-flex-start'>
                    <div style={{paddingLeft: 20}}>
                        <h1 className='fw-bold text-white mb-4'>{detailInfo.pinmark?.locationName}</h1>
                    </div>
                    </div>
                </div>                       
            </MDBModalHeader>
            <MDBModalBody ref={ref}>                        
                <MDBRow>
                    <MDBCol size='12' className='mb-4'>
                        <MDBCard className='h-100'>
                            <MDBCardBody className='d-flex justify-content-center align-items-center'>                                           
                                <MDBCardText className='text-start'>{detailInfo.pinmark?.address}</MDBCardText>
                                <MDBBtn color='none' href={`https://www.google.com/maps/dir/?api=1&map_action=map&destination=${encodeURIComponent(detailInfo.pinmark?.locationName)}&destination_place_id=${detailInfo.pinmark?.pinmarkId}`}>
                                    <MDBIcon size='2x' icon='directions'/>                                              
                                </MDBBtn>                                    
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size='12' className='mb-4'>
                        <MDBCard className='h-100'>
                            <MDBCardBody>
                                <MDBCardText>{detailInfo.details?.result?.editorial_summary?.overview}</MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size='6' className='mb-4'>
                        <Category category={detailInfo.pinmark?.pinmarkCategory}/>                      
                    </MDBCol>
                    <MDBCol size='6' className='mb-4'>
                        <MDBCard className='h-100'>
                            <MDBCardBody className='d-flex justify-content-center align-items-center'>
                                { detailInfo.details?.result?.opening_hours?.open_now ? (<MDBBadge color='success'>Open</MDBBadge>) : (<MDBBadge color='danger'>Closed</MDBBadge>)}  
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size='6' className='mb-4'>
                        <MDBCard className='h-100'>
                            <MDBCardBody className='d-flex justify-content-center align-items-center'>
                                <MDBCardText><a href={`tel:${detailInfo.details?.result?.formatted_phone_number}`}>{detailInfo.details?.result.formatted_phone_number}</a></MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol size='6' className='mb-4'>
                        <Price price={detailInfo.details?.result?.price_level}/>
                        {/* <MDBCard>
                            <MDBCardBody>
                                <MDBCardText>$$$$ {detailInfo.details?.result?.price_level}</MDBCardText>
                            </MDBCardBody>
                        </MDBCard> */}
                    </MDBCol>   
                    <MDBCol size='6' className='mb-4'>                        
                        <Rating rating={detailInfo.details?.result?.rating}/>                                                                        
                    </MDBCol>                                
                </MDBRow>
            </MDBModalBody>   
            <MDBBtn onClick={() => handleDeletePinmark(detailInfo.details?.result)} tag='a' color='danger' size='lg' floating style={{position: 'absolute', bottom: 30, left: 30, color: 'white'}}>
                <MDBIcon fas icon='trash'/>
            </MDBBtn>                                            
            <MDBBtn onClick={() => handleCloseModal()} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                <MDBIcon fas icon='times'/>
            </MDBBtn>                      
        </>
    )
}

export default PinmarkModal;