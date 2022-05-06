import React, { useEffect, useState } from 'react';
import api from '../../../axios'
import convertDateTime from '../../../helper/ConvertDateTime';

const AdminViewUser = ({ data, close }) => {
    const [info, setInfo] = useState()
    useEffect(() => {
        api.get('api/admin/user/get-info', {
            params: {
                id: data.id
            }
        }).then(res => {
            if(res.data.success){
                setInfo(res.data.data)
            }
        })
    }, [ data.id ])
    return (
        <>
            <div className='card manage-update-song'>
                <div className='card-header'>
                    <div className='d-flex justify-content-between align-item-center'>
                        <div>
                            <h6>{data.name}</h6>
                        </div>
                        <div
                            onClick={close}
                            className='btn btn-secondary btn-sm'>Close</div>
                    </div>
                </div>
                <div className='card-body'>
                    <div className='upload-container'>
                        <div className='d-flex justify-content-center'>
                            <img
                                src={data.localAvatar === 1
                                    ? process.env.REACT_APP_API_SRC_USER_IMG + data.avatar
                                    : data.avatar}
                                className='avatar me-3 img-song img-avatar'
                                alt={data.name}
                                style={{
                                    borderRadius: '50%',
                                    width: '15rem',
                                    height: '15rem',
                                }}
                            />
                        </div>
                        <table className='table mt-4'>
                            <tbody>
                                <tr>
                                    <td className='fw-bolder'>ID:</td>
                                    <td>
                                        <input 
                                            className='form-control'
                                            value={data.id} 
                                            disabled={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-bolder wraptext'>Name:</td>
                                    <td>
                                        <input 
                                            className='form-control'
                                            value={data.name} 
                                            disabled={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-bolder'>Username:</td>
                                    <td>
                                        <input 
                                            className='form-control'
                                            value={data.username} 
                                            disabled={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-bolder'>Email:</td>
                                    <td>
                                        <input 
                                            className='form-control'
                                            value={data.email} 
                                            disabled={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-bolder'>Role:</td>
                                    <td>
                                        <input 
                                            className='form-control'
                                            value={data.roles > 0 ? 'Admin' : 'Member'}
                                            disabled={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-bolder wraptext'>Link avatar:</td>
                                    <td>
                                        <input 
                                            className='form-control'
                                            value={data.avatar} 
                                            disabled={true}
                                        />
                                    </td>
                                </tr>
                                {info && (
                                    <>
                                        <tr>
                                            <td className='fw-bolder wraptext'>Song number:</td>
                                            <td>
                                                <input 
                                                    className='form-control'
                                                    value={info.countSong} 
                                                    disabled={true}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='fw-bolder wraptext'>Request number:</td>
                                            <td>
                                                <input 
                                                    className='form-control'
                                                    value={info.countRequest} 
                                                    disabled={true}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='fw-bolder wraptext'>Album number:</td>
                                            <td>
                                                <input 
                                                    className='form-control'
                                                    value={info.countAlbum} 
                                                    disabled={true}
                                                />
                                            </td>
                                        </tr>
                                    </>
                                )}
                                <tr>
                                    <td className='fw-bolder wraptext'>Created At:</td>
                                    <td>
                                        <input 
                                            className='form-control'
                                            value={convertDateTime(data.createdAt)} 
                                            disabled={true}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='fw-bolder wraptext'>Updated At:</td>
                                    <td>
                                        <input 
                                            className='form-control'
                                            value={convertDateTime(data.updatedAt)} 
                                            disabled={true}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        
                    </div>
                </div>
                <div className='card-footer'>
                    
                </div>
            </div>
        </>
    );
};

export default AdminViewUser;