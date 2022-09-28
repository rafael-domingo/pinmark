import { locationArray } from "../assets/fakeData";

function Locations() {

    // styles
    const containerDivStyle = {
        display: 'flex',
        height: '300px',
        overflowX: 'scroll',
        overflowY: 'hidden'
    }

    const locationDivStyle = { 
        display: 'flex',
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        border: 'solid 1px black', 
        margin: 20,
        width: 200,
        flex: '0 0 auto' // keeps size of box constant 
    }


    return (
        <div style={containerDivStyle}>
            {
                locationArray.map((location) => {
                    return (
                        <div style={locationDivStyle}>
                            <h1 style={{width: '100%'}}>{location.city}</h1>
                            <h3>{location.state}</h3>
                        </div>
                    )
                })
            }           
        </div>
    )

}

export default Locations;