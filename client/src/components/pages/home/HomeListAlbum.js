import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'
import Loading from '../loading';

const HomeListAlbum = () => {
    const navigate = useNavigate()
    const [data, setData] = useState()

    useEffect(() => {
        api.get('api/home/randomalbum').then(res => {
            setData(res.data)
        })
    }, [])
    if (!data)
        return (<Loading />)
    return (
        <>
            <div className='card p-3 mb-4 home-some-album'>
                <div className='overflow-hidden position-relative border-radius-lg bg-cover h-100'>
                    <div className='text-dark font-weight-bolder mb-4 pt-2'>Some albums</div>
                    <ul>
                        {data.map(e => (
                            <li key={e.id} onClick={() => navigate('/album/'+e.tag)}>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <img
                                        src={e.localImg === 1
                                            ? (process.env.REACT_APP_API_SRC_ALBUM_IMG + e.img)
                                            : e.img
                                        }
                                        alt={e.name}
                                    />
                                </div>
                                <div className='info'>
                                    <div className='info-name'>{e.name}</div>
                                    <div className='info-artist'>{e.artist}</div>
                                </div>
                            </li>
                        ))}


                    </ul>
                </div>
            </div>
        </>
    );
};

export default HomeListAlbum;