import React from 'react';
import { 
    MDBModalHeader,
    MDBRow,
    MDBCol,
    MDBModalBody, 
    MDBModalTitle,
    MDBListGroup,
    MDBListGroupItem,
    MDBBtn,
    MDBIcon,
    MDBModal,
    MDBModalFooter,
    MDBModalDialog,
    MDBModalContent,    
} from 'mdb-react-ui-kit';
import { useDispatch } from 'react-redux';
import { resetState } from '../redux/pinmarkSlice';
import { resetUserState } from '../redux/userSlice';
import { resetSharedState } from '../redux/sharedSlice';
import { Navigate } from 'react-router-dom';
import { signUserOut } from '../util/Firebase';

function AccountModal({handleCloseModal, handleDeleteAccountModal}) {
    
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(resetState());
        dispatch(resetUserState());
        dispatch(resetSharedState());
        signUserOut();
        return <Navigate to='/' replace />
    }

    return (
        <>
        <MDBModalHeader>
            <MDBRow className='w-100'>
                <MDBCol className='d-flex justify-content-between align-items-center'>
                    <MDBModalTitle>Account Settings</MDBModalTitle>
                </MDBCol>
            </MDBRow>
        </MDBModalHeader>
        <MDBModalBody style={{minHeight: '500px'}}>
            <MDBListGroup>
                <MDBListGroupItem>                    
                    <MDBBtn 
                        onClick={() => handleSignOut()} 
                        tag='a' 
                        color='none' 
                        className='text-dark m-1 d-flex justify-content-between align-items-center' 
                        style={{padding: 10}}>
                        Sign Out
                        <MDBIcon icon='sign-out-alt'/>
                    </MDBBtn>
                </MDBListGroupItem>
                <MDBListGroupItem color='danger'>                    
                    <MDBBtn 
                        onClick={() => handleDeleteAccountModal(true)} 
                        tag='a'
                        color='none' 
                        className='text-dark m-1 d-flex justify-content-between align-items-center' 
                        style={{padding: 10}}>
                        Delete Account
                        <MDBIcon icon='user-times'/>
                    </MDBBtn>
                </MDBListGroupItem>
            </MDBListGroup>
            
        </MDBModalBody>
        <MDBBtn 
            size='lg' 
            floating 
            tag='a' 
            style={{position:'absolute', bottom: 30, right: 30}}
            onClick={() => handleCloseModal(false)}
        >
            <MDBIcon fas icon='times'/>
        </MDBBtn>

        {/* Delete Account Confirmation Modal */}
        {/* <MDBModal staticBackdrop show={deleteAccountModal} setShow={setDeleteAccountModal}>
            <MDBModalDialog
                centered
                scrollable                
                className='justify-content-center align-item-center'
                >            
                <MDBModalContent>
                    <MDBModalHeader>
                        <MDBModalTitle>Delete Your Account?</MDBModalTitle>
                    </MDBModalHeader>
                    <MDBModalBody>
                        <p>Are you sure you want to delete your account?</p>
                        <p className='text-muted'>This cannot be undone and all of your data will be deleted.</p>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn onClick={() => setDeleteAccountModal(false)}>Cancel</MDBBtn>
                        <MDBBtn color='danger' onClick={() => handleDeleteAccount()}>Delete My Account</MDBBtn>
                    </MDBModalFooter>
                </MDBModalContent>
            </MDBModalDialog>
        </MDBModal> */}
        </>
    )
}

export default AccountModal;
