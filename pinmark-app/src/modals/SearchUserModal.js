import { MDBCard, MDBCardBody, MDBCardTitle, MDBInputGroup, MDBModalBody, MDBModalFooter, MDBModalHeader } from 'mdb-react-ui-kit';
import React from 'react';
import { fetchUserInfo } from '../util/Firebase';

function SearchUserModal() {
const [firebaseUsers, setFirebaseUsers] = React.useState([]);

const fetchUsers = () => {
    fetchUserInfo()
    .then(result => {
        setFirebaseUsers(result);
    })
}
    return (
        <>
            <MDBModalHeader>
                <MDBInputGroup>
                    <input placeholder='Search Users'/>
                </MDBInputGroup>
            </MDBModalHeader>
            <MDBModalBody>
                <MDBROw>
                    {
                        firebaseUsers.map((user) => {
                            return (
                                <MDBCol>
                                    <MDBCard>
                                        <MDBCardBody>
                                            <MDBCardTitle>{user.email}</MDBCardTitle>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            )
                        })
                    }
                </MDBROw>
            </MDBModalBody>
            <MDBModalFooter>

            </MDBModalFooter>

        </>
    )
}

export default SearchUserModal;