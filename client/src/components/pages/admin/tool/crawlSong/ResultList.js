import React, { useState } from 'react';
import api from '../../../../axios'
import { toast } from 'react-toastify';
import SaveASong from './SaveASong';
import { confirmAlert } from 'react-confirm-alert';

const AdminCrawlResultList = ({ data, setData, setLink, listCategory, listAlbum }) => {
    const [btnUpload, setBtnUpload] = useState(false)
    const [category, setCategory] = useState(-1)
    const [album, setAlbum] = useState(-1)

    const handleSave = (e, i) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <SaveASong data={e} index={i} listCategory={listCategory} listAlbum={listAlbum} setData={setData} close={onClose} />
                );
            }
        });
    }

    const handleAddAll = () => {
        if(category === -1){
            toast.error('Choose category!')
        }else{
            const load = toast.loading('Wait...')
            setBtnUpload(true)
            data.map(e => apiAdd(e))
            setBtnUpload(false)
            toast.dismiss(load)
            toast.success('Upload success!')
            setData()
            setLink('')
        }
    }

    const apiAdd = e => {
        let formData = new FormData()
        formData.append('localimg', 0)
        formData.append('localsrc', 0)
        formData.append('img', e.img)
        formData.append('src', e.src)
        formData.append('name', e.name)
        formData.append('artist', e.artist)
        formData.append('category', category)
        formData.append('album', album)
        formData.append('show', 1)

        setBtnUpload(true)
        api.post('api/admin/song/create', formData).then(res => {
            if (res.data.success) {
                
            } else {
                toast.error(res.data.message)
            }
        })
    }

    return (
        <>
            <div className='horizontal-line'></div>
            <div className='table-responsive p-0'>
                <table className='table align-items-center mb-0'>
                    <thead>
                        <tr>
                            <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7'>Song</th>
                            <th className='text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2'>Src</th>
                            <th className='text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((e, i) => (
                            <tr key={i}>
                                <td>
                                    <div className='d-flex px-2 py-1'>
                                        <div>
                                            <img src={e.img} className='avatar avatar-sm me-3' alt={e.name} />
                                        </div>
                                        <div className='d-flex flex-column justify-content-center'>
                                            <h6 className='mb-0 text-sm wraptext'>{e.name}</h6>
                                            <p className='text-xs text-secondary mb-0 wraptext'>{e.artist}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className='text-center'>
                                    <audio controls>
                                        <source
                                            src={e.src}
                                            type='audio/ogg' />
                                        <source
                                            src={e.src}
                                            type='audio/mpeg' />
                                        Your browser does not support the audio element.
                                    </audio>
                                </td>
                                <td className='align-middle'>
                                    <div className='text-secondary font-weight-bold text-xs cursor-pointer text-center'>
                                        <div onClick={() => handleSave(e, i)} className='btn btn-sm bg-gradient-success m-0 mx-1 px-2'>Save</div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='horizontal-line'></div>
            <div className=''>
                <h3>Add all</h3>
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
                <div className='text-end'>
                    <button onClick={handleAddAll} disabled={btnUpload} className='btn bg-gradient-primary'>Save all</button>
                </div>
                
            </div>
        </>
    );
};

export default AdminCrawlResultList;