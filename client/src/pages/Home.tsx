import React from 'react';
import { CSSProperties } from 'react';

const Home: React.FC = () => {
    const imageStyle: CSSProperties = {
        height: '600px',
        objectFit: 'cover'
    };

    return (
        <div className="container mt-5">
            <div id="carouselExampleRide" className="carousel slide" data-bs-ride="true">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/home_1.jpg" className="d-block w-100" alt="Home 1" style={imageStyle} />
                        <div className="carousel-caption d-none d-md-block">
                            <h3>Find your dream property</h3>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="/home_2.jpg" className="d-block w-100" alt="Home 2" style={imageStyle} />
                        <div className="carousel-caption d-none d-md-block">
                            <h3>Find your dream property</h3>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img src="/home_3.jpg" className="d-block w-100" alt="Home 3" style={imageStyle} />
                        <div className="carousel-caption d-none d-md-block">
                            <h3>Find your dream property</h3>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};

export default Home;