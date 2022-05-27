import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../axios'

const SaveASongTempCrawl = ({ data, index, setData, listCategory, listAlbum, close }) => {
    const [category, setCategory] = useState(-1)
    const [album, setAlbum] = useState(-1)
    const [name, setName] = useState(data.name)
    const [artist, setArtist] = useState(data.artist)
    const [btnUpload, setBtnUpload] = useState(false)

    const handleAdd = () => {
        if (category === -1) {
            toast.error('Choose category!')
        } else {
            let formData = new FormData()
            formData.append('localimg', 0)
            formData.append('localsrc', 0)
            formData.append('img', data.img)
            formData.append('src', data.src)
            formData.append('name', name)
            formData.append('artist', artist)
            formData.append('category', category)
            formData.append('album', album)
            formData.append('show', 1)

            const load = toast.loading('Wait...')
            setBtnUpload(true)
            api.post('api/admin/song/create', formData).then(res => {
                if (res.data.success) {
                    toast.success('Upload success!')
                    setData(prev => ({
                        size: prev.size - 1,
                        data: prev.data.filter((e, i) => i !== index)
                    }))
                    api.delete('api/admin/temp-crawl?id=' + data.id)
                    setBtnUpload(false)
                    toast.dismiss(load)
                    close()
                } else {
                    toast.dismiss(load)
                    setBtnUpload(false)
                    toast.error(res.data.message)
                }
            })
        }
    }

    const handleDownload = () => {
        if (category === -1) {
            toast.error('Choose category!')
        } else {
            let formData = new FormData()
            formData.append('img', data.img)
            formData.append('src', data.src)
            formData.append('name', name)
            formData.append('artist', artist)
            formData.append('category', category)
            formData.append('album', album)
            formData.append('show', 1)

            const load = toast.loading('Wait...')
            setBtnUpload(true)
            api.post('api/admin/tool/save-song', formData).then(res => {
                if (res.data.success) {
                    toast.success('Upload success!')
                    setData(prev => ({
                        size: prev.size - 1,
                        data: prev.data.filter((e, i) => i !== index)
                    }))
                    api.delete('api/admin/temp-crawl?id=' + data.id)
                    setBtnUpload(false)
                    toast.dismiss(load)
                    close()
                } else {
                    toast.dismiss(load)
                    setBtnUpload(false)
                    toast.error(res.data.message)
                }
            })
        }
    }
    return (
        <>
            <div className='card manage-update-song'>
                <div className='card-header pb-0'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>Save a song</h6>
                        </div>
                        <div
                            onClick={close}
                            className='btn btn-secondary btn-sm'>Close</div>
                    </div>
                </div>
                <div className='card-body'>
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
                            value={name}
                            onChange={e => setName(e.target.value)}
                            id='name'
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='artist' className='form-control-label'>Artist</label>
                        <input
                            className='form-control'
                            type='text'
                            value={artist}
                            onChange={e => setArtist(e.target.value)}
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
                            disabled={true}
                            className='form-control'
                            type='text'
                            value={data.src}
                            onChange={e => setData(prev => ({ ...prev, src: e.target.value }))}
                            id='src'
                        />
                        <div className='mt-3 text-center'>
                            <audio controls>
                            <source
                                src={data.src}
                                type='audio/ogg' />
                            <source
                                src={data.src}
                                type='audio/mpeg' />
                            Your browser does not support the audio element.
                        </audio>
                        </div>
                        
                    </div>

                    <div className='form-group'>
                        <label htmlFor="category">Category: </label>
                        <select
                            onChange={e => setCategory(e.target.value)}
                            className="form-control"
                            defaultValue={category}
                            id="category"
                        >
                            <option value={-1} disabled>Choose Category</option>
                            {listCategory?.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor="album">Album: </label>
                        <select
                            onChange={e => setAlbum(e.target.value)}
                            className="form-control"
                            defaultValue={album}
                            id="album"
                        >
                            <option value={-1}>Không có album</option>
                            {listAlbum?.map(e => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className='d-flex justify-content-end'>
                        <button className='btn bg-gradient-secondary mx-1' onClick={close}>Cancel</button>
                        <button
                            className='btn bg-gradient-info mx-1'
                            onClick={handleDownload}
                            disabled={btnUpload}
                        >
                            Download and save
                        </button>
                        <button
                            className='btn bg-gradient-success mx-1'
                            onClick={handleAdd}
                            disabled={btnUpload}
                        >
                            Save
                        </button>
                    </div>

                </div>

            </div>
        </>
    );
};

export default SaveASongTempCrawl;