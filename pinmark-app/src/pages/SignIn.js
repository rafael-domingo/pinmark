import React from 'react';
import { signInWithGoogle, signUserOut } from '../util/Firebase';

function SignIn() {

    const handleSignInWithGoogle = () => {
        signInWithGoogle().then(result => {
            console.log(result);
        })
    }        

    const handleSignUserOut = () => {
        signUserOut().then(result => {
            console.log(result);
        })
    }

    return (
        <div>


        </div>
    )
}

export default SignIn;