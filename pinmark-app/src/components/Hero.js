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
        color: 'white'
    }
    return (
        <div style={containerDivStyle}>
            <div style={imageContainerStyle}>
                <img src={Image} style={imageStyle}/>                
            </div>
            <h1 style={labelStyle}>Los Angeles, California</h1>
        </div>
    )
}

export default Hero;