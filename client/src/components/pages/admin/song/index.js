import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../axios'
import Loading from '../../loading';
import NotPermission from '../../notpermission';

const AdminSong = () => {
    document.title = 'Admin Song'
    const navigate = useNavigate()
    const [data, setData] = useState()
    const [songShow, setSongShow] = useState()
    const [songHide, setSongHide] = useState()
    const [listCategory, setListCategory] = useState()
    const [listAlbum, setListAlbum] = useState()
    const [per, setPer] = useState(true)

    useEffect(() => {
        api.get('api/admin/song').then(res=> {
            if(res.status === 403){
                setPer(false)
            }
            if(res.status === 200){
                setListAlbum(res.data.album)
                setListCategory(res.data.category)
                const show = []
                const hide = []
                res.data.song.map(e => e.show === 1 ? show.push(e) : hide.push(e))
                setSongShow(show)
                setSongHide(hide)
                setData(res.data)
            }
        })
    })
    if(!per)
        return ( <NotPermission/> )
    if(!data)
        return ( <Loading/> )
    return (
        <>
            {/* <div className='card mb-4'>
                <div className='card-header pb-0'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>Songs</h6>
                        </div>
                        <div
                            onClick={() => navigate('/manage/upload-song')}
                            className='btn btn-info btn-sm'>Upload new song</div>
                    </div>
                </div>
                <div className='card-body px-0 pt-0 pb-2'>
                    <div className='table-responsive p-0'>
                        <table className='table align-items-center mb-0'>
                            <thead>
                                <tr>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Song</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Album</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Category</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Status</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Listen</th>
                                    <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Upload at</th>
                                    <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.song.map((e, i) => (
                                    <tr key={i}>
                                        <td>
                                            <div className='d-flex px-2 py-1'>
                                                <div>
                                                    <img src={e.song.localImg === 1 
                                                        ? process.env.REACT_APP_API_SRC_AUDIO_IMG + e.song.img
                                                        : e.song.img
                                                    } className='avatar avatar-sm me-3' alt={e.song.name} />
                                                </div>
                                                <div className='d-flex flex-column justify-content-center'>
                                                    <h6 className='mb-0 text-sm warptext'>{e.song.name}</h6>
                                                    <p className='text-xs text-secondary mb-0 warptext'>{e.song.artist}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {e.album.id === -1
                                                ? (
                                                    <span className='text-secondary text-xs font-weight-bold'>null</span>
                                                )
                                                : (
                                                    <>
                                                        <p className='text-xs font-weight-bold mb-0 warptext'>{e.album.name}</p>
                                                        <p className='text-xs text-secondary mb-0 warptext'>{e.album.artist}</p>
                                                    </>

                                                )}
                                        </td>
                                        <td className='align-middle text-center warptext'>
                                            <span className='text-secondary text-xs font-weight-bold'>{e.category.name}</span>
                                        </td>
                                        <td className='align-middle text-center text-sm cursor-default'>
                                            {e.song.show === 0
                                                ? (<span className='badge badge-sm bg-gradient-secondary'>Hide</span>)
                                                : (<span className='badge badge-sm bg-gradient-success'>Show</span>)
                                            }
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{e.song.listen}</span>
                                        </td>
                                        <td className='align-middle text-center'>
                                            <span className='text-secondary text-xs font-weight-bold'>{convertDateTime(e.song.createdAt)}</span>
                                        </td>
                                        <td className='align-middle'>
                                            <div className='text-secondary font-weight-bold text-xs cursor-pointer text-center'>
                                                {e.song.show === 1
                                                    ? (
                                                        <div onClick={() => handleChangeShow(e.song.id, i)} className='btn btn-sm btn-outline-secondary m-0 mx-1'>Hide</div>
                                                    )
                                                    : (
                                                        <div onClick={() => handleChangeShow(e.song.id, i)} className='btn btn-sm btn-outline-success m-0 mx-1'>Show</div>
                                                    )}
                                                <div onClick={() => handleDelete(e)} className='btn btn-sm btn-outline-danger m-0 mx-1'>Delete</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {data.songLength > limit && (
                <div className='card-footer d-flex justify-content-end'>
                    <Pagination
                        activePage={curPage}
                        itemsCountPerPage={limit}
                        totalItemsCount={data.songLength}
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
            </div> */}
        </>
    );
};

export default AdminSong;