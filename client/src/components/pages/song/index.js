import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import { useNavigate } from 'react-router-dom';
import api from '../../axios'
import './style.css'
import Loading from '../loading';

const Song = () => {
    document.title = 'Song list'
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [category, setCategory] = useState()
    const limit = 10
    const [curPage, setCurPage] = useState(1)
    const [categoryChoosen, setCategoryChoosen] = useState([])

    const handleCategory = id => {
        if(categoryChoosen.includes(id))
            setCategoryChoosen(prev => prev.filter(e => e !== id))
        else
            setCategoryChoosen(prev => [...prev, id])
    }
    useEffect(() => {
        api.get('api/category').then(res => {
            if (res.data?.success)
                setCategory(res.data.data)
        })
    }, [])
    useEffect(() => {
        api.post('api/song', JSON.stringify(categoryChoosen), {
            params: {
                page: curPage,
                limit,
            }
        }).then(res => {
            setData(res.data)
        })
    }, [curPage, categoryChoosen])
    if (!category)
        return (<Loading />)
    return (
        <>
            <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <h2>Song List</h2>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    <div className='mx-4 my-2 song-select-category'>
                        <div className='d-flex justify-content-left list'>
                            {category && category.map((e, i) => (
                                <div 
                                    key={i} 
                                    className={categoryChoosen.includes(e.id) ? 'item item-active' : 'item'}
                                    onClick={() => handleCategory(e.id)}
                                >{e.name}</div>
                            ))}
                        </div>
                    </div>
                    {!data ? (
                        <Loading />
                    ) : (
                        <div className='table-responsive p-0'>
                            <table className='table align-items-center mb-0 album-table'>
                                <thead>
                                    <tr>
                                        <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Song</th>
                                        <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Album</th>
                                        <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Category</th>
                                        <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Listens</th>
                                        <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Upload by</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((e, i) => (
                                        <tr key={i} className='album-table-item' onClick={() => navigate('/song/' + e.tag)}>
                                            <td>
                                                <div className='d-flex px-2 py-1'>
                                                    <div>
                                                        <img src={e.localImg === 1
                                                            ? process.env.REACT_APP_API_SRC_AUDIO_IMG + e.img
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
                                                <span className='text-secondary text-xs font-weight-bold wraptext'>{e.album}</span>
                                            </td>
                                            <td className='align-middle'>
                                                <span className='text-secondary text-xs font-weight-bold wraptext'>{e.category}</span>
                                            </td>
                                            <td className='align-middle text-center'>
                                                <span className='text-secondary text-xs font-weight-bold'>{e.listen}</span>
                                            </td>
                                            <td className='align-middle text-center'>
                                                <span className='text-secondary text-xs font-weight-bold wraptext'>{e.user}</span>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
                {data && data.size > limit && (
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

export default Song;