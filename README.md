<div align="center">
    <img src="bin/Music-icon.png" alt="Logo" width="80" height="80">
    <h1><b>MusicApp</b></h1>
    <h5>Music App is a web application that everyone can access to find and listen to music online. Moreover, people can upload their song and download their favorite song.</br>***</h5>
    </br>
</div>

# Table of contents

1. [About](#1-about)</br>
2. [Requirements](#2-requirements)</br>
3. [Install](#3-install)</br>
4. [Design Pattern](#4-design-pattern)</br>
    4.1 [Factory Method Pattern](#factory-method-pattern)</br>
    - [Giới thiệu](#giới-thiệu-factory-method-pattern)
    - [Lý do áp dụng](#lý-do-áp-dụng-factory-method-pattern)
    - [Mô tả việc áp dụng](#mô-tả-việc-áp-dụng-factory-method-pattern)
    - [Áp dụng](#áp-dụng-factory-method-pattern)
    - [Testcase](#testcase-factory-method-pattern)

    4.2 [Template Method Pattern](#template-method-pattern)</br>
    - [Giới thiệu](#giới-thiệu-template-method-pattern)
    - [Lý do áp dụng](#lý-do-áp-dụng-template-method-pattern)
    - [Mô tả việc áp dụng](#mô-tả-việc-áp-dụng-template-method-pattern)
    - [Áp dụng](#áp-dụng-template-method-pattern)
    - [Testcase](#testcase-template-method-pattern)

    4.3 [Adapter Pattern](#adapter-pattern)</br>
    - [Giới thiệu](#giới-thiệu-adapter-pattern)
    - [Lý do áp dụng](#lý-do-áp-dụng-adapter-pattern)
    - [Mô tả việc áp dụng](#mô-tả-việc-áp-dụng-adapter-pattern)
    - [Áp dụng](#áp-dụng-adapter-pattern)
    - [Testcase](#testcase-adapter-pattern)

    4.4 [Singleton Pattern](#singleton-pattern)</br>
    - [Giới thiệu](#giới-thiệu-singleton-pattern)
    - [Lý do áp dụng](#lý-do-áp-dụng-singleton-pattern)
    - [Mô tả việc áp dụng](#mô-tả-việc-áp-dụng-singleton-pattern)
    - [Áp dụng](#áp-dụng-singleton-pattern)
    - [Testcase](#testcase-singleton-pattern)
5. [Some pictures](#5-some-pictures)
    

</br>

# 1. About

<img src="bin/home-page-view.png" alt="Review-Home-Page">
</br>

**Author**

<ul>
    <li>Nguyễn Phú Quí - 51900192</li>
    <li>Nguyễn Quốc Thái - 51900210</li>
</ul>

**Technicality**

<ul>
    <li>Languages: <code>DOT.NET CORE RESTful API Server + ReactJS Client</code></li>
    <li>Database: <code>MySQL</code></li>
</ul>

**Features:**

- Users:
    - Signin and signup account
    - Reset and change account password
    - Change account infomation
    - Upload new songs
    - Create song drafts
    - Create new albums
    - Manage songs, drafts, albums
        - Hide/Show
        - Update
        - Delete
    - Listen songs
    - Download a song
    - Add songs to playlist
    - Control music player
- Administrator:
    - Confirm song requests
    - Refuse song requests
    - Create
        - New albums
        - New category
        - New songs
        - New banners
    - Update / Delete
        - Song requests
        - Songs
        - Albums
        - Categories
        - Banners
        - Users
    - Hide / Show
        - Songs
        - Albums
        - Categories
        - Banners
    - Crawl songs from other website
        - nhaccuatui.com
        - nhac.vn
        - chiasenhac.vn
        - keeng.vn

# 2. Requirements

<ul>
<li>DOT.NET CORE</li>
<li>ReactJS</li>
<li>MySQL Server</li>
</ul>

# 3. Install

<ul>
<li>Clone the repository with git clone </li>
<li>Run <code>SQLQuery.sql</code> database in MySQL</li>
<li>Config server database in <code>server/server/Models/MusicContext.cs</code> file</li>
<li>Open 'server' folder in <code>Visual Studio</code> and run it</li>
<li>Run client with <code>npm start</code> in client folder</li>
<li>Your demo is available at <code>localhost:3000</code></li>
</ul>

# 4. Design Pattern

## Factory Method Pattern

### Giới thiệu Factory Method Pattern

>Factory Method Design Pattern hay gọi ngắn gọn là Factory Pattern là một trong những Pattern thuộc nhóm Creational Design Pattern. Nhiệm vụ của Factory Pattern là quản lý và trả về các đối tượng theo yêu cầu, giúp cho việc khởi tạo đổi tượng một cách linh hoạt hơn.

### Lý do áp dụng Factory Method Pattern

- Trường hợp áp dụng: áp dụng vào việc crawl nhạc từ các trang bên ngoài như nhaccuatui, keeng,... ở phía server
- Lý do áp dụng:
    - Việc crawl nhạc từ các trang khác nhau nhaccuatui, keeng
    - Thuật toán xử lý việc crawl dữ liệu nhạc khác nhau ở mỗi trang
    - Đều trả về chung một kết quả là dữ liệu một bài hát crawl được
    - Đều nhận vào một url là đường dẫn đến bài hát đó
- Ưu điểm sau khi áp dụng
    - Tối ưu code (rút gọn code)
    - Có thể dễ dàng mở rộng tool crawl cho nhiều trang web khác nhau
    - Dễ dàng bảo trì cũng như chỉnh sửa hoạt động của tool khi trang web crawl thay đổi cấu trúc dữ liệu

### Mô tả việc áp dụng Factory Method Pattern

- Class diagram:

<img src="bin/Factory-class-diagram.png" alt="Factory-class-diagram">

- Trong đó:
    - `ICrawSong`: (Super Class) là một interface định nghĩa phương thức cần thiết của Factory
    - `CrawlNhaccuatui`, `CrawlKeeng`, `CrawlNhacVn`, `CrawlChiasenhac`: (Sub Class) là các class được implement *Super Class*, trong đó sẽ override lại phương thức cửa *super class* và chứa thuật toán crawl nhạc
    - `CrawlSòngactory`: là lớp chịu trách nhiệm khởi tạo các *sub class* dựa trên đầu vào
    - `CrawlSongModel`: là lớp chịu trách nhiệm định nghĩa các dữ liệu cho mỗi object bài hát

### Áp dụng Factory Method Pattern

- **Trước khi áp dụng**

<code>AdminToolController.cs</code>

```cs
[HttpGet("{type}")]
public IActionResult GetSong(string uri, string type)
{
    if(uri == null || type == null || uri.Trim().Length == 0 || type.Trim().Length == 0)
    {
        return BadRequest(new
        {
            success = false,
            message = "Enter link or type!",
        });
    }

    try
    {
        if(type.Equals("nhaccuatui")){
            var curl = CurlHelper.Get(uri);
            var matchs = Regex.Matches(curl, "xmlURL = \"(.+?)\";");
            var link = matchs[0].Groups[1].Value;
            curl = CurlHelper.Get(link);
            matchs = Regex.Matches(curl, @"<!\[CDATA\[(.+?)]]>");
            string name = matchs[0].Groups[1].Value;
            string artist = matchs[2].Groups[1].Value;
            string src = matchs[3].Groups[1].Value;
            matchs = Regex.Matches(curl, @"<avatar><!\[CDATA\[(.+?)]]>");
            string img = matchs[0].Groups[1].Value;
            return Ok(new CrawlSongModel()
            {
                Name = name,
                Artist = artist,
                Src = src,
                Img = img,
            });
        }else if(type.Equals("nhacvn")){
                var curl = CurlHelper.Get(uri);
                var matchs = Regex.Matches(curl, "sources: \\[\\{\"file\":\"(.+?)\",");
                var src = matchs[0].Groups[1].Value.Replace("\\", "");
                matchs = Regex.Matches(curl, "title:'(.+?)',");
                var name = matchs[0].Groups[1].Value;
                matchs = Regex.Matches(curl, "thumb : '(.+?)',");
                var img = matchs[0].Groups[1].Value;
                matchs = Regex.Matches(curl, "description:'(.+?)',");
                var artist = matchs[0].Groups[1].Value;
                return Ok(new CrawlSongModel()
                {
                    Name = name,
                    Artist = artist,
                    Src = src,
                    Img = img,
                });
        }else{
            return BadRequest(new
            {
                success = false,
                message = "Type can not found!"
            });
        }
    }
    catch (Exception)
    {
        return BadRequest(new
        {
            success = false,
            message = "Not found song, check your link!"
        });
    }
}
```

</br>

- **Sau khi áp dụng**

<code>AdminToolController.cs</code>

```cs
[HttpGet("{type}")]
public IActionResult GetSong(string uri, string type)
{
    if(uri == null || type == null || uri.Trim().Length == 0 || type.Trim().Length == 0)
    {
        return BadRequest(new
        {
            success = false,
            message = "Enter link or type!",
        });
    }

    try
    {
        ICrawlSong crawl = CrawlSongFactory.GetCrawlSong(type);
        return Ok(crawl.GetData(uri));
    }
    catch (Exception)
    {
        return BadRequest(new
        {
            success = false,
            message = "Not found song, check your link!"
        });
    }
}
```

<code>ICrawlSong.cs</code>

```cs
public interface ICrawlSong
{
    public CrawlSongModel GetData(string uri);
}
```

<code>CrawlSongFactory.cs</code>

```cs
public class CrawlSongFactory
{
    private CrawlSongFactory() { }
    public static ICrawlSong GetCrawlSong(string crawlSongType)
    {
        switch (crawlSongType.Trim().ToLower())
        {
            case "nhaccuatui":
                return new CrawlNhaccuatui();
            case "nhacvn":
                return new CrawlNhacVn();
            case "chiasenhac":
                return new CrawlChiasenhac();
            case "keeng":
                return new CrawlKeeng();
            default:
                throw new ArgumentException("This type is unsupported");
        }
    }
}
```

<code>CrawlSongModel.cs</code>

```cs
public class CrawlSongModel
{
    public string Name { get; set; }
    public string Artist { get; set; }
    public string Img { get; set; }
    public string Src { get; set; }
}
```

<code>CrawlNhaccuatui.cs</code>

```cs
public class CrawlNhaccuatui : ICrawlSong
{
    public CrawlSongModel GetData(string uri)
    {
        try
        {
            var curl = CurlHelper.Get(uri);
            var matchs = Regex.Matches(curl, "xmlURL = \"(.+?)\";");
            var link = matchs[0].Groups[1].Value;
            curl = CurlHelper.Get(link);
            matchs = Regex.Matches(curl, @"<!\[CDATA\[(.+?)]]>");
            string name = matchs[0].Groups[1].Value;
            string artist = matchs[2].Groups[1].Value;
            string src = matchs[3].Groups[1].Value;
            matchs = Regex.Matches(curl, @"<avatar><!\[CDATA\[(.+?)]]>");
            string img = matchs[0].Groups[1].Value;
            return new CrawlSongModel()
            {
                Name = name,
                Artist = artist,
                Src = src,
                Img = img,
            };
        }
        catch
        {
            throw new Exception();
        }
    }
}
```

<code>CrawlNhacVn.cs</code>

```cs
public class CrawlNhacVn : ICrawlSong
{
    public CrawlSongModel GetData(string uri)
    {
        try
        {
            var curl = CurlHelper.Get(uri);
            var matchs = Regex.Matches(curl, "sources: \\[\\{\"file\":\"(.+?)\",");
            var src = matchs[0].Groups[1].Value.Replace("\\", "");
            matchs = Regex.Matches(curl, "title:'(.+?)',");
            var name = matchs[0].Groups[1].Value;
            matchs = Regex.Matches(curl, "thumb : '(.+?)',");
            var img = matchs[0].Groups[1].Value;
            matchs = Regex.Matches(curl, "description:'(.+?)',");
            var artist = matchs[0].Groups[1].Value;
            return new CrawlSongModel()
            {
                Name = name,
                Artist = artist,
                Src = src,
                Img = img,
            };
        }
        catch
        {
            throw new Exception();
        }
    }
}
```

### Testcase Factory Method Pattern

- **Testcase 01:**
    - Input:
        - Base url: `https://localhost:44315/api/admin/tool/`
        - Params:
            - uri = `https://www.nhaccuatui.com/bai-hat/sao-tiec-nguoi-khong-tot-hoai-lam-ft-vuong-anh-tu.ZktipDfnuj16.html`
            - type = `nhaccuatui`
    - Output:

```json
{
  "name": "Sao Tiếc Người Không Tốt",
  "artist": "Hoài Lâm, Vương Anh Tú",
  "img": "https://avatar-ex-swe.nixcdn.com/song/2022/04/15/b/a/6/c/1649986538375.jpg",
  "src": "https://f9-stream.nixcdn.com/NhacCuaTui1026/SaoTiecNguoiKhongTot-HoaiLamVuongAnhTu-7187294.mp3?st=7hMjDHu0CSn53lkSbWSvHQ&e=1652879061"
}
```

<img src="bin/crawl-music-tc-01.png" alt="Testcase01">

- **Testcase 02:**
    - Input:
        - Base url: `https://localhost:44315/api/admin/tool/`
        - Params:
            - uri = `https://www.nhaccuatui.com/bai-hat/sao-tiec-nguoi-khong-tot-hoai-lam-ft-vuong-anh-tu.ZktipDfnuj16.html`
            - type = `nhacvn`
    - Output:

```json
{
  "success": false,
  "message": "Not found song, check your link!"
}
```

<img src="bin/crawl-music-tc-02.png" alt="Testcase02">

- **Testcase 03:**
    - Input:
        - Base url: `https://localhost:44315/api/admin/tool/`
        - Params:
            - uri = `https://nhac.vn/bai-hat/nguoi-khac-phan-manh-quynh-soQJlxj`
            - type = `nhacvn`
    - Output:

```json
{
  "name": "Người Khác",
  "artist": "Phan Mạnh Quỳnh",
  "img": "https://109cdf7de.vws.vegacdn.vn/kv0puCNE4oNNfn7YhOpK/1512982509/v1/album/s2/0/20/796/21787229.jpg?v=1512982509",
  "src": "https://109a15170.vws.vegacdn.vn/ZBoIGwn6mgsckkRNpVtf4A/1652836411/media2/song/web1/172/1411800/1411800.mp3?v=3"
}
```

<img src="bin/crawl-music-tc-03.png" alt="Testcase03">

</br>

## Template Method Pattern

### Giới thiệu Template Method Pattern

>Template Method Pattern là một trong những Pattern thuộc nhóm hành vi (Behavior Pattern). Pattern này nói rằng “Định nghĩa một bộ khung của một thuật toán trong một chức năng, chuyển giao việc thực hiện nó cho các lớp con. Mẫu Template Method cho phép lớp con định nghĩa lại cách thực hiện của một thuật toán, mà không phải thay đổi cấu trúc thuật toán“.

### Lý do áp dụng Template Method Pattern

- Trường hợp áp dụng: áp dụng vào việc lưu file upload ở phía server
- Lý do áp dụng:
    - File upload có nhiều dạng file nên được chia ra các thư mục lưu khác nhau
    - Các bước lưu file giống nhau
    - Việc lưu file có các thuật toán chung chỉ khác ở đường dẫn lưu với các file khác nhau
    - Đều trả về chung một kết quả là tên hoặc đường dẫn file đã lưu trên server
    - Đều nhận vào một file
- Ưu điểm sau khi áp dụng
    - Tối ưu code (rút gọn code)
    - Có thể dễ dàng thay đổi thuật toán lưu file
    - Dễ dàng bảo trì cũng như chỉnh sửa đường dẫn lưu file mà không cần quan tâm đã sử dụng ở dâu (chỉnh một lần, apply cho tất cả)
    - Không cần ghi nhớ đường dẫn lưu file mối khi sử dụng. Hạn chế lỗi về sai sót trong đường dẫn lưu file

### Mô tả việc áp dụng Template Method Pattern

- Class diagram:

<img src="bin/Template-class-diagram.png" alt="Template-class-diagram">

- Trong đó:
    - `UploadTemplate`: (Abtract Class) là một abtract định nghĩa phương thức cần thiết, các thuật toán chung và các bước thực hiện thuật toán
    - `UploadImageSong`, `UploadImageAlbum`, `UploadImageBanner`, `UploadImageCategory`, `UploadImageUser`, `UploadSong`: (Sub Class) là các class được extends *Abtract Class*, trong đó sẽ viết các thuật toán cho các phương thức abtract cửa *super class*

### Áp dụng Template Method Pattern

- **Trước khi áp dụng**

<code>AdminSongController.cs</code> > <code>CreateSong()</code>

```cs
[HttpPost("create"), DisableRequestSizeLimit]
public async Task<IActionResult> CreateSong()
{
    var createBy = User.Identity.GetId();
    try
    {
        // ...Some code get data... //
                
        if (localImg == 1 && localSrc == 0)
        {

            var folderName = Path.Combine("Uploads", "Images", "Songs");

            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(files[0].ContentDisposition).FileName.Trim('"'));
            var fullPath = Path.Combine(pathToSave, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                files[0].CopyTo(stream);
            }

            src = formCollection["src"][0].ToString().Trim();
            image = fileName;
        }
        if (localImg == 0 && localSrc == 1)
        {
            var folderName = Path.Combine("Uploads", "Songs");

            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(files[0].ContentDisposition).FileName.Trim('"'));
            var fullPath = Path.Combine(pathToSave, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                files[0].CopyTo(stream);
            }
            image = formCollection["img"][0].ToString().Trim();
            src = fileName;
        }
        if (localImg == 1 && localSrc == 1)
        {
            var folderName = Path.Combine("Uploads", "Songs");

            var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            var fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(files[0].ContentDisposition).FileName.Trim('"'));
            var fullPath = Path.Combine(pathToSave, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                files[0].CopyTo(stream);
            }
            src = fileName;

            folderName = Path.Combine("Uploads", "Images", "Songs");

            pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(files[1].ContentDisposition).FileName.Trim('"'));
            fullPath = Path.Combine(pathToSave, fileName);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                files[1].CopyTo(stream);
            }

            image = fileName;
        }
        if(localImg == 0 && localSrc == 0)
        {
            image = formCollection["img"][0].ToString().Trim();
            src = formCollection["src"][0].ToString().Trim();
        }

        // ...some code create and return data... //
                  
    }
    catch (Exception e)
    {
        return StatusCode(500, "Internal server error " + e);
    }
}
```

</br>

- **Sau khi áp dụng**

<code>AdminSongController.cs</code> > <code>CreateSong()</code>

```cs
[HttpPost("create"), DisableRequestSizeLimit]
public async Task<IActionResult> CreateSong()
{
    var createBy = User.Identity.GetId();
    try
    {
        // ...Some code get data... //
                
        UploadTemplate upload;
        if (localImg == 1 && localSrc == 0)
        {
            src = formCollection["src"][0].ToString().Trim();
            upload = new UploadImageSong();
            image = upload.UploadFile(files[0]);
        }
        if (localImg == 0 && localSrc == 1)
        {
            image = formCollection["img"][0].ToString().Trim();
            upload = new UploadSong();
            src = upload.UploadFile(files[0]);
        }
        if (localImg == 1 && localSrc == 1)
        {
            upload = new UploadImageSong();
            image = upload.UploadFile(files[0]);
            upload = new UploadSong();
            src = upload.UploadFile(files[1]);
        }
        if(localImg == 0 && localSrc == 0)
        {
            image = formCollection["img"][0].ToString().Trim();
            src = formCollection["src"][0].ToString().Trim();
        }

        // ...some code create and return data... //
                  
    }
    catch (Exception e)
    {
        return StatusCode(500, "Internal server error " + e);
    }
}
```

<code>UploadTemplate.cs</code>

```cs
public abstract class UploadTemplate
{
    protected abstract string FolderName();
    protected string SaveFile(IFormFile file, string folderName)
    {
        var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
        var fileName = SongHelper.ConvertSongFile(ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"'));
        var fullPath = Path.Combine(pathToSave, fileName);
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            file.CopyTo(stream);
        }
        return fileName;
    }
    public string UploadFile(IFormFile file)
    {
        string folderName = FolderName();
        string fileName = SaveFile(file, folderName);
        return fileName;  
    }
}
```

<code>UploadSong.cs</code>

```cs
public class UploadSong : UploadTemplate
{
    protected override string FolderName()
    {
        return Path.Combine("Uploads", "Songs");
    }
}
```

<code>UploadImageSong.cs</code>

```cs
public class UploadImageSong : UploadTemplate
{
    protected override string FolderName()
    {
        return Path.Combine("Uploads", "Images", "Songs");
    }
}
```

<code>UploadImageBanner.cs</code>

```cs
public class UploadImageBanner : UploadTemplate
{
    protected override string FolderName()
    {
        return Path.Combine("Uploads", "Images", "Banners");
    }
}
```

>Các file `UploadImageAlbum.cd`, `UploadImageCategory.cs`, `UploadImageUser.cs` tương tự các file trên chỉ thay đổi giá trị trả về

### Testcase Template Method Pattern

- **Testcase 01:**
    - Input:
        - Url: `https://localhost:44315/api/admin/tool/`
        - Params:
            <img src="bin/admin-song-create-input.png" alt="admin-song-create-input.png">
    - Output:
        <img src="bin/admin-song-create-output.png" alt="admin-song-create-output.png">
    - Result
        <img src="bin/admin-song-create-result.png" alt="admin-song-create-result.png">
<br/>

## Adapter Pattern

### Giới thiệu Adapter Pattern

>Adapter Pattern (Người chuyển đổi) là một trong những Pattern thuộc nhóm cấu trúc (Structural Pattern). Adapter Pattern cho phép các inteface (giao diện) không liên quan tới nhau có thể làm việc cùng nhau. Đối tượng giúp kết nối các interface gọi là Adapter.

### Lý do áp dụng Adapter Pattern

- Trường hợp áp dụng: áp dụng vào việc chuyển đổi dữ liệu crawl nhạc từ các trang bên ngoài như nhaccuatui, keeng,... thành dữ liệu phù hợp ở phía server
- Lý do áp dụng:
    - Việc crawl list nhạc từ các trang khác nhau nhaccuatui, keeng
    - Thuật toán xử lý dữ liệu crawl được thành một dữ liệu phù hợp để lưu trữ
    - Dữ liệu crawl được là một `XML` lớn chứa danh sách các bài hát
    - Server cần dữ liệu ở dạng list các object chứa thông tin bài hát
- Ưu điểm sau khi áp dụng
    - Tới ưu code (rút ngắn code) nếu sử dụng ở nhiều nơi
    - Các phương thức sử dụng sẽ dễ dàng lưu dữ liệu hơn vì kiểu dữ liệu quen thuộc với server
    - Có thể dễ dàng sử dụng cho các trang trả về dữ liệu crawl là xml
    - Dễ dàng bảo trì cũng như chỉnh sửa khi cấu trúc dữ liệu crawl về có sự thay đổi mà không ảnh hưởng đến server đang hoạt động

### Mô tả việc áp dụng Adapter Pattern

- Class diagram:

<img src="bin/Adapter-class-diagram.png" alt="Factory-class-diagram">

- Trong đó:
    - `IXML2ListSongAdapter`: (Super Class) là một interface định nghĩa phương thức cần thiết của Adapter
    - `XML2ListSong`: (Sub Class) là các class được implement *Super Class*, trong đó sẽ override lại phương thức cửa *super class* và chứa thuật toán xử lí dữ liệu từ xml đọc được từ `XMLReader` sang danh sách các object chứa bài hát
    - `XMLReader`: là lớp chịu trách nhiệm lấy và đọc dữ liệu crawl
    - `CrawlSongModel`: là lớp chịu trách nhiệm định nghĩa các dữ liệu cho mỗi object bài hát

### Áp dụng Adapter Pattern

- **Trước khi áp dụng**: 
    - Server khó hoặc không thể làm việc với dữ liệu crawl về ở dạng XML chứa danh sách các bài hát
    - Nếu làm việc phải sử dụng đến thư viện bên ngoài về việc xử lý xml hoặc sử dụng Regex để parse dữ liệu (khá mất thời gian) => gây ra tình trạng phản hồi chậm ở phía server
    - Nếu sử dụng ở nhiều nơi sẽ gây ra tình trạng trùng lặp code

</br>

- **Sau khi áp dụng**

<code>XMLReader.cs</code>

```cs
public class XMLReader
{
    private string uri;
    public XMLReader(string uri)
    {
        this.uri = uri;
    }
    public string Read()
    {
        return CurlHelper.Get(this.uri);
    }
}
```

<code>IXML2ListSongAdapter.cs</code>

```cs
public interface IXML2ListSongAdapter
{
    public List<CrawlSongModel> Get();
}
```

<code>CrawlSongModel.cs</code>

```cs
public class CrawlSongModel
{
    public string Name { get; set; }
    public string Artist { get; set; }
    public string Img { get; set; }
    public string Src { get; set; }
}
```

<code>XML2ListSong.cs</code>

```cs
public class XML2ListSong : IXML2ListSongAdapter
{
    private XMLReader xmlReader;
    public XML2ListSong(XMLReader xmlReader)
    {
        this.xmlReader = xmlReader;
    }
    public List<CrawlSongModel> Get()
    {
        // read xml and return json text
        XmlDocument doc = new XmlDocument();
        doc.LoadXml(this.xmlReader.Read());
        string jsonText = JsonConvert.SerializeXmlNode(doc);

        // convert json text to json object
        dynamic json = System.Text.Json.JsonDocument.Parse(jsonText);
        var j = json.RootElement.GetProperty("tracklist").GetProperty("track").EnumerateArray();
            
        //create list song
        List<CrawlSongModel> list = new();
        foreach(dynamic e in j)
        {
            list.Add(new CrawlSongModel()
            {
                Name = e.GetProperty("title").GetProperty("#cdata-section").ToString(),
                Artist = e.GetProperty("creator").GetProperty("#cdata-section").ToString(),
                Src = e.GetProperty("location").GetProperty("#cdata-section").ToString(),
                Img = e.GetProperty("coverimage").GetProperty("#cdata-section").ToString(),
            });
        }
        return list;
    }
}
```

### Testcase Adapter Pattern

- **Testcase 01:**
    - Input:
        - Base url: `https://localhost:44315/api/admin/tool/list-`
        - Params:
            - uri = `https://www.nhaccuatui.com/playlist/nhac-tre-cover-tuyen-chon-hay-nhat-hien-nay-va.W0LdkPv1T8ic.html`
    - Output:

```json
[
  {
    "name": "Đừng Quên Tên Anh (Cover)",
    "artist": "Alex Lâm",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1027/DungQuenTenAnhCover-AlexLam-7204340.mp3?st=aUpAGxn4FRkGBR_8ndLoWQ&e=1653127754"
  },
  {
    "name": "Kiếp Rong Buồn 2 (Cover)",
    "artist": "Vicky Nhung",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/KiepRongBuon2Cover-VickyNhung-7211225.mp3?st=9ULK0nrZhTIP_rtMLA8U6A&e=1653127754"
  },
  {
    "name": "Ai Chung Tình Được Mãi (Cover)",
    "artist": "Dunghoangpham",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1027/AiChungTinhDuocMaiCover-Dunghoangpham-7204342.mp3?st=AG0RxqCq-KMFQsY5MxXfmw&e=1653127754"
  },
  {
    "name": "Người Lạ Thoáng Qua (Cover)",
    "artist": "Thương Võ",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1022/NguoiLaThoangQuaCover-ThuongVo-7098732.mp3?st=SrVU74nWThoz-DV-mM7TPQ&e=1653127754"
  },
  {
    "name": "Ít Nhưng Dài Lâu (Cover)",
    "artist": "Chu Thúy Quỳnh",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/ItNhungDaiLauCover-ChuThuyQuynh-7210931.mp3?st=UQBKaZ3jLwjZjcY8SpGdmw&e=1653127754"
  },
  {
    "name": "Xem Như Tôi Chưa Từng Có Được Em (Cover)",
    "artist": "Lãnh Cung, Cường",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/XemNhuToiChuaTungCoDuocEmCover-LanhCungCuong-7210932.mp3?st=jAcMdhb1fFhyDEIH5jc_mA&e=1653127754"
  },
  {
    "name": "Ai Chung Tình Được Mãi (Cover)",
    "artist": "Thương Võ",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/AiChungTinhDuocMaiCover-ThuongVo-7211055.mp3?st=ytk_1_sNRG8Zoas_URrFFA&e=1653127754"
  },
  {
    "name": "Sắp 30 (Cover)",
    "artist": "Hương Ly",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1016/Sap30Cover-HuongLy-7024689.mp3?st=q3j2iMzJCAZSCvZd-j6cVQ&e=1653127754"
  },
  {
    "name": "Từng Thương (Cover)",
    "artist": "Đình Dũng",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/TungThuongCover-DinhDung-7211222.mp3?st=PPNPr70At3QRCXAKHEDAlA&e=1653127754"
  },
  {
    "name": "Anh Từng Cố Gắng (Cover)",
    "artist": "Hương Ly",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1014/AnhTungCoGangCover-HuongLy-6998055.mp3?st=ZN_ExT9ChmVV8TmP-mH8_Q&e=1653127754"
  },
  {
    "name": "Anh Không Tha Thứ (Cover)",
    "artist": "Thương Võ",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1012/AnhKhongThaThuCover-ThuongVo-6971239.mp3?st=ZDcuHQNxO2zTB3wzOWxXTg&e=1653127754"
  },
  {
    "name": "Không Trọn Vẹn Nữa (Cover)",
    "artist": "Thái Học",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/KhongTronVenNuaCover-ThaiHoc-7211056.mp3?st=C2JvO28Ec8LqerBJh-071w&e=1653127754"
  },
  {
    "name": "Anh Yêu Vội Thế (Cover)",
    "artist": "Nhi Nhi",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/AnhYeuVoiTheCover-NhiNhi-7211228.mp3?st=x8DN8tfs9wOlE8WWyANCaQ&e=1653127754"
  },
  {
    "name": "Hẹn Kiếp Sau (Cover)",
    "artist": "Mai Vy",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/HenKiepSauCover-MaiVy-7211229.mp3?st=QH6hzuKBlTXTvog3OQyfXw&e=1653127754"
  },
  {
    "name": "Anh Vẫn Ở Đây (Cover)",
    "artist": "Thái Học",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/AnhVanODayCover-ThaiHoc-7211057.mp3?st=c8zfFRoij7FRbQ7TTecmZA&e=1653127754"
  },
  {
    "name": "Đổi Tình Đổi Áo Đổi Anh (Cover)",
    "artist": "Thái Học",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1022/DoiTinhDoiAoDoiAnhCover-ThaiHoc-7099582.mp3?st=bTK115blDr3PSYLlu1a1HA&e=1653127754"
  },
  {
    "name": "Câu Hẹn Câu Thề (Cover)",
    "artist": "Thương Võ",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1014/CauHenCauTheCover-ThuongVo-6998296.mp3?st=I1r0sbXpu2JewgSJWpLpcg&e=1653127754"
  },
  {
    "name": "Hạnh Phúc Mới (Cover)",
    "artist": "Nhi Nhi",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://f9-stream.nixcdn.com/NhacCuaTui1028/HanhPhucMoiCover-NhiNhi-7211230.mp3?st=LrUbFx3bI5q3EWgzyYkOLw&e=1653127754"
  },
  {
    "name": "Khi Nào",
    "artist": "Châu Dương",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1027/KhiNao-ChauDuong-7198871.mp3?st=GoNFN0YGjViPJqGK1N4PCQ&e=1653127754"
  },
  {
    "name": "May Mắn Khi Có Em (Cover)",
    "artist": "Trương Bảo Yến",
    "img": "https://avatar-ex-swe.nixcdn.com/playlist/2022/05/12/1/d/f/4/1652329061746_500.jpg",
    "src": "https://aredir.nixcdn.com/NhacCuaTui1027/MayManKhiCoEmCover-TruongBaoYen-7205542.mp3?st=FYABeWW2ajwGes4YSmH0GQ&e=1653127754"
  }
]
```

<img src="bin/admin-crawl-list-result.png" alt="Testcase01">

</br>

## Singleton Pattern

### Giới thiệu Singleton Pattern

>Singleton Pattern là một pattern thuộc nhóm Khởi tạo (Creational Design Pattern).Singleton đảm bảo chỉ duy nhất một thể hiện (instance) được tạo ra và nó sẽ cung cấp cho bạn một method để có thể truy xuất được thể hiện duy nhất đó mọi lúc mọi nơi trong chương trình.

### Lý do áp dụng Singleton Pattern

- Trường hợp áp dụng:
    - Áp dụng vào việc lưu trữ tạm thời một danh sách các bài hát đã crawl được
    - Áp dụng vào việc lưu trữ tạm thời các token dùng để reset mật khẩu cho user
- Lý do áp dụng:
    - Áp dụng vào việc lưu trữ tạm thời một danh sách các bài hát đã crawl được
        - Một bài hát crawl được nếu chưa muốn lưu ngay sẽ lưu tạm thời
        - Chỉ lưu tạm thời nên sẽ không cần tồn tại xuyên suốt, chỉ tồn tại đến khi server dược khởi động lại
        - Một bài hát crawl có thể crawl lại nên không cân lưu vĩnh viễn
        - Chỉ một danh sách các bài hát được tạo ra trong khoảng thời gian server hoạt động để lưu trữ các bài hát crawl được
    - Áp dụng vào việc lưu trữ tạm thời các token dùng để reset mật khẩu cho user
        - User lấy lại mật khẩu sẽ được sinh ra một token
        - Token chỉ tồn tại trong 5 phút và sau đó không còn dùng được nữa
        - Người dùng chỉ sử dụng token được 1 lần duy nhất cho việc reset mật khẩu sau đó sẽ xóa
        - Nếu người dùng không sử dụng sẽ tự động loại bỏ token die ở một thời điểm nào đó (restart server)
        - Khi server hoạt động chỉ cần tạo ra một danh sách chứa các token được tạo ra
- Ưu điểm sau khi áp dụng
    - Tới ưu code (rút ngắn code) nếu sử dụng ở nhiều nơi
    - Chỉ khởi tạo một danh sách duy nhất để lưu trữ dữ liệu trong suốt thời gian server chạy
    - Giảm tải cho database
    - Tự động clear khi khởi động lại server

### Mô tả việc áp dụng Singleton Pattern

- Class diagram:

`TempCrawlSongSingleton`

<img src="bin/Singleton-crawl-class-diagram.png" alt="Singleton-crawl-class-diagram">

`ResetPwSingleton`

<img src="bin/Singleton-reset-class-diagram.png" alt="Singleton-reset-class-diagram">

- Trong đó:
    - `TempCrawlSongSingleton`: Danh sách lưu bài hát crawl tạm
        - `TempCrawlSongModel`: là lớp chịu trách nhiệm định nghĩa các dữ liệu cho mỗi object
        - `TempCrawlSong`: Là lớp chứa việc khởi tạo singleton và các phương thức làm việc với list được tạo
    - `ResetPwSingleton`: Danh sách lưu bài hát crawl tạm
        - `ResetPwModel`: là lớp chịu trách nhiệm định nghĩa các dữ liệu cho mỗi object
        - `ResetPw`: Là lớp chứa việc khởi tạo singleton và các phương thức làm việc với list được tạo

### Áp dụng Singleton Pattern

- **Trước khi áp dụng**: 
    - Phải sử dụng database cho việc lưu trữ các dữ liệu tạm
    - Hoặc tạo một class cho việc lưu trữ nhưng không tối ưu vì có thể người phát triển dự án sau này sẽ không biết và new lại trong quá trình code

</br>

- **Sau khi áp dụng**

<code>TempCrawlSongSingleton > TempCrawlSongModel.cs</code>

```cs
public class TempCrawlSongModel
{
    public string id  { get; set; } = Guid.NewGuid().ToString("N");
    public string Name { get; set; }
    public string Artist { get; set; }
    public string Img { get; set; }
    public string Src { get; set; }
    public string UName { get; set; }
    public int UId { get; set; }
    public DateTime CreatedAt { get; set; }
}
```

<code>TempCrawlSongSingleton > TempCrawlSong.cs</code>

```cs
public class TempCrawlSong
{
    private static volatile TempCrawlSong instance;
    private static readonly object InstanceLoker = new();  
    public static List<TempCrawlSongModel> list;
    private TempCrawlSong()
    {
        list = new();
    }
    public static TempCrawlSong GetInstance
    {
        get
        {
            if(instance == null)
            {
                lock (InstanceLoker)
                {
                    if(instance == null)
                    {
                        instance = new TempCrawlSong();
                    }
                }
            }
            return instance;
        }
    }
    public TempCrawlSongModel Get(string id)
    {
        var item = (from r in list
                    where r.id.Equals(id)
                    select r).FirstOrDefault();
        return item;
    }
    public List<TempCrawlSongModel> GetAll()
    {
        return list;
    }
    public void Add(TempCrawlSongModel data)
    {
        list.Add(data);
    }
    public void AddList(List<TempCrawlSongModel> data)
    {
        list.AddRange(data);
    }
    public void Remove(string id)
    {
        var item = (from r in list
                   where r.id.Equals(id)
                select r).FirstOrDefault();
        list.Remove(item);
    }
    public void Clear()
    {
        list.Clear();
    }
    public int GetSize()
    {
        return list.Count();
    }
}
```

<code>ResetPwSingleton > ResetPwModel.cs</code>

```cs
public class ResetPwModel
{
    public string token { get; set; }
    public DateTime createdAt { get; set; }
}
```

<code>ResetPwSingleton > ResetPw.cs</code>

```cs
public class ResetPw
{
    private static volatile ResetPw instance;
    private static readonly object InstanceLoker = new();
    public static List<ResetPwModel> list;
    private ResetPw()
    {
        list = new();
    }
    public static ResetPw GetInstance
    {
        get
        {
            if (instance == null)
            {
                lock (InstanceLoker)
                {
                    if (instance == null)
                    {
                        instance = new ResetPw();
                    }
                }
            }
            return instance;
        }
    }
    public ResetPwModel Get(string token)
    {
        var item = (from r in list
                    where r.token.Equals(token)
                    select r).FirstOrDefault();
        return item;
    }
    public List<ResetPwModel> GetAll()
    {
        return list;
    }
    public void Add(ResetPwModel data)
    {
        list.Add(data);
    }
    public void Remove(string token)
    {
        var item = (from r in list
                    where r.token.Equals(token)
                    select r).FirstOrDefault();
        list.Remove(item);
    }
    public void RemoveDie()
    {
        list.RemoveAll(x => x.createdAt < DateTime.Now.Date.AddHours(-1));
    }
    public void Clear()
    {
        list.Clear();
    }
    public int GetSize()
    {
        return list.Count();
    }
}
```

### Testcase Singleton Pattern

- **Testcase 01:** 
    - Input: Save a song <img src="bin/Singleton-crawl-save.png" alt="Singleton-crawl-save">
    - Output: Go to `http://localhost:3000/admin/temp-crawl` <img src="bin/Singleton-crawl-all.png" alt="Singleton-crawl-all">

- **Testcase 02:** 
    - Input: Restart server
    - Output: Go to `http://localhost:3000/admin/temp-crawl` <img src="bin/Singleton-crawl-restart.png" alt="Singleton-crawl-all">

- **Testcase 03:** 
    - Input: Send a reset request <img src="bin/Singleton-reset-send.png" alt="Singleton-reset-send">
    - Output: 
        - <img src="bin/Auth-reset-password-mail.png" slt="Auth-reset-password-mail">
        - Go to link from email <img src="bin/Singleton-reset-new.png" alt="Singleton-reset-new">

- **Testcase 04:** 
    - Input: Change password with success
    - Output: Go to link from email <img src="bin/Singleton-reset-notfound.png" alt="Singleton-reset-notfound">

</br>

# 5. Some Pictures

`Home`
<img src="bin/Home.png" alt="Home">

`Home mobile`
<img src="bin/Home-mobile.png" alt="Home-mobile">

`Player control`
<img src="bin/Home-player-list.png" alt="Home-player-list">

`Config some interface`
<img src="bin/Config-some-interface.png" alt="Config-some-interface">

`Profile`
<img src="bin/Profile.png" alt="Profile">

`Song lists`
<img src="bin/Song-list-choose-category.png" alt="Song-list-choose-category">

`Album`
<img src="bin/Album.png" alt="Album">

`Song`
<img src="bin/Song.png" alt="Song">

`Manage`
<img src="bin/Manage.png" alt="Manage">

`Admin panel`
<img src="bin/Admin-panel.png" alt="Admin-panel">

`Find songs and albums`
<img src="bin/Find-songs-and-albums.png" alt="Find-songs-and-albums">

`Admin crawl nct song`
<img src="bin/Admin-crawl-song-nct.png" alt="Admin-crawl-song-nct">

`Admin crawl nct song - review`
<img src="bin/Admin-crawl-song-nct-review-song.png" alt="Admin-crawl-song-nct-review-song">

`Mail reset password`
<img src="bin/Auth-reset-password-mail.png" slt="Auth-reset-password-mail">

<h5 align="center">__qnp__</h5>
<h2 align="center">Thank you!</h3>