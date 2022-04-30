import { createContext, useState } from 'react'
import api from '../axios'
// import DamCuoiNha from '../resources/DamCuoiNha.mp3'
// import DoKhongEm from '../resources/DoKhongEm.mp3'

const ListMusicContext = createContext()

function ListMusicProvider({ children }) {
    const [listMusic, setListMusic] = useState([
        // {
        //     id: 0,
        //     src: DamCuoiNha,
        //     title: "Đám Cưới Nha",
        //     artist: "Hồng Thanh, Dj Mie",
        //     img: 'https://wallpaperaccess.com/full/2029165.jpg',
        // },
        // {
        //     id: 1,
        //     src: DoKhongEm,
        //     title: "Đò không em",
        //     artist: "Remix",
        //     img: 'https://thietbiketnoi.com/wp-content/uploads/2020/01/tong-hop-hinh-nen-background-vector-designer-dep-do-phan-giai-fhd-2k-4k-moi-nhat-24-1024x678.jpg',
        // },
        // {
        //     id: 1,
        //     src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        //     title: 'test',
        //     artist: "Remix",
        //     img: 'https://thietbiketnoi.com/wp-content/uploads/2020/01/tong-hop-hinh-nen-background-vector-designer-dep-do-phan-giai-fhd-2k-4k-moi-nhat-24-1024x678.jpg',
        // },
        // {
        //     id: 1,
        //     src: "https://localhost:44315/api/src/TinhTaHaiNga.mp3",
        //     title: 'test local',
        //     artist: "Remix",
        //     img: 'https://thietbiketnoi.com/wp-content/uploads/2020/01/tong-hop-hinh-nen-background-vector-designer-dep-do-phan-giai-fhd-2k-4k-moi-nhat-24-1024x678.jpg',
        // },

    ])
    const [audioIndex, setAudioIndex] = useState(0)
    const [isPlay, setPlay] = useState(false);

    const addMusic = e => {
        setListMusic(prev => [...prev, {
            ...e,
            id: prev.length
        }])
        let check = false;
        listMusic.map(ele => ele.tag === e.tag ? check = true : null)
        if(!check)
            api.put('api/Song/'+e.tag+'/listen')
    }
    const removeMusic = e => {
        setListMusic(listMusic.filter((ele, index) => index !== e))
    }
    const removeAll = () => {
        setListMusic([])
    }

    const handle = {
        audioIndex,
        setAudioIndex,
        isPlay,
        setPlay,
        listMusic,
        addMusic,
        removeMusic,
        removeAll
    }

    return (
        <ListMusicContext.Provider value={handle}>
            {children}
        </ListMusicContext.Provider>
    )
}

export { ListMusicContext, ListMusicProvider }