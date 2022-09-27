function Locations() {

    // styles
    const containerDiv = {
        display: 'flex',
        height: '300px',
        overflowX: 'scroll',
        overflowY: 'hidden'
    }

    const locationDiv = { 
        display: 'flex',
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        border: 'solid 1px black', 
        margin: 20,
        width: 200,
        flex: '0 0 auto' // keeps size of box constant 
    }

    // data
    const locationArray = [
        {
            city: 'Los Angeles',
            state: 'California'
        },
        {
            city: 'New Orleans',
            state: 'Louisiana'            
        },
        {
            city: 'San Francisco',
            state: 'California'
        },
        {
            city: 'New York City',
            state: 'New York'
        },
        {
            city: 'Salt Lake City',
            state: 'Utah'
        }
    ];

    return (
        <div style={containerDiv}>
            {
                locationArray.map((location) => {
                    return (
                        <div style={locationDiv}>
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