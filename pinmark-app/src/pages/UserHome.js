// landing page for when user logs into their account -- 'Your locations' and 'Your categories'
import React from 'react';
import Locations from "../components/Locations";
import Categories from "../components/Categories";
import { Google } from '../util/Google';
import { v4 as uuidv4 } from 'uuid';
import { signInWithGoogle, signUserOut } from '../util/Firebase';

function UserHome() {
    const sessionToken = uuidv4();

    React.useEffect(() => {
        Google.placeSearch('french truck', null).then(data => console.log(data)).catch(e => console.log(e))
    })

    const handleSignInWithGoogle = () => {
        signInWithGoogle().then(result => {
            console.log(result);
        })
    }        

    return (
        <div>
            
            <div style={{display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                <h1 style={{width: '100%', textAlign: 'left'}}>Your Locations</h1>    
                <Locations />
            </div>
            <div onClick={handleSignInWithGoogle}>Sign In</div>
            <div style={{display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                <h1 style={{width: '100%', textAlign: 'left'}}>Your Categories</h1>    
                <Categories />
            </div>
        </div>
    )
}

export default UserHome;