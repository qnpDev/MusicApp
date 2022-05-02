import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import NotPermission from '../../../notpermission';
import api from '../../../../axios'
import { toast } from 'react-toastify';
import Loading from '../../../loading';
import './style.css'
import { useNavigate } from 'react-router-dom';

const CrawlSongNCT = () => {
    document.title = 'Nhaccuatui Song Tool | Admin'
    const navigate = useNavigate()
    const { dataUser } = useContext(UserContext)
    const [data, setData] = useState()
    const [btnLoading, setBtnLoading] = useState(false)
    const [link, setLink] = useState('')
    const [per, setPer] = useState(true)
    const [listCategory, setListCategory] = useState()
    const [listAlbum, setListAlbum] = useState()
    const [btnUpload, setBtnUpload] = useState(false)

    const handleGet = () => {
        setData()
        setBtnLoading(true)
        api.get('api/admin/tool/nhaccuatui', {
            params: {
                uri: link
            }
        }).then(res => {
            if (res.data?.success === false) {
                toast.error(res.data.message)
            } else {
                setData(res.data)
                toast.success('Successful!')
            }
            setBtnLoading(false)
        })
    }

    const handleSave = () => {
        if (data.name.trim().length === 0)
            toast.error('Enter song name!')
        else if (data.artist.trim().length === 0)
            toast.error('Enter song artist!')
        else if (data.category === -1)
            toast.error('Choose song category!')
        else {
            let formData = new FormData()
            formData.append('localimg', 0)
            formData.append('localsrc', 0)
            formData.append('img', data.img)
            formData.append('src', data.src)
            formData.append('name', data.name)
            formData.append('artist', data.artist)
            formData.append('category', data.category)
            formData.append('album', data.album || -1)
            formData.append('show', 1)

            const load = toast.loading('Wait...')
                setBtnUpload(true)
                api.post('api/admin/song/create', formData).then(res => {
                    if (res.data.success) {
                        toast.success('Upload success!')
                        setData()
                        setLink('')
                    } else {
                        
                        toast.error(res.data.message)
                    }
                    setBtnUpload(false)
                    toast.dismiss(load)
                })
        }
    }

    useEffect(() => {
        api.get('api/admin/home/allalbum').then(res => {
            if (res.status === 403) {
                setPer(false)
            } else {
                setListAlbum(res.data)
            }
        })
        api.get('api/admin/home/allcategory').then(res => {
            if (res.status === 403) {
                setPer(false)
            } else {
                setListCategory(res.data)
            }
        })
    }, [])

    if (!dataUser || dataUser.role < 10 || !per)
        return (<NotPermission />)
    return (
        <>
            <div className='card'>
                <div className='card-header pb-0'>
                    <h3>Crawl Nhaccuatui song</h3>
                </div>
                <div className='card-body'>
                    <div className='d-flex justify-content-center'>
                        <input
                            className='form-control'
                            placeholder='Input nhaccuatui link'
                            type='text'
                            value={link}
                            onChange={e => setLink(e.target.value)}
                        />
                    </div>
                    <div className='text-end text-sm mt-1'>
                        <b>Example: </b>https://www.nhaccuatui.com/bai-hat/da-vu-tang-duy-tan.8Q8yLCcES92H.html
                    </div>
                    <div className='d-flex justify-content-center mt-3'>
                        <button
                            disabled={btnLoading}
                            onClick={handleGet}
                            className='btn btn-info'>Get song</button>
                    </div>
                    {btnLoading && (
                        <Loading />
                    )}
                    {data && (
                        <>
                            <div className='horizontal-line'></div>
                            <div className='text-center'>
                                <img
                                    className='avatar crawl-song-img'
                                    src={data.img}
                                    alt='img data crawl'
                                />
                            </div>
                            <div className='form-group mt-3'>
                                <label for='name' className='form-control-label'>Name</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={data.name}
                                    onChange={e => setData(prev => ({ ...prev, name: e.target.value }))}
                                    id='name'
                                />
                            </div>
                            <div className='form-group'>
                                <label for='artist' className='form-control-label'>Artist</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={data.artist}
                                    onChange={e => setData(prev => ({ ...prev, artist: e.target.value }))}
                                    id='artist'
                                />
                            </div>
                            <div className='form-group'>
                                <label for='img' className='form-control-label'>Source Image</label>
                                <input
                                    disabled={true}
                                    className='form-control'
                                    type='text'
                                    value={data.img}
                                    onChange={e => setData(prev => ({ ...prev, img: e.target.value }))}
                                    id='img'
                                />
                            </div>
                            <div className='form-group'>
                                <label for='src' className='form-control-label'>Source Audio</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    value={data.src}
                                    onChange={e => setData(prev => ({ ...prev, src: e.target.value }))}
                                    id='src'
                                    disabled={true}
                                />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="category">Category: </label>
                                <select
                                    onChange={e => setData(prev => ({ ...prev, category: e.target.value }))}
                                    className="form-control"
                                    defaultValue={data.category || -1}
                                    id="category"
                                >
                                    <option value={-1} disabled>Choose Category</option>
                                    {listCategory?.map(e => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='form-group'>
                                <div className='d-flex justify-content-between align-items-end'>
                                    <div>
                                        <label htmlFor="album">Album: </label>
                                    </div>
                                    <div className='d-flex justify-content-end'>
                                        <div onClick={() => navigate('/manage/create-album')} className='btn btn-sm btn-outline-success'>Create new album</div>
                                    </div>
                                </div>

                                <select
                                    onChange={e => setData(prev => ({ ...prev, album: e.target.value }))}
                                    className="form-control"
                                    defaultValue={data.album || -1}
                                    id="album"
                                >
                                    <option value={-1}>Không có album</option>
                                    {listAlbum?.map(e => (
                                        <option key={e.id} value={e.id}>{e.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='text-end mt-5'>
                                <button 
                                    disabled={btnUpload}
                                    onClick={handleSave} 
                                    className='btn btn-success'>Save</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CrawlSongNCT;