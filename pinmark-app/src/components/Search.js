import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit';

function Search({showSearch, setShowSearch}) {
    // const [fullscreenXlModal, setFullscreenXlModal] = useState(true);

    const toggleShow = () => setShowSearch(!showSearch);
  
    return (
      <>
        {/* <MDBBtn onClick={toggleShow}>Full screen below xl</MDBBtn> */}
        <MDBModal tabIndex='-1' show={showSearch} setShow={setShowSearch}>
          <MDBModalDialog size='fullscreen-xl-down'>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>
                    <div className="input-group rounded">
                        <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon"/>
                        <span className="input-group-text-border-0" id="search-addon">
                            <button type="button" className="btn btn-outline-primary">search</button>
                        </span>
                    </div>
                </MDBModalTitle>
                <MDBBtn
                  type='button'
                  className='btn-close'
                  color='none'
                  onClick={toggleShow}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
              
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn type='button' color='secondary' onClick={toggleShow}>
                  Close
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>
    );

}

export default Search;