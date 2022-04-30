import React, { useContext } from 'react';
import { ListMusicContext } from '../../contexts/ListMusicContext';
import {
    AiOutlineClose,
    AiOutlineEye,
} from 'react-icons/ai'
import { useNavigate } from 'react-router-dom';
const ListMedia = ({ audioIndex, setAudioIndex, audioRef, setPlay }) => {
    const { listMusic, removeMusic, removeAll } = useContext(ListMusicContext)
    const navigate = useNavigate()
    const handleSelect = e => {
        setAudioIndex(e % listMusic.length)
        audioRef.current.play();
        setPlay(true)
    }
    const handleDelete = e => {
        removeMusic(e)
        if (e < audioIndex) {
            setAudioIndex(prev => prev - 1)
        }
    }

    return (
        <>
            <div className='media-list-music'>
                <div className=' pt-2 list-title mt-3'>
                    <div className='text-dark font-weight-bolder'>Playlists</div>
                    <div className='media-listdelete-all'>
                        <button 
                            onClick={removeAll}
                            className='btn btn-sm btn-outline-danger m-0'
                        >Del all</button>
                    </div>
                </div>
                <ul>
                    {listMusic.length === 0
                        ? (
                            <div className='media-list-empty'>
                                
                            </div>
                        )
                        : listMusic.map((e, i) =>
                        (
                            <li
                                key={i}
                                className={(i === audioIndex) ? 'playlist-active' : ''}
                            >
                                <div
                                    className='media-list-left cursor-pointer'
                                    onClick={() => handleSelect(i)}
                                >
                                    <div className='media-list-img'>
                                        <img src={e.localImg === 1
                                            ? process.env.REACT_APP_API_SRC_AUDIO_IMG + e.img
                                            : e.img
                                        } alt='img music' />
                                    </div>
                                    <div className='media-list-info'>
                                        <div className='media-list-name'>
                                            {e.title}
                                        </div>
                                        <div className='media-list-singer'>
                                            <span>{e.artist}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='media-list-right'>
                                    <div className='media-list-goto'>
                                        <AiOutlineEye onClick={() => navigate('/song/'+e.tag)} />
                                    </div>
                                    {(i !== audioIndex)
                                        ? (
                                            <div className='media-list-remove'>
                                                <AiOutlineClose onClick={() => handleDelete(i)} />
                                            </div>
                                        )
                                        : null
                                    }

                                </div>
                            </li>
                        )
                        )}
                </ul>
            </div>
        </>
    );
};

export default ListMedia;