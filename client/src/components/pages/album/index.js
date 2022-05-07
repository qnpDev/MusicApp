import React, { useEffect, useState } from 'react';
import Loading from '../loading';
import './style.css'
import api from '../../axios'
import Pagination from 'react-js-pagination';
import { useNavigate } from 'react-router-dom';

const Album = () => {
    document.title = 'Albums'
    const navigate = useNavigate()
    const [data, setData] = useState()
    const limit = 10
    const [curPage, setCurPage] = useState(1)

    useEffect(() => {
        api.get('api/album/list', {
            params: {
                limit,
                page: curPage
            }
        }).then(res => setData(res.data))
    }, [curPage])
    if(!data)
        return ( <Loading /> )
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <h2>Album List</h2>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    <div className='table-responsive p-0'>
                        <table className='table align-items-center mb-0 album-table'>
                            <thead>
                                <tr>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Album</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Tag</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Song number</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Upload by</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.map((e, i) => (
                                    <tr key={i} className='album-table-item' onClick={() => navigate('/album/'+e.tag)}>
                                        <td>
                                            <div className='d-flex px-2 py-1'>
                                                <div>
                                                    <img src={e.localImg === 1
                                                        ? process.env.REACT_APP_API_SRC_ALBUM_IMG + e.img
                                                        : e.img
                                                        } className='avatar avatar-sm me-3' alt={e.name} />
                                                </div>
                                                <div className='d-flex flex-column justify-content-center'>
                                                    <h6 className='mb-0 text-sm wraptext'>{e.name}</h6>
                                                    <p className='text-xs text-secondary mb-0 wraptext'>{e.artist}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='align-middle'>
                                            <span className='text-secondary text-xs font-weight-bold wraptext'>{e.tag}</span>
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{e.songCount}</span>
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold wraptext'>{e.user.name}</span>
                                        </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {data.songLength > 6 && (
                <div className='card-footer d-flex justify-content-end'>
                    <Pagination
                        activePage={curPage}
                        itemsCountPerPage={limit}
                        totalItemsCount={data.size}
                        pageRangeDisplayed={2}
                        onChange={e => setCurPage(e)}
                        itemClass='page-item cursor-pointer'
                        linkClass='page-link cursor-default'
                        innerClass='pagination pagination-info'
                        disabledClass='page-item disabled'
                        hideDisabled={true}
                    />
                </div>
                )}
            </div>
        </>
    );
};

export default Album;