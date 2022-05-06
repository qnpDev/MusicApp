import React, { useState } from 'react';
import api from '../../../../axios'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminCrawlResultList = ({ data, setData, setLink, listCategory, listAlbum }) => {
    const [btnUpload, setBtnUpload] = useState(false)

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
                                        <div className='btn btn-sm bg-gradient-success m-0 mx-1 px-2'>Save</div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AdminCrawlResultList;