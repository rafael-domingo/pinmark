import { categoryArray } from "../assets/fakeData";

function Categories() {

    // styles
    const containerDivStyle = {
        display: 'flex',
        height: '300px',
        overflowX: 'scroll',
        overflowY: 'hidden',
        height: 200
    }

    const categoryDivStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: 'solid 1px black',
        margin: 20,
        width: 150,
        height: 150,
        flex: '0 0 auto' // keesp size of box constant
    }

    return (
        <div style={containerDivStyle}>
            {
                categoryArray.map((category) => {
                    return (
                        <div style={categoryDivStyle}>
                            <p>{category}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Categories;