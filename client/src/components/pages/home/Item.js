import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ListMusicContext } from '../../contexts/ListMusicContext';
import './style.css'

const HomeItem = ({ data }) => {
    const { listMusic, addMusic, setPlay, setAudioIndex } = useContext(ListMusicContext)

    const handleAddMusic = e => {
        addMusic({
            mid: e.id,
            src: e.src,
            title: e.name,
            artist: e.artist,
            img: e.img,
            tag: e.tag,
            localImg: e.localImg,
            localSrc: e.localSrc,
        })
        setAudioIndex(listMusic.length)
        setPlay(true)
    }
    return (
        <>
            <div className='home-content row'>
                {data.map((e, i) => (
                    <div key={i} className='col-mini col-6 col-sm-4 col-md-3 col-max'>
                        <div key={i} className='item'>
                            <div className='img'>
                                <div 
                                    onClick={() => handleAddMusic(e)}
                                    className='home-img-container'>
                                    <img
                                        src={e.localImg === 1
                                            ? (process.env.REACT_APP_API_SRC_AUDIO_IMG + e.img)
                                            : e.img
                                        }
                                        alt='avatar' />
                                        <div className='home-img-hover'></div>
                                </div>
                                <Link to={'/song/' + e.tag} className='info'>
                                    <div className='name'>
                                        {e.name}
                                    </div>
                                    <div className='singer'>
                                        {e.artist}
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </>
    );
};

export default HomeItem;