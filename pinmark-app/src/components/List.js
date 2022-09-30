import { Link } from 'react-router-dom';
// generic list component -- used for list of pinmarks
import { listArray } from "../assets/fakeData";

function List () {
    
    //styles
    const containerDivStyle = {
        // display: 'flex',
        // flexWrap: 'wrap',
        // justifyContent: 'center',
        // alignItems: 'flex-start',
        // overflowX: 'hidden',
        // overflowY: 'scroll',
        // height: 500
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
        <div style={containerDivStyle} className="row align-items-md-stretch">
            {
                listArray.map((item) => {
                    return (
                        <Link 
                            className="col-md-6 p-3"
                            to="/PinmarkDetail"
                        >
                            <div className="h-100 p-5 text-bg-dark rounded-3">                                                  
                                <h1 style={labelStyle}>{item.name}</h1>                          
                            </div>
                        </Link>
                    )
                })
            }
        </div>

    )
}

export default List;