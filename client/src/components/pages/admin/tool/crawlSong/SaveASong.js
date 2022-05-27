import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../axios'

const SaveASong = ({ data, index, setData, listCategory, listAlbum, close }) => {
    const [category, setCategory] = useState(-1)
    const [album, setAlbum] = useState(-1)
    const [btnUpload, setBtnUpload] = useState(false)

    const handleAdd = () => {
        if(category === -1){
            toast.error('Choose category!')
        }else{
            let formData = new FormData()
            formData.append('localimg', 0)
            formData.append('localsrc', 0)
            formData.append('img', data.img)
            formData.append('src', data.src)
            formData.append('name', data.name)
            formData.append('artist', data.artist)
            formData.append('category', category)
            formData.append('album', album)
            formData.append('show', 1)

            const load = toast.loading('Wait...')
            setBtnUpload(true)
            api.post('api/admin/song/create', formData).then(res => {
                if (res.data.success) {
                    toast.success('Upload success!')
                    setData(prev => prev.filter((e, i) => i !== index))
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
        if(category === -1){
            toast.error('Choose category!')
        }else{
            let formData = new FormData()
            formData.append('img', data.img)
            formData.append('src', data.src)
            formData.append('name', data.name)
            formData.append('artist', data.artist)
            formData.append('category', category)
            formData.append('album', album)
            formData.append('show', 1)

            const load = toast.loading('Wait...')
            setBtnUpload(true)
            api.post('api/admin/tool/save-song', formData).then(res => {
                if (res.data.success) {
                    toast.success('Upload success!')
                    setData(prev => prev.filter((e, i) => i !== index))
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
            <div className='card'>
                <div className='card-header text-center pb-0'>
                    <h2>Choose infomation of song?</h2>
                </div>
                <div className='card-body'>
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

export default SaveASong;