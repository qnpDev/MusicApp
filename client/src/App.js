import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { ListMusicProvider } from './components/contexts/ListMusicContext';
import Home from './components/pages/home'
import { UserProvider } from './components/contexts/UserContext';
import Static from './components/pages/static';
import SignIn from './components/pages/auth/SignIn';
import SignUp from './components/pages/auth/SignUp';
import SignOut from './components/pages/auth/SignOut';
import Song from './components/pages/song';
import ManageSong from './components/pages/manage';
import UploadSong from './components/pages/manage/CreateSong';
import CreateAlbum from './components/pages/manage/CreateAlbum';
import NotFound from './components/pages/notfound';
import Admin from './components/pages/admin';
import AdminSong from './components/pages/admin/song';
import AdminCreateSong from './components/pages/admin/song/Create';
import CrawlSongNCT from './components/pages/admin/tool/crawlSong/NCT';
import CrawlSongNhacVn from './components/pages/admin/tool/crawlSong/NhacVn';
import CrawlSongCSN from './components/pages/admin/tool/crawlSong/CSN';
import CrawlSongKeeng from './components/pages/admin/tool/crawlSong/Keeng';
import AdminRequestSong from './components/pages/admin/requestSong';

function App() {
  return (
    <>
      <ListMusicProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path='/' element={<Static />}>
                {/* Home */}
                <Route index element={<Home />} />
                <Route path='signin/*' element={<SignIn />} />
                <Route path='signup/*' element={<SignUp />} />
                <Route path='signout/*' element={<SignOut />}/>
                <Route path='song/:tag' element={<Song />} />
                <Route path='manage/*' element={<ManageSong />}/>
                <Route path='manage/upload-song/*' element={<UploadSong />}/>
                <Route path='manage/create-album/*' element={<CreateAlbum/>}/>

                {/* Admin */}
                <Route path='admin/*' element={<Admin/>} />
                <Route path='admin/song/*' element={<AdminSong/>}/>
                <Route path='admin/song/create/*' element={<AdminCreateSong/>}/>
                <Route path='admin/tool/crawl-song/nct/*' element={<CrawlSongNCT/>}/>
                <Route path='admin/tool/crawl-song/nhacvn/*' element={<CrawlSongNhacVn/>}/>
                <Route path='admin/tool/crawl-song/csn/*' element={<CrawlSongCSN/>}/>
                <Route path='admin/tool/crawl-song/keeng/*' element={<CrawlSongKeeng/>}/>
                <Route path='admin/request-song/*' element={<AdminRequestSong/>}/>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </ListMusicProvider>
    </>
  );
}

export default App;
