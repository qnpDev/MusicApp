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
import DetailSong from './components/pages/song/Detail';
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
import AdminAlbum from './components/pages/admin/album';
import AdminCategory from './components/pages/admin/category';
import AdminBanner from './components/pages/admin/banner';
import AdminUser from './components/pages/admin/user';
import Album from './components/pages/album';
import AlbumDetail from './components/pages/album/Detail';
import Song from './components/pages/song';
import TempCrawl from './components/pages/admin/tempCrawl';
import User from './components/pages/user';
import ChangePassword from './components/pages/user/ChangePassword';
import ResetPassword from './components/pages/auth/ResetPassword';
import ForgotPassword from './components/pages/auth/ForgotPassword';

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
                <Route path='song/*' element={<Song />} />
                <Route path='song/:tag' element={<DetailSong />} />
                <Route path='manage/*' element={<ManageSong />}/>
                <Route path='manage/upload-song/*' element={<UploadSong />}/>
                <Route path='manage/create-album/*' element={<CreateAlbum/>}/>
                <Route path='album/*' element={<Album/>}/>
                <Route path='album/:tag' element={<AlbumDetail/>}/>
                <Route path='user/:id' element={<User/>}/>
                <Route path='user/*' element={<User/>}/>
                <Route path='change-password/*' element={<ChangePassword/>}/>
                <Route path='forgot-password/*' element={<ForgotPassword/>}/>
                <Route path='reset-password/:token' element={<ResetPassword/>}/>

                {/* Admin */}
                <Route path='admin/*' element={<Admin/>} />
                <Route path='admin/song/*' element={<AdminSong/>}/>
                <Route path='admin/song/create/*' element={<AdminCreateSong/>}/>
                <Route path='admin/tool/crawl-song/nct/*' element={<CrawlSongNCT/>}/>
                <Route path='admin/tool/crawl-song/nhacvn/*' element={<CrawlSongNhacVn/>}/>
                <Route path='admin/tool/crawl-song/csn/*' element={<CrawlSongCSN/>}/>
                <Route path='admin/tool/crawl-song/keeng/*' element={<CrawlSongKeeng/>}/>
                <Route path='admin/request-song/*' element={<AdminRequestSong/>}/>
                <Route path='admin/album/*' element={<AdminAlbum/>}/>
                <Route path='admin/category/*' element={<AdminCategory/>}/>
                <Route path='admin/banner/*' element={<AdminBanner/>}/>
                <Route path='admin/user/*' element={<AdminUser/>}/>
                <Route path='admin/temp-crawl/*' element={<TempCrawl/>}/>

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
