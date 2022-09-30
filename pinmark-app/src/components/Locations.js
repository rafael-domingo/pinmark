import { Link } from 'react-router-dom'
import { locationArray } from "../assets/fakeData";
import Image from '../assets/los-angeles.jpeg';
function Locations() {

    // styles
    const containerDivStyle = {
        display: 'flex',
        height: '300px',
        overflowX: 'scroll',
        overflowY: 'hidden'
    }

    const locationDivStyle = { 
        // display: 'flex',
        // flexWrap: 'wrap', 
        // justifyContent: 'center', 
        // alignItems: 'flex-end', 
        // border: 'solid 1px black', 
        margin: 20,
        width: 200,
        flex: '0 0 auto' // keeps size of box constant 
    }


    return (
        <div style={containerDivStyle}>
            {
                locationArray.map((location) => {
                    return (
                        <Link 
                        to="/PinmarkList"
                        style={locationDivStyle} className="card text-bg-dark">
                            <img src={Image} 
                            className="card-img" style={{objectFit: 'cover', height: '100%'}}/>
                            <div className="card-img-overlay">
                                <h3 className="card-title">{location.city}</h3>
                                <p className="card-subtitle mb-2">{location.state}</p>
                            </div>                        
                        </Link>

                    )
                })
            }           
        </div>
    )

}

export default Locations;