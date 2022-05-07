import React, { useContext, useEffect, useState } from 'react';
import {
    BsPlay,
} from 'react-icons/bs'
import { FaHeadphonesAlt } from 'react-icons/fa'
import {
    AiOutlinePlusCircle
} from 'react-icons/ai'
import { ListMusicContext } from '../../contexts/ListMusicContext';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'
import Loading from '../loading';

const HomeTop = () => {
    const { listMusic, addMusic, setPlay, setAudioIndex } = useContext(ListMusicContext)
    const navigate = useNavigate()
    const [data, setData] = useState()

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

    useEffect(() => {
        api.get('api/Home/top').then(res => {
            setData(res.data)
        })
    }, [])

    if (!data)
        return <Loading />
    return (
        <>
            <div className='home-list-top card p-3 mb-4'>
                <div className='content-top'>
                    <div className='top-week'>
                        <div className='text-dark font-weight-bolder mb-4 pt-2'>Top week</div>
                        <ul>
                            {data.topweek.map((e, i) => (
                                <li key={i} className='item'>
                                    <div className='left cursor-default'>
                                        {i + 1}
                                    </div>
                                    <div className='center' onClick={() => navigate('/song/' + e.tag)}>
                                        <div className='img'>
                                            <img src={e.localImg === 1
                                                ? (process.env.REACT_APP_API_SRC_AUDIO_IMG + e.img)
                                                : e.img
                                            }
                                                alt='img song' />
                                        </div>
                                        <div className='info'>
                                            <div className='info-name'>
                                                {e.name}
                                            </div>
                                            <div className='info-singer'>
                                                {e.artist}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='center2'>
                                        {e.listen} <FaHeadphonesAlt />
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
                    </div>
                </div>
            </div>
            <div className='home-list-top card p-3 mb-4'>
                <div className='content-top'>
                    <div className='top-month'>
                        <div className='text-dark font-weight-bolder mb-4 pt-2'>Top month</div>
                        <ul>
                            {data.topmonth.map((e, i) => (
                                 <li key={i} className='item'>
                                    <div className='left cursor-default'>
                                        {i + 1}
                                    </div>
                                    <div className='center' onClick={() => navigate('/song/' + e.tag)}>
                                        <div className='img'>
                                            <img src={e.localImg === 1
                                                ? (process.env.REACT_APP_API_SRC_AUDIO_IMG + e.img)
                                                : e.img
                                            }
                                                alt='img song' />
                                        </div>
                                        <div className='info'>
                                            <div className='info-name'>
                                                {e.name}
                                            </div>
                                            <div className='info-singer'>
                                                {e.artist}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='center2'>
                                        {e.listen} <FaHeadphonesAlt />
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomeTop;