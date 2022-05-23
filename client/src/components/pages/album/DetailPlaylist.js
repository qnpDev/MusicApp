import React, { useContext } from 'react';
import {
    BsPlay,
} from 'react-icons/bs'
import {
    AiOutlinePlusCircle
} from 'react-icons/ai'
import { ListMusicContext } from '../../contexts/ListMusicContext';
import { useNavigate } from 'react-router-dom';

const DetailPlaylist = ({ data }) => {
    const navigate = useNavigate()
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
    }

    const handlePlayMusic = e => {
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
    const handleAddAll = () => {
        data.map((e, i) => i === 0 ? handlePlayMusic(e) : handleAddMusic(e))
    }
    return (
        <>
            <div className='album-datail-playlist'>
                <div className='card p-3 mb-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div>
                            <h2>Playlists</h2>
                        </div>
                        <div className='text-end'>
                            <button onClick={handleAddAll} className='btn btn-sm bg-gradient-info'>Add all to playlist</button>
                        </div>
                    </div>
                    {(data && data.length > 0) ? (
                        <ul>
                            {data.map((e, i) => (
                                <li key={e.id}>
                                    <div className='left' onClick={() => navigate('/song/' + e.tag)}>
                                        <div className='d-flex justify-content-center align-items-center'>
                                            <img
                                                src={e.localImg === 1
                                                    ? (process.env.REACT_APP_API_SRC_AUDIO_IMG + e.img)
                                                    : e.img
                                                }
                                                alt={e.name}
                                            />
                                            <div className='info'>
                                                <div className='info-name wraptext'>{e.name}</div>
                                                <div className='info-artist wraptext'>{e.artist}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='right'>
                                        <BsPlay
                                            className='playnow'
                                            onClick={() => handlePlayMusic(e)} />
                                        <AiOutlinePlusCircle
                                            className='addtolist cursor-pointer'
                                            onClick={() => handleAddMusic(e)} />
                                    </div>


                                </li>
                            ))}
                        </ul>
                    )
                        : (
                            <div className='text-center'>
                                <p>The album have no song!</p>
                            </div>
                        )}

                </div>
            </div>
        </>
    );
};

export default DetailPlaylist;