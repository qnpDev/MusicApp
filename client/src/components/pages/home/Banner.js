import React from 'react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Slider from "react-slick";
import { Link } from 'react-router-dom';
import { SiNextcloud } from 'react-icons/si'

const HomeBanner = ({ data }) => {
    return (
        <>
            <Slider {...{
                arrows: false,
                dots: false,
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                speed: 3000,
                autoplaySpeed: 3000,
                cssEase: "linear",
                pauseOnHover: true,
            }}>
                {data.map((e, i) => (
                    <div key={i} >
                        <div className='home-banner-img'>
                            <img
                                src={e.localImg === 1 ? (process.env.REACT_APP_API_SRC_AUDIO_IMG + e.img) : e.img}
                                alt={e.name} />
                            <div className='home-banner-info'>
                                <h2 className='banner-name' style={{ color: (e.colorTitle || 'white') }}>
                                    {e.name}
                                </h2>
                                <div className='banner-info' style={{ color: (e.colorInfo || 'white') }}>
                                    {e.info}
                                </div>
                            </div>
                            {e.localLink === 1
                                ? (
                                    <Link to={e.link} className='home-banner-seemore'>
                                        Xem thêm <SiNextcloud />
                                    </Link>
                                )
                                : (
                                    <a href={e.link} className='home-banner-seemore'>
                                        Xem thêm <SiNextcloud />
                                    </a>
                                )}

                        </div>
                    </div>
                ))}

            </Slider>
        </>
    );
};

export default HomeBanner;