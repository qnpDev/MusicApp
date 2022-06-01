import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import NotFound from '../notfound';
import api from '../../axios'
import Loading from '../loading';
import DefaultAvatar from '../../assets/avatar-default.png'

import {
    AiOutlineDownload,
    AiOutlinePlayCircle,
} from 'react-icons/ai'
import {
    BiListPlus,
} from 'react-icons/bi'
import {
    FaHeadphonesAlt,
} from 'react-icons/fa'
import { ListMusicContext } from '../../contexts/ListMusicContext';
import HomeItem from '../home/Item';
import HomeTop from '../home/Top';
import HomeListAlbum from '../home/HomeListAlbum';
import { UserContext } from '../../contexts/UserContext';

const DetailSong = () => {
    document.title = 'Song'
    const { tag } = useParams();
    const [data, setData] = useState()
    const navigate = useNavigate()
    const { listMusic, addMusic, setAudioIndex, setPlay } = useContext(ListMusicContext)
    const { dataUser } = useContext(UserContext)

    const handlePlayNow = e => {
        addMusic({
            mid: e.id,
            src:    e.src,
            title: e.name,
            artist: e.artist,
            img:    e.img,
            tag: e.tag,
            localImg: e.localImg,
            localSrc: e.localSrc,
        })
        setAudioIndex(listMusic.length)
        setPlay(true)
    }

    const handleAddPlaylist = e => {
        addMusic({
            mid: e.id,
            src:    e.src,
            title: e.name,
            artist: e.artist,
            img:    e.img,
            tag: e.tag,
            localImg: e.localImg,
            localSrc: e.localSrc,
        })
    }

    useEffect(() => {
        api.get('api/Song/' + tag).then(res => {
            setData(res.data)
        })
    }, [tag])

    if (!tag)
        return <NotFound />
    if (!data)
        return <Loading />
    if (!data.success)
        return <NotFound />
    document.title = data.song.name + ' | ' + data.song.artist
    return (
        <>
            <div className='song-main'>
                <div className='row'>
                    <div className='col-xl-9 col-12 song-left'>
                        <div className='card p-3 mb-4'>
                            <div className='song-current'>
                                <div className='song-img'>
                                    <img 
                                        alt={data.song.name}
                                        src={data.song.localImg === 1
                                        ? (process.env.REACT_APP_API_SRC_AUDIO_IMG + data.song.img)
                                        : data.song.img
                                    }
                                    />
                                    <div className='listens'>
                                        <FaHeadphonesAlt/> <b>{data.song.listen}</b>
                                    </div>
                                </div>
                                <div className='song-info'>
                                    <div className='name'>
                                        {data.song.name}
                                    </div>
                                    <div className='artist'>
                                        {data.song.artist}
                                    </div>
                                    {data.song.album && (
                                        <div className='album'>
                                            <b>Album: </b>{data.album.name}
                                        </div>
                                    )}
                                    {dataUser && dataUser.role >= 10 && (
                                        <div 
                                            onClick={() => navigate('/admin/song/edit/'+ data.song.tag)}
                                            className='btn btn-sm bg-gradient-warning mb-0 mt-3'>
                                            Update
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className='song-current-action'>
                                <div className='author'>
                                    <div className='avatar'>
                                        <img alt={data.author.name} src={data.author.avatar ? data.author.avatar : DefaultAvatar} />
                                    </div>
                                    <div onClick={() => navigate('/user/' + data.author.id)} className='info cursor-pointer'>
                                        {data.author.name}
                                    </div>
                                </div>
                                <div className='action'>
                                    <a href={data.song.localSrc === 1
                                        ? process.env.REACT_APP_API_SRC_AUDIO + data.song.src
                                        : data.song.src
                                    } className='btn btn-outline-primary'>
                                        <AiOutlineDownload /> <span className='action-text'> Download</span> 
                                    </a>
                                    <div className='btn btn-outline-success' onClick={() => handlePlayNow(data.song)}>
                                        <AiOutlinePlayCircle /> <span className='action-text'> Play Now</span>
                                    </div>
                                    <div className='btn btn-outline-info' onClick={() => handleAddPlaylist(data.song)}>
                                        <BiListPlus /> <span className='action-text'> Add to Playlists</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {data.same.album.length > 0 && (
                            <div className='card p-3 mb-4'>
                                <div className='text-dark font-weight-bolder mb-4 pt-2'>Cùng album</div>
                                <HomeItem data={data.same.album} />
                            </div>
                        )}
                        {data.same.category.length > 0 && (
                            <div className='card p-3 mb-4'>
                                <div className='text-dark font-weight-bolder mb-4 pt-2'>Cùng thể loại</div>
                                <HomeItem data={data.same.category} />
                            </div>
                        )}
                        {data.same.author.length > 0 && (
                            <div className='card p-3 mb-4'>
                                <div className='text-dark font-weight-bolder mb-4 pt-2'>Cùng người tải lên</div>
                                <HomeItem data={data.same.author} />
                            </div>
                        )}

                    </div>
                    <div className='col-xl-3 col-12 song-right'>
                        <HomeTop/>
                        <HomeListAlbum />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetailSong;