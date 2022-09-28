// landing page for when user logs into their account -- 'Your locations' and 'Your categories'
import Locations from "../components/Locations";
import Categories from "../components/Categories";

function UserHome() {

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                <h1 style={{width: '100%', textAlign: 'left'}}>Your Locations</h1>    
                <Locations />
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap'}}>
                <h1 style={{width: '100%', textAlign: 'left'}}>Your Categories</h1>    
                <Categories />
            </div>
        </div>
    )
}

export default UserHome;