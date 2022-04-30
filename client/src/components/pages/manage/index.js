import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Loading from '../loading';
import NotPermission from '../notpermission';
import ListAlbum from './ListAlbum';
import ListRequest from './ListRequest';
import ListSong from './ListSong';
import './style.css'


const ManageSong = () => {
    document.title = 'Manager'
    const { dataUser } = useContext(UserContext)

    if (!localStorage.getItem('token') || !localStorage.getItem('refreshToken'))
        return (<NotPermission />)
    if (!dataUser)
        return (<Loading />)
    return (
        <>
            <div className='manage-song-container'>
                <ListSong />
                <ListRequest />
                <ListAlbum />
            </div>
        </>
    );
};

export default ManageSong;