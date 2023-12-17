import SearchBar from "../../components/SearchBar";
import { BsChevronDown } from 'react-icons/bs'
import { useMemo, useState } from "react";
import Categories from "../../Categories";
import ProductCard from "../../components/ProductCard";
import { useLocation } from "react-router-dom";
import axios from "../../api/axios";
import useGetAxios from "../../hooks/useGetAxios";
import LoadingThreeDots from '../../components/LoadingThreeDots';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Products = () => {
  const pageCount = 40
  const { state } = useLocation()
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchString, setSearchString] = useState(state?.searchString ? state.searchString : '')
  const [page, setPage] = useState(1)

  const [filter, setFilter] = useState(() => {
    const obj = { All: true };
    const activeCategories = Categories.reduce((result, el) => { return { ...result, [el.name]: false } }, obj)
    if (state?.category) {
      activeCategories.All = false;
      activeCategories[state.category] = true
    }
    return activeCategories
  })

  const handleSearch = (x) => {
    setPage(1)
    setSearchString(x)
  }

  //build query string basing on the selected filter
  const queryString = useMemo(() => {
    let qs = '?'
    if (!filter.All) {
      qs += 'categories[]='
      qs += Object.keys(filter).reduce((previous, current) => filter[current] ? [...previous, current] : previous, []).map((el) => `${el}`).join('&categories[]=')
    }
    if (searchString) {
      if (qs.length > 1) {
        qs += '&'
      }
      qs += 'search=' + searchString
    }
    if (page > 1) {
      if (qs.length > 1) {
        qs += '&'
      }
      qs += 'page=' + (page - 1)
    }
    return qs
  }, [filter, searchString, page])

  const { data, loading, error } = useGetAxios('/products' + queryString, axios, [])
  const pagesNum = useMemo(()=>{return data ? Math.ceil(data.info.count / pageCount) : 0}, [data])
  return (
    <>
      <div className=" relative md:px-4  border-b ">
        <div className="w-full max-w-[1520px] mx-auto relative p-1 sm:p-4">


          <div className="w-3/4 md:w-1/2 mx-auto min-w-[256px]">
            <SearchBar handleSearch={handleSearch} searchValue={searchString} />
          </div>

          {/* categories filter */}

          <div className="relative inline-block md:absolute md:top-4 md:left-4 z-10">
            <div className="h-12 select-none w-fit px-3 flex justify-center items-center space-x-2 py-1 shadow-md rounded-full text-lg text-zinc-800 cursor-pointer" onClick={() => { setCategoryOpen(!categoryOpen) }}>
              <p>Categories</p>
              <div className={`rounded-full ${filter.All ? 'hidden' : ''} bg-primary text-base px-2 text-white`}>
                {Object.keys(filter).reduce((r, v) => { return filter[v] ? r + 1 : r }, 0)}
              </div>
              <BsChevronDown />
            </div>

            <div className={` md:absolute ${categoryOpen ? 'block' : 'hidden'} z-10 py-3 px-2`}>
              <div className="rounded-md border shadow-md p-3 flex flex-col gap-2 bg-white md:text-lg">
                {filter && Object.keys(filter).map((el) => {
                  return (
                    <label htmlFor={el} key={el}>
                      <div className="flex justify-between space-x-3 hover:bg-zinc-100 px-2 cursor-pointer">
                        <p className={`whitespace-nowrap select-none`}>{el}</p>
                        <input
                          type="checkbox"
                          name={el}
                          id={el}
                          disabled={el !== 'All' ? filter.All : false}
                          checked={filter[el]}
                          onChange={(e) => {
                            setPage(1)
                            setFilter((oldval) => {
                              return { ...oldval, [el]: e.target.checked };
                            });
                          }}
                          className="scale-125 cursor-pointer"
                        />
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>

      {error ? <p className="text-lg text-red-500" > {error}</p>
        :
        loading ?
          <LoadingThreeDots />
          : data?.products.length > 0 ?
            <main className="px-4 py-7 w-full max-w-[1520px] mx-auto ">
              <div className="grid grid-flow-row grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-3 md:gap-6">
                {data.products.map((el, idx) => {
                  return (
                    <ProductCard data={el} key={idx} />
                  )
                })}
              </div>

              {/* pagination */}
              <div className="mt-7 w-full ">
                <div className="w-full max-w-md flex-wrap mx-auto flex items-center justify-center gap-2">
                  
                  <button className="w-9 h-9 flex items-center justify-center rounded-md border font-semibold hover:text-primary border-primary disabled:border-zinc-300 disabled:hover:text-zinc-500 disabled:text-zinc-500" disabled={page === 1} onClick={() => { setPage(p => p - 1) }}><FaChevronLeft /></button>
                  <PageButton page={page} setPage={setPage} num={1} />
                  {(pagesNum > 5 && page > 3) && <span>...</span>}
                  {
                    pagesNum > 5 ?
                      page < 4 ?
                        [...Array(3)].map((el, idx) => <PageButton page={page} setPage={setPage} num={idx + 2} />)
                        : pagesNum - page < 3 ?
                          [...Array(3)].map((el, idx) => <PageButton page={page} setPage={setPage} num={pagesNum - 3 + idx} />)
                          :
                          [...Array(3)].map((el, idx) => <PageButton page={page} setPage={setPage} num={page - 1 + idx} />)
                      :
                      [...Array(pagesNum - 2 > 0 ? pagesNum - 2 : 0)].map((el, idx) => <PageButton page={page} setPage={setPage} num={idx + 2} />)
                  }

                  {(pagesNum > 5 && pagesNum - page >= 3) && <span>...</span>}
                  {pagesNum > 1 && <PageButton page={page} setPage={setPage} num={pagesNum} />}
                  <button className="w-9 h-9 flex items-center justify-center rounded-md border font-semibold hover:text-primary border-primary disabled:border-zinc-300 disabled:hover:text-zinc-500 disabled:text-zinc-500" disabled={page === pagesNum} onClick={() => { setPage(p => p + 1) }} ><FaChevronRight /></button>
                </div>
              </div>

            </main>
            : <p className="text-lg text-red-500"> no products available </p>
      }
    </>
  );
}

const PageButton = ({ page, setPage, num }) => {
  return (
    <button className={`w-9 h-9 flex items-center justify-center rounded-md border font-semibold border-primary ${page === num ? 'text-white bg-primary' : 'text-primary hover:bg-primary hover:text-white'}`} onClick={() => { setPage(num) }}>{num}</button>
  )
}




export default Products;