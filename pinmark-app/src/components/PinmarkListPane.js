import React from 'react';
import { 
    MDBInputGroup,
    MDBBtn,
    MDBTypography,
    MDBIcon,
    MDBRow,
    MDBCol,
    MDBCardBody
} from 'mdb-react-ui-kit';
import PinmarkCards from './PinmarkCards';

function PinmarkListPane({
    handlePinmarkSearchInput,
    pinmarkSearchInput,
    pinmarkCardSort,
    setShowSearch,
    setPinmarkCardSort,
    pinmarkList,
    handleAddPinmark,
    handlePinmarkDetail,
    setCreateTripModal,
    tripList,
    category

}) {

    return (
        <>
        <MDBInputGroup 
            style={{
                padding:20,                            
            }} 
            className='d-flex justify-content-between'>
            <input 
                className="search form-control w-75" 
                type='text' 
                placeholder="Search your Pinmarks" 
                onChange={handlePinmarkSearchInput} 
                value={pinmarkSearchInput} 
                style={{
                    border: 'none', 
                    boxShadow: 'none',
                    background: 'none'
                    }}/>
            <MDBBtn color='link' className="text-muted w-25 d-flex align-items-center justify-content-end" onClick={() => {
                if (pinmarkCardSort === 'alphabetical') {
                    setPinmarkCardSort('newest');
                } else if (pinmarkCardSort === 'newest') {
                    setPinmarkCardSort('alphabetical');
                }   
                }}>
                {
                    pinmarkCardSort === 'alphabetical' && (                                
                        <>                                       
                            <MDBTypography tag='small'>Sort by Name</MDBTypography>                                    
                            <MDBIcon icon='sort-alpha-down' className="text-muted"/>
                        </>
                    )
                }
                {
                    pinmarkCardSort === 'newest' && (                                
                        <>                                       
                            <MDBTypography tag='small'>Sort by Date Added</MDBTypography>                                    
                            <MDBIcon icon='sort-down' className="text-muted"/>
                        </>
                    )
                }
            </MDBBtn>
        </MDBInputGroup>
        <MDBRow style={{padding: 20, margin: 0}}>
        <MDBCol size={12} className='mb-4'>
            {/* <MDBCard style={{background: 'none'}} className="h-100"> */}
                <MDBCardBody  className='d-flex justify-content-center align-items-center'>                               
                    <MDBBtn onClick={() => setShowSearch(true)} color='primary' className="text-white">                                                            
                        <MDBIcon icon='plus-circle'/> Add a Pinmark
                    </MDBBtn>
                </MDBCardBody>
            {/* </MDBCard> */}
        </MDBCol>                  
        <PinmarkCards 
            pinmarkList={pinmarkList} 
            category={category}
            handleAddPinmark={handleAddPinmark} 
            handlePinmarkDetail={handlePinmarkDetail} 
            setCreateTripModal={setCreateTripModal} 
            tripList={tripList}
        />                                        
        </MDBRow> 
        </>
    )
}

export default PinmarkListPane;
