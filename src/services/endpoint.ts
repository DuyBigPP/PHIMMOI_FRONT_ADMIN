const BASE_URL = "https://phimmoibackend-production.up.railway.app";


/* ADMIN STATS */
export const GET_CATEGORY_STATS = `${BASE_URL}/api/admin/stats/categories`; // GET
/* respond body:
{
  "success": true,
  "data": [
    {
      "id": "3d8ed30e-0a0a-42a3-92fe-cd490a33491c",
      "name": "",
      "slug": "",
      "movieCount": 11
    },
    {
      "id": "227be6c0-d69e-4abf-bf75-f79e0b7b3cb9",
      "name": "Tâm Lý",
      "slug": "tam-ly",
      "movieCount": 5162
    },
*/
export const GET_COUNTRY_STATS = `${BASE_URL}/api/admin/stats/countries`; // GET
/* respond body:
{
  "success": true,
  "data": [
    {
      "id": "75e2705f-8f36-4eca-b75d-0622ca6c26b4",
      "name": "Malta",
      "slug": "malta",
      "movieCount": 3
    },
    {
      "id": "e69cd49a-4061-43e4-923a-ca2a80145864",
      "name": "Cambodia",
      "slug": "cambodia",
      "movieCount": 2
    },
*/
export const GET_TOP_RATED_STATS = `${BASE_URL}/api/admin/stats/top-rated`; // GET
/**
    query parameters:
    - limit: integer (query) default: 10
    respond body:
    {
  "success": true,
  "data": [
    {
      "id": "5334e2cd-9570-4c09-95a4-632d7af02492",
      "name": "Avatar 2:  Dòng Chảy Của Nước",
      "slug": "avatar-2-dong-chay-cua-nuoc",
      "originName": "Avatar: The Way of Water",
      "posterUrl": "https://phimimg.com/upload/vod/20250513-1/59fc5ffe0025ca40c99d48b070b59320.jpg",
      "thumbUrl": "https://phimimg.com/upload/vod/20250513-1/7b4e51db1a258ef9602558352066bfec.jpg",
      "year": 2022,
      "view": 9,
      "average_rating": "5",
      "rating_count": "1"
    },
 */
export const GET_TOP_VIEWED_STATS = `${BASE_URL}/api/admin/stats/top-viewed`; // GET
/**
    query parameters:
    - limit: integer (query) default: 10
    respond body: trả về như phim bình thường.
    },
 */
export const GET_TOP_FAVORITE_STATS = `${BASE_URL}/api/admin/stats/top-favorite`; // GET
/**
    query parameters:
    - limit: integer (query) default: 10
    respond body: trả về như phim bình thường.
    },
*/
export const GET_TOP_COMMENTED_STATS = `${BASE_URL}/api/admin/stats/top-commented`; // GET
/**
    query parameters:
    - limit: integer (query) default: 10
    respond body: trả về như phim bình thường.
    },
*/





/* COMMENT */
export const CREATE_COMMENT = `${BASE_URL}/api/movies/{movieId}/comments`; // POST
/* parameters for create comment:
    - movieId: string (path)
    - content: string (body)
*/
export const GET_COMMENT_BY_MOVIE_ID = `${BASE_URL}/api/movies/{movieId}/comments`; // GET
/* parameters for get comment by movie id:
    - movieId: string (path)
    - page: integer (query) default: 1
    - limit: integer (query) default: 10
*/
export const DELETE_COMMENT = `${BASE_URL}/api/comments/{commentId}`; // DELETE
/* parameters for delete comment:
    - commentId: string (path)
*/


/* FAVORITE */
export const GET_USER_FAVORITE = `${BASE_URL}/api/favorites`; // GET
/* parameters for get user favorite: not need any parameters */
export const ADD_FAVORITE = `${BASE_URL}/api/favorites`; // POST
/* parameters for add favorite:
    - movieId: string (body)
*/
export const DELETE_FAVORITE = `${BASE_URL}/api/favorites/{favoriteId}`; // DELETE
/* parameters for delete favorite:
    - movieId: string (path)
*/



/* MOVIE */
export const GET_MOVIE_LIST = `${BASE_URL}/api/movies`; // GET
/* parameters for get movie list:
    - page: integer (query) default: 1
    - limit: integer (query) default: 10
    - type: string (query) (single, series)
    - category: string (query)
    - country: string (query)
    - year: integer (query) 
    - search: string (query) default: ""
*/
export const GET_MOVIE_BY_SLUG = `${BASE_URL}/api/movies/{slug}`; // GET
/* parameters for get movie by slug:
    - slug: string (path)
*/
export const ADD_NEW_MOVIE = `${BASE_URL}/api/movies`; // POST
/* respond body:
name
string
Tên phim

slug
string
Slug của phim

originName
string
Tên gốc của phim

content
string
Nội dung phim

type
string
Loại phim (movie, series, hoathinh)

status
string
Trạng thái phim (completed, ongoing)

poster
string($binary)
File poster phim

thumb
string($binary)
File thumbnail phim

isCopyright
boolean
Có bản quyền hay không

subDocquyen
boolean
Có phụ đề hay không

chieurap
boolean
Có chiếu rạp hay không

trailerUrl
string
URL trailer phim

time
string
Thời lượng phim

episodeCurrent
string
Tập hiện tại (cho phim series)

episodeTotal
string
Tổng số tập (cho phim series)

quality
string
Chất lượng phim

lang
string
Ngôn ngữ phim

notify
string
Thông báo về phim

showtimes
string
Lịch chiếu phim

year
integer
Năm phát hành

categories
array<string>
Danh sách slug của thể loại

countries
array<string>
Danh sách slug của quốc gia

actors
array<string>
Danh sách tên diễn viên

respond body:
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "originName": "string",
    "type": "string",
    "poster": "string",
    "backdrop": "string",
    "description": "string",
    "year": 0,
    "duration": 0,
    "rating": 0,
    "categories": [
      {
        "category": {
          "id": "string",
          "name": "string",
          "slug": "string"
        }
      }
    ],
    "countries": [
      {
        "country": {
          "id": "string",
          "name": "string",
          "slug": "string"
        }
      }
    ]
  }
}
*/
export const UPDATE_MOVIE_BY_ID = `${BASE_URL}/api/movies/{id}`; // PUT
/* parameters for update movie by id:
    - id: string (path)
    respond body: 
    name
string
Tên phim

slug
string
Slug của phim

originName
string
Tên gốc của phim

content
string
Nội dung phim

type
string
Loại phim (movie, series, hoathinh)

status
string
Trạng thái phim (completed, ongoing)

poster
string($binary)
File poster phim

thumb
string($binary)
File thumbnail phim

isCopyright
boolean
Có bản quyền hay không

subDocquyen
boolean
Có phụ đề hay không

chieurap
boolean
Có chiếu rạp hay không

trailerUrl
string
URL trailer phim

time
string
Thời lượng phim

episodeCurrent
string
Tập hiện tại (cho phim series)

episodeTotal
string
Tổng số tập (cho phim series)

quality
string
Chất lượng phim

lang
string
Ngôn ngữ phim

notify
string
Thông báo về phim

showtimes
string
Lịch chiếu phim

year
integer
Năm phát hành

tmdbId
string
ID phim trên TMDB

tmdbType
string
Loại phim trên TMDB

tmdbVoteAverage
number
Điểm đánh giá trung bình trên TMDB

tmdbVoteCount
integer
Số lượt đánh giá trên TMDB

imdbId
string
ID phim trên IMDB

categories
array<string>
Danh sách slug của thể loại

countries
array<string>
Danh sách slug của quốc gia

actors
array<string>
Danh sách tên diễn viên

respond body: nhu add new movie
*/
export const DELETE_MOVIE_BY_ID = `${BASE_URL}/api/movies/{id}`; // DELETE
/* parameters for delete movie by id:
    - id: string (path)
*/  
export const ADD_EPISODE = `${BASE_URL}/api/episodes`; // POST
/* parameters for add episode:
    - name: string (body)
    - slug: string (body)
    - movieId: string (body)
    - serverName: string (body) optional
    - video: string($binary) (body) 

    respond body:
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "filename": "string",
    "linkEmbed": "string",
    "linkM3u8": "string",
    "movieId": "string",
    "serverName": "string",
    "createdAt": "2025-05-27T13:57:14.840Z",
    "updatedAt": "2025-05-27T13:57:14.840Z"
  }
}
*/
export const EDIT_EPISODE = `${BASE_URL}/api/episodes/{id}`; // PUT
/* parameters for edit episode:
    - id: string (path)
    - name: string (body)
    - slug: string (body)
    - movieId: string (body)
    - serverName: string (body) optional
    - video: string($binary) (body) 
*/
export const DELETE_EPISODE = `${BASE_URL}/api/episodes/{id}`; // DELETE
/* parameters for delete episode:
    - id: string (path)
*/

/* RATING */
export const CREATE_RATING = `${BASE_URL}/api/movies/{movieId}/ratings`; // POST
/* parameters for create rating:
    - movieId: string (path)
    - score: integer (body)
    - review: string (body)
*/
export const GET_RATING_BY_MOVIE_ID = `${BASE_URL}/api/movies/{movieId}/ratings`; // GET
/* parameters for get rating by movie id:
    - movieId: string (path)
    - page: integer (query) default: 1
    - limit: integer (query) default: 10
*/
export const DELETE_RATING = `${BASE_URL}/api/ratings/{ratingId}`; // DELETE
/* parameters for delete rating:
    - movieId: string (path)
*/

/* RECOMMENDATION */
export const GET_POPULAR_MOVIE = `${BASE_URL}/api/movies/popular`; // GET
/* parameters for get popular movie:
    - page: integer (query) default: 1
    - limit: integer (query) default: 10
*/
export const GET_RELATED_MOVIE = `${BASE_URL}/api/movies/{movieId}/related`; // GET
/* parameters for get related movie:
    - movieId: string (path)
    - limit: integer (query) default: 10
*/

/* VIEW */
export const CREATE_VIEW = `${BASE_URL}/api/movies/{movieId}/view`; // POST
/* parameters for create view:
    - movieId: string (body)
*/
export const GET_MOVIE_VIEW_STATS = `${BASE_URL}/api/movies/views/stats`; // GET
/* parameters for get movie view stats:
    - period: string (query) default: "week" (options: day, week, month, year)
    - limit: integer (query) default: 10
*/


/* ACTOR*/
export const ADD_ACTOR = `${BASE_URL}/api/actors`; // POST
/* parameters for add actor:
    - name: string (body)
*/



/* AUTH */
export const REGISTER = `${BASE_URL}/api/register`; // POST
/* parameters for register:
    - email: string (body)
    - password: string (body)
    - name: string (body)
*/  
export const LOGIN = `${BASE_URL}/api/login`; // POST
/* parameters for login:
    - email: string (body)
    - password: string (body)
*/
export const GET_USER_INFO = `${BASE_URL}/api/me`; // GET

export const GET_USER_LIST = `${BASE_URL}/api/users`; // GET
/* respond body:
[
  {
    "id": "d5519254-0eba-4183-acc6-2181ac5091e2",
    "email": "user@example.com",
    "name": "string",
    "isAdmin": true,
    "createdAt": "2025-05-17T11:40:26.549Z",
    "updatedAt": "2025-05-17T11:41:08.736Z"
  },
  {
    "id": "e0afe11e-c2dd-4437-80b6-17aa919f8285",
    "email": "vectongu@gmail.com",
    "name": "trungdan",
    "isAdmin": false,
    "createdAt": "2025-05-20T15:06:40.881Z",
    "updatedAt": "2025-05-20T15:06:40.881Z"
  },
*/
export const UPDATE_USER_INFO = `${BASE_URL}/api/users/{id}`; // PUT
/* parameters for update user info:
    - id: string (path)
    - name: string (body)
    - isAdmin: boolean (body)
*/
export const DELETE_USER = `${BASE_URL}/api/users/{id}`; // DELETE
/* parameters for delete user:
    - id: string (path)
*/


/* CATEGORIES */
export const ADD_CATEGORY = `${BASE_URL}/api/categories`; // POST
/* parameters for add category:
    - name: string (body)
    - slug: string (body)
*/
/* COUNTRY */
export const ADD_COUNTRY = `${BASE_URL}/api/countries`; // POST
/* parameters for add country:
    - name: string (body)
    - slug: string (body)
*/