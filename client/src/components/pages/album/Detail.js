import React, { useContext, useEffect, useState } from 'react';
import HomeTop from '../home/Top';
import api from '../../axios'
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../loading';
import NotFound from '../notfound';
import DetailPlaylist from './DetailPlaylist';
import { UserContext } from '../../contexts/UserContext';

const AlbumDetail = () => {
    const { tag } = useParams()
    const navigate = useNavigate()
    const [notFound, setNotFound] = useState(false)
    const [data, setData] = useState()
    const [randomalbum, setRandomAlbum] = useState()
    const { dataUser } = useContext(UserContext)

    useEffect(() => {
        api.get('api/album', {
            params: {
                tag
            }
        }).then(res => {
            if (res.data.success) {
                setData(res.data.data)
            } else {
                setNotFound(true)
            }
        })
    }, [tag])
    useEffect(() => {
        api.get('api/home/randomalbum').then(res => {
            setRandomAlbum(res.data)
        })
    }, [])
    if (!data && !notFound)
        return (<Loading />)
    if (notFound)
        return (<NotFound />)
    document.title = 'Album ' + data.album.name + ' - ' + data.album.artist
    return (
        <>
            <div className='album-detail-container'>
                <div className='row'>
                    <div className='col-lg-9 col-12'>
                        <div className='row'>
                            <div className='col-lg-6 col-12'>
                                <div className='card p-3 mb-4 py-5'>
                                    <div className='album-detail-info'>
                                        <div className='album-img d-flex justify-content-center align-items-center'>
                                            <img
                                                className='avatar'
                                                src={data.album.localImg === 1
                                                    ? process.env.REACT_APP_API_SRC_ALBUM_IMG + data.album.img
                                                    : data.album.img
                                                }
                                                alt={data.album.name}
                                            />
                                        </div>
                                        <div className='mt-3 album-info text-center'>
                                            <h1 className='fw-bolder'>{data.album.name}</h1>
                                            <div className='text-sm artist'>{data.album.artist}</div>
                                        </div>
                                        <div className='mt-4 text-center'>
                                            <span className='fw-bolder cursor-default'>Author: </span>
                                            <span className='album-author' onClick={() => navigate('/user/' + data.album.user.id)}>{data.album.user.name}</span>
                                        </div>
                                        {dataUser && dataUser.role >= 10 && (
                                            <div className='mt-4 text-center'>
                                                <button
                                                    onClick={() => navigate('/admin/album/edit/' + tag)}
                                                    className='btn btn-sm m-0 bg-gradient-warning'>
                                                        Update
                                                    </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-6 col-12'>
                                <DetailPlaylist data={data.song} />
                            </div>
                        </div>
                        <div className='card p-3 mb-4'>
                            {randomalbum && (
                                <div className='overflow-hidden position-relative border-radius-lg bg-cover h-100'>
                                    <div className='text-dark font-weight-bolder mb-4 pt-2'>Some albums</div>
                                    <div className='home-content row'>
                                        {randomalbum.map((e, i) => (
                                            <div 
                                                key={i} 
                                                onClick={() => navigate('/album/' + e.tag)}
                                                className='col-mini col-6 col-sm-4 col-md-3 col-max cursor-pointer'>
                                                <div className='item'>
                                                    <div className='img'>
                                                        <img
                                                            src={e.localImg === 1
                                                                ? (process.env.REACT_APP_API_SRC_ALBUM_IMG + e.img)
                                                                : e.img
                                                            }
                                                            alt='avatar' />
                                                        <div onClick={() => navigate('/album/' + e.tag)} className='info'>
                                                            <div className='name'>
                                                                {e.name}
                                                            </div>
                                                            <div className='singer'>
                                                                {e.artist}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            )}
                        </div>


                    </div>
                    <div className='col-lg-3 col-12'>
                        <HomeTop />
                    </div>
                </div>
            </div>

        </>
    );
};

export default AlbumDetail;