import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setBooks([])  //để khi input thay đổi thì xóa kết quả cũ
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c) //lưu cancel là một hàm có khả năng hủy request hiện tại
    }).then(res => {
      setBooks(prevBooks => {
        console.log("gọi api ")
        return [...new Set([...prevBooks, ...res.data.docs.map(b => b.title)])]
        //dùng Set để không bị trùng, qua bên kia dùng làm key
      })
      setHasMore(res.data.docs.length > 0) // còn hay không, chứ không phải là còn nhiều hay không
      setLoading(false) //sau khi load xong đánh dấu lại loading = false
    }).catch(e => {
      if (axios.isCancel(e)) return //bắt lỗi lúc request bị cancel do cleanup
      setError(true)
    })
    return () => cancel() //đây là cleanup function, nó sẽ chạy trước mỗi lần callback trong useEffect chạy
    //mục đích: khi gõ quá nhanh, get API gối nhau, chạy cleanup để hủy API trước đó
    //tránh hiển thị lung tung, và giải phóng bộ nhớ
  }, [query, pageNumber])

  return { loading, error, books, hasMore }
}
