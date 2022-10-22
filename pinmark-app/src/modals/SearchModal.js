import React from 'react';
import { useSelector } from 'react-redux';
import { Google } from '../util/Google';
import { updateUser } from '../util/Firebase';
import { 
    MDBModalHeader,
    MDBInputGroup,
    MDBModalBody,
    MDBRow,
    MDBCol,
    MDBCardBody,
    MDBCardText,
    MDBCardTitle,
    MDBCardFooter,
    MDBBtn,
    MDBIcon,
    MDBCard,
    MDBModalFooter
} from 'mdb-react-ui-kit';

function SearchModal({location = null, handleCloseModal, handlePinmarkDetail, handleAddPinmark, handleDeletePinmark}) {
    const [searchInput, setSearchInput] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [pinmarkIdArray, setPinmarkIdArray] = React.useState([]);
    const pinmarkState = useSelector((state) => state.pinmark);
    const userState = useSelector((state) => state.user);
    const ref = React.useRef();

    // side effect to keep track of pinmark IDs to help with search results UI (add/remove pinmarks)
    React.useEffect(() => {
        console.log(pinmarkState);
        var pinmarkArray = [];
        pinmarkState.pinmarks.map((pinmark) => {
            pinmarkArray.push(pinmark.pinmarkId);
        })
        setPinmarkIdArray(pinmarkArray);
        updateUser(userState.uid, pinmarkState);
    }, [pinmarkState])

    // scroll back to top when search results are refreshed
    React.useEffect(() => {
        ref.current.scrollTo(0,0);
    }, [searchResults])

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
        if (e.target.value.length > 3) {
            Google.placeSearch(e.target.value, null)
            .then(data => {
                handleSearchResults(data);
            })
            .catch(e => console.log(e));
        }
    }

    const handleSearchResults = (results) => {
        setSearchResults(results.results);
    }
    return (
        <>
            <MDBModalHeader>  
                <MDBInputGroup className='mb-3' noBorder textBefore={<MDBIcon fas icon='search' />}>
                    <input className='search form-control' type='text' placeholder='Search' onChange={handleSearchInput} value={searchInput} style={{border: 'none', boxShadow: 'none'}}/>
                </MDBInputGroup>                      
            </MDBModalHeader>
            <MDBModalBody ref={ref}>
                <MDBRow>
                {/* put list of search results here */}
                {searchResults.map((result) => {
                                                    
                    return (
                        <MDBCol xxl={12} xl={4} l={4} md={4} className='mb-4'>
                            <MDBCard className='h-100'>
                                <MDBCardBody>
                                    <MDBCardTitle>{result.name}</MDBCardTitle>
                                    <MDBCardText>{result.formatted_address}</MDBCardText>                                            
                                </MDBCardBody>
                                <MDBCardFooter background='light' border='0' className='p-2 d-flex justify-content-around'>
                                    <MDBBtn onClick={() => handlePinmarkDetail(result)} color='link' rippleColor='primary' className='text-reset m-0'>
                                    View <MDBIcon fas icon='eye' />
                                    </MDBBtn>
                                    {
                                        !pinmarkIdArray.includes(result.place_id) && (
                                            <MDBBtn onClick={() => handleAddPinmark(result)} color='primary'>
                                                Add Pinmark <MDBIcon fas icon='plus' />
                                            </MDBBtn>
                                        )
                                    }
                                        {
                                        pinmarkIdArray.includes(result.place_id) && (
                                            <MDBBtn onClick={() => handleDeletePinmark(result)} color='link' rippleColor='primary' className='text-reset m-0'>
                                                Remove Pinmark <MDBIcon fas icon='minus' />
                                            </MDBBtn>
                                        )
                                    }
                                    
                                </MDBCardFooter>
                                </MDBCard>                      
                        </MDBCol>                                                  
                    )
                })}
                </MDBRow>
            </MDBModalBody>
            <MDBModalFooter>
            <MDBBtn onClick={() => handleCloseModal()} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                <MDBIcon fas icon='times'/>
            </MDBBtn>
            </MDBModalFooter>   
        </>
    )
}

export default SearchModal;