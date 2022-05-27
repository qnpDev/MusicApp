import React, { useContext, useState } from 'react';
import api from '../../../../axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../../contexts/UserContext';

const AdminCrawlResult = ({ data, setData, setLink, listCategory, listAlbum }) => {
    const navigate = useNavigate()
    const [btnUpload, setBtnUpload] = useState(false)
    const { dataUser } = useContext(UserContext)

    const handleSave = () => {
        if (data.name.trim().length === 0)
            toast.error('Enter song name!')
        else if (!data.artist || data.artist.trim().length === 0)
            toast.error('Enter song artist!')
        else if (!data.category || data.category === -1)
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
                toast.dismiss(load)
                if (res.data.success) {
                    toast.success('Upload success!')
                    setData()
                    setLink('')
                } else {
                    setBtnUpload(false)
                    toast.error(res.data.message)
                }
            })
        }
    }

    const handleDownload = () => {
        if (data.name.trim().length === 0)
            toast.error('Enter song name!')
        else if (!data.artist || data.artist.trim().length === 0)
            toast.error('Enter song artist!')
        else if (!data.category || data.category === -1)
            toast.error('Choose song category!')
        else {
            let formData = new FormData()
            formData.append('img', data.img)
            formData.append('src', data.src)
            formData.append('name', data.name)
            formData.append('artist', data.artist)
            formData.append('category', data.category)
            formData.append('album', data.album || -1)
            formData.append('show', 1)

            const load = toast.loading('Wait...')
            setBtnUpload(true)
            api.post('api/admin/tool/save-song', formData).then(res => {
                toast.dismiss(load)
                if (res.data.success) {
                    toast.success('Upload success!')
                    setData()
                    setLink('')
                } else {
                    setBtnUpload(false)
                    toast.error(res.data.message)
                }
            })
        }
    }

    const handleSaveTemp = () => {
        if (data.name.trim().length === 0)
            toast.error('Enter song name!')
        else if (!data.artist || data.artist.trim().length === 0)
            toast.error('Enter song artist!')
        else {
            let formData = new FormData()
            formData.append('img', data.img)
            formData.append('src', data.src)
            formData.append('name', data.name)
            formData.append('artist', data.artist)
            formData.append('uname', dataUser.name)

            const load = toast.loading('Wait...')
            setBtnUpload(true)
            api.post('api/admin/temp-crawl', formData).then(res => {
                toast.dismiss(load)
                if (res.data.success) {
                    toast.success('Save success!')
                    setData()
                    setLink('')
                } else {
                    setBtnUpload(false)
                    toast.error(res.data.message)
                }
            })
        }
    }

    return (
        <>
            <div className='horizontal-line'></div>
            <div className='text-center'>
                <img
                    className='avatar crawl-song-img'
                    referrerPolicy='no-referrer'
                    src={data.img}
                    alt='img data crawl'
                />
            </div>
            <div className='form-group mt-3'>
                <label htmlFor='name' className='form-control-label'>Name</label>
                <input
                    className='form-control'
                    type='text'
                    value={data.name}
                    onChange={e => setData(prev => ({ ...prev, name: e.target.value }))}
                    id='name'
                />
            </div>
            <div className='form-group'>
                <label htmlFor='artist' className='form-control-label'>Artist</label>
                <input
                    className='form-control'
                    type='text'
                    value={data.artist}
                    onChange={e => setData(prev => ({ ...prev, artist: e.target.value }))}
                    id='artist'
                />
            </div>
            <div className='form-group'>
                <label htmlFor='img' className='form-control-label'>Source Image</label>
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
                <label htmlFor='src' className='form-control-label'>Source Audio</label>
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
                    onClick={handleSaveTemp}
                    className='btn btn-secondary mx-1'>Save temp</button>
                <button
                    disabled={btnUpload}
                    onClick={handleDownload}
                    className='btn btn-info mx-1'>Download and save</button>
                <button
                    disabled={btnUpload}
                    onClick={handleSave}
                    className='btn btn-success mx-1'>Save</button>
            </div>
        </>
    );
};

export default AdminCrawlResult;