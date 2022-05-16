import React, { useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'
import styles from './App.css';

export default function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNumber) //gọi hàm useBookSearch
  //mỗi khi query và page thay đổi, thì callback của useEffect trong hàm sẽ được gọi lại

  const observer = useRef() //giống biến toàn cục component
  console.log(observer, observer.current);
  const lastBookElementRef = useCallback(node => { //dùng useCallback để hàm lastBookElementRef không bị khởi tạo lại
    if (loading) return
    if (observer.current) observer.current.disconnect() //nếu trước đó có thì bỏ đi, không nghe tại vị trí cũ nữa
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) { //nếu last element giao với viewport và còn data
        setPageNumber(prevPageNumber => prevPageNumber + 1)
        console.log("page", pageNumber)
        console.log(entries[0].target)
      }
    })
    console.log(node);
    if (node) observer.current.observe(node) 
  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch} placeholder="Tìm sách ..."></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return <div ref={lastBookElementRef} key={book}>{book}</div>
          //Có 3 cách dùng ref DOM:
          //1. Dùng class component: this.last = React.createRef();
          //this.lastBookElementRef.current trả về DOM element
          //2. Dùng hook: last = useRef(null);
          //last.current trả về DOM element
          //3. Dùng Callback ref: last = (element) => {}
          //element là DOM element, không cần dùng current
        } else {
          return <div key={book}>{book}</div>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  )
}

