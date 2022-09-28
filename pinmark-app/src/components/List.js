// generic list component -- used for list of pinmarks
import { listArray } from "../assets/fakeData";

function List () {
    
    //styles
    const containerDivStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: 500
    }

    const itemDivStyle = {
        display: 'flex',
        justifyContent: 'flex-start',        
        width: '100%',        
        backgroundColor: 'gray',
        margin: 10,
        padding: 10,
        borderRadius: 10
    }

    const labelStyle = {
        width: '100%', 
        textAlign: 'left'
    }

    return (
        <div style={containerDivStyle}>
            {
                listArray.map((item) => {
                    return (
                        <div style={itemDivStyle}>
                            <h1 style={labelStyle}>{item.name}</h1>
                        </div>
                    )
                })
            }
        </div>

    )
}

export default List;