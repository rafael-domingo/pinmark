// landing page for when user logs into their account -- 'Your locations' and 'Your categories'
import React from 'react';
import Locations from "../components/Locations";
import Categories from "../components/Categories";
import { Google } from '../util/Google';
import { v4 as uuidv4 } from 'uuid';
import { signInWithGoogle, signUserOut } from '../util/Firebase';
import Search from '../components/Search';
import { 
    MDBBtn, 
    MDBIcon,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBInputGroup,    
    MDBCard,
    MDBCardBody,
    MDBCardFooter,
    MDBCardTitle,
    MDBCardText,
    MDBCardImage,    
    MDBRipple,
    MDBRow,
    MDBCol,
    MDBCardHeader
} from 'mdb-react-ui-kit';

function UserHome() {
    const sessionToken = uuidv4();    
    const [showSearch, setShowSearch] = React.useState(false);
    const [searchInput, setSearchInput] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [secondModal, setSecondModal] = React.useState(false);
    const [detailInfo, setDetailInfo] = React.useState([]);
    React.useEffect(() => {
        Google.placeSearch('french truck', null).then(data => console.log(data)).catch(e => console.log(e))
        Google.placeDetails('ChIJD7fiBh9u5kcRYJSMaMOCCwQ', sessionToken).then(data => console.log(data)).then(e => console.log(e))
        Google.placePhotos('AcYSjRib2XvYOWznJfg3ORpwZcNmtZBnpOXAWJLeQ2mSa8oz6fzDiZPRHrj0GmFCLzlnLIT3nc1c4OMsiUT3En4R9t7SmeqaeCIis3ZmrVcbjCHcSjDX7rh8HnYRJ0ByaKBXDS-nHtM4Wxy62bTYb9_Hc-vGxe6VlYlvA3qzweynx1OpVLOb').then(data => console.log(data))
        
    }, [0])

    const handleSignInWithGoogle = () => {
        signInWithGoogle().then(result => {
            console.log(result);
        })
    }        

    const handleShowSearch = () => {
        setShowSearch(!showSearch);
        setSearchInput('');
        setSearchResults([]);
    }

    const handleShowDetails = (info) => {
        setSecondModal(true);        
        setDetailInfo(info);
    }

    const handleSearchInput = (e) => {
        console.log(e.target.value);
        setSearchInput(e.target.value);
        if (e.target.value.length > 3) {
            Google.placeSearch(e.target.value, null)
            .then(data => {
                console.log(data);
                handleSearchResults(data);
            })
            .catch(e => console.log(e))
        }
    }    
    const handleSearchResults = (results) => {
        setSearchResults(results.results);               
    }
    
    return (
        <div>
{/*             
            <div style={{display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                <h1 style={{width: '100%', textAlign: 'left'}}>Your Locations</h1>    
                <Locations />                
            </div>
            <div onClick={handleSearch}>Search</div>
            {showSearch && (<Search showSearch={showSearch} setShowSearch={setShowSearch}/>)}
            <div style={{display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                <h1 style={{width: '100%', textAlign: 'left'}}>Your Categories</h1>    
                <Categories />
            </div> */}
            <MDBBtn onClick={handleShowSearch} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                <MDBIcon fas icon='search'/>
            </MDBBtn>
            <MDBModal tabIndex='-1' show={showSearch && !secondModal} setShow={setShowSearch}>
                <MDBModalDialog size='fullscreen-xxl-down'>
                    <MDBModalContent>
                        <MDBModalHeader>  
                            <MDBInputGroup className='mb-3' noBorder textBefore={<MDBIcon fas icon='search' />}>
                                <input className='search form-control' type='text' placeholder='Search' onChange={handleSearchInput} value={searchInput} style={{border: 'none', boxShadow: 'none'}}/>
                            </MDBInputGroup>                      
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBRow>
                            {/* put list of search results here */}
                            {searchResults.map((result) => {
                                return (
                                    <MDBCol xxl={12} xl={4} l={4} md={4} className='mb-4'>
                                        <MDBCard>
                                            <MDBCardBody>
                                                <MDBCardTitle>{result.name}</MDBCardTitle>
                                                <MDBCardText>{result.formatted_address}</MDBCardText>                                            
                                            </MDBCardBody>
                                            <MDBCardFooter background='light' border='0' className='p-2 d-flex justify-content-around'>
                                                <MDBBtn onClick={() => handleShowDetails(result)} color='link' rippleColor='primary' className='text-reset m-0'>
                                                View <MDBIcon fas icon='eye' />
                                                </MDBBtn>
                                                <MDBBtn color='link' rippleColor='primary' className='text-reset m-0'>
                                                Add Pinmark <MDBIcon fas icon='plus' />
                                                </MDBBtn>
                                            </MDBCardFooter>
                                        </MDBCard>                      
                                    </MDBCol>                                                  
                                )
                            })}
                            </MDBRow>
                        </MDBModalBody>
                        <MDBModalFooter>
                        <MDBBtn onClick={handleShowSearch} size='lg' floating tag='a' style={{position:'absolute', bottom: 30, right: 30}}>
                            <MDBIcon fas icon='times'/>
                        </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            
            <MDBModal staticBackdrop show={secondModal} setShow={setSecondModal}>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBCardHeader>
                            
                            <MDBModalTitle>{detailInfo.name}</MDBModalTitle>
                        </MDBCardHeader>
                        
                        <MDBModalBody>
                            {detailInfo.formatted_address}
                            
                        </MDBModalBody>
                        <MDBModalFooter>
                        <MDBBtn color='link' onClick={() => {
                                setSecondModal(false)
                                setShowSearch(true);
                                }}>
                                    Back
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </div>
    )
}

export default UserHome;