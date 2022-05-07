import React, { useEffect, useState } from 'react';
import './search.css'
import api from '../../axios'
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const navigate = useNavigate()
    const [value, setValue] = useState('')
    const [data, setData] = useState()

    useEffect(() => {
        if (value.trim().length > 0) {
            const timeId = setTimeout(() => {
                api.get('api/search', {
                    params: {
                        value
                    }
                }).then(res => {
                    setData(res.data)
                })
            }, 1000)
            return () => clearTimeout(timeId)
        }
    }, [value])
    return (
        <>
            <div className='ms-md-auto pe-md-3 d-flex align-items-center search-container'>
                <div className='search-wrap'>
                    <div className='input-group'>
                        <span className='input-group-text text-body'><i className='fas fa-search' aria-hidden='true'></i></span>
                        <input
                            type='text'
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className='search-input form-control'
                            placeholder='Search here...' />
                    </div>
                    <div  className='search-show'>
                        {data ? (
                            <>
                                {data?.song.length > 0 && (
                                    <>
                                        <span className='text-sm fw-bolder'>Songs</span>
                                        <ul>
                                            {data?.song && data.song.map(e => (
                                                <li key={e.id} onClick={() => navigate('/song/'+e.tag)}>
                                                    <div className='d-flex justify-content-center align-items-center'>
                                                        <img
                                                            src={e.localImg === 1
                                                                ? (process.env.REACT_APP_API_SRC_AUDIO_IMG + e.img)
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
                                    </>
                                )}

                                {data?.album.length > 0 && (
                                    <>
                                        <span className='text-sm fw-bolder'>Album</span>
                                        <ul>
                                            {data?.album && data.album.map(e => (
                                                <li key={e.id}>
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
                                    </>
                                )}

                            </>
                        ) : (
                            <span className='text-sm'> Input text search...</span>
                        )}

                    </div>
                </div>

            </div>
        </>
    );
};

export default Search;