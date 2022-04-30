import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { ListMusicContext } from '../../contexts/ListMusicContext';

const Main = () => {
    const { listMusic } = useContext(ListMusicContext)
    return (
        <>
            <div className='container-fluid py-4 static-content'>
                <Outlet />
            </div>

            <div className={listMusic.length > 0 ? 'static-content-media-active-bottom' : null}></div>

        </>
    );
};

export default Main;