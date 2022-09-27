function Categories() {

    // styles
    const containerDiv = {
        display: 'flex',
        height: '300px',
        overflowX: 'scroll',
        overflowY: 'hidden',
        height: 200
    }

    const categoryDiv = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'solid 1px black',
        margin: 20,
        width: 150,
        height: 150,
        flex: '0 0 auto' // keesp size of box constant
    }

    // data
     const categoryArray = [
        'Coffee',
        'Restaurants',
        'Museums',
        'Shopping',
        'Brunch',
        'Cocktails',
        'Landmarks'
     ]

    return (
        <div style={containerDiv}>
            {
                categoryArray.map((category) => {
                    return (
                        <div style={categoryDiv}>
                            <p>{category}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Categories;