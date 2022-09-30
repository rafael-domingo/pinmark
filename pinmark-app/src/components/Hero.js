// hero banner for PinmarkList page
import Image from '../assets/los-angeles.jpeg';

function Hero() {

    // styles
    const containerDivStyle = {
        width: '100%',
        height: 200,        
        position: 'relative'
    }

    const imageContainerStyle = {
        width: '100%',
        height: '100%'
    }

    const imageStyle = {
        width: '100%',
        height: 200,
        objectFit: 'cover'
    }

    const labelStyle = {
        position: 'absolute', 
        bottom: 10, 
        left: 40,
        // color: 'white'
    }
    return (
        <div style={containerDivStyle} className="p-5 mb-4 bg-light rounded-3">
            <div style={imageContainerStyle} className="card-img-overlay">
                <img src={Image} style={imageStyle}/>                
            </div>
            <h1 style={labelStyle} className="display-5 fw-bold">Los Angeles, California</h1>
        </div>
    )
}

export default Hero;