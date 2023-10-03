import SearchBar from "../../components/SearchBar";
import { BsChevronDown } from 'react-icons/bs'
import { useMemo, useState } from "react";
import Categories from "../../Categories";
import ProductCard from "../../components/ProductCard";
import { useLocation } from "react-router-dom";
import axios from "../../api/axios";
import useGetAxios from "../../hooks/useGetAxios";
import LoadingThreeDots from '../../components/LoadingThreeDots';

const Products = () => {
  // console.log('products rerendered ');
  const { state } = useLocation()
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [filter, setFilter] = useState((() => {
    const obj = { All: true };
    const activeCategories = Categories.reduce((result, el) => { return { ...result, [el.name]: false } }, obj)
    if (state?.category) {
      activeCategories.All = false;
      activeCategories[state.category] = true
    }
    return activeCategories
  }))

  // const buildQueryString = useCallback(() => {
  //   console.log('sssssquery');
  //   let qs = ''
  //   if (!filter.All) {
  //     qs = '?'
  //     qs += Object.keys(filter).reduce((previous, current) => filter[current] ? [...previous, current] : previous, []).map((el) => `categories[]=${el}`).join('&')
  //   }
  //   return qs
  // }, [filter])

  //build query string basing on the selected filter
  const queryString = useMemo(() => {
    let qs = ''
    if (!filter.All) {
      qs = '?categories[]='
      qs += Object.keys(filter).reduce((previous, current) => filter[current] ? [...previous, current] : previous, []).map((el) => `${el}`).join('&categories[]=')
    }
    return qs
  }, [filter])

  const {data, loading, error} = useGetAxios('/products' + queryString, axios, [])

  return (
    <>
      <div className=" relative md:px-4  border-b ">
        <div className="w-full max-w-[1520px] mx-auto relative p-1 sm:p-4">


          <div className="w-3/4 md:w-1/2 mx-auto min-w-[256px]">
            <SearchBar />
          </div>

          {/* categories filter */}
          {/* <div className="inline-block md:absolute md:top-4 left-4 z-10">
          <div className="relative">

            <div className="h-12 select-none w-fit px-3 flex justify-center items-center space-x-2 py-1 shadow-md rounded-full text-lg text-zinc-800 cursor-pointer " onClick={() => { setCategoryOpen(!categoryOpen) }}>
              <p >Categories</p>
              <div className={`rounded-full ${filter.All ? 'hidden' : ''} bg-primary text-base px-2 text-white`}>
                {Object.keys(filter).reduce((r, v) => { return filter[v] ? r + 1 : r }, 0)}
              </div>
              <BsChevronDown />
            </div>

            <div className={`absolute top-12 ${categoryOpen ? 'block' : 'hidden'} z-10 py-3 px-2`}>
              <div className="rounded-md  border shadow-md p-3 flex flex-col gap-2 bg-white text-lg">
                {filter && Object.keys(filter).map((el, idx) => {
                  return (
                    <label htmlFor={el}>
                      <div className="flex justify-between  space-x-3 hover:bg-zinc-100 px-2 cursor-pointer" key={el}>
                        <p className={`whitespace-nowrap select-none`}>{el}</p>
                        <input type="checkbox" name={el} id={el} disabled={el !== "All" ? filter.All : false}
                          checked={filter[el]} onChange={(e) => { setFilter((oldval) => { return { ...oldval, [el]: e.target.checked } }) }}
                          className='scale-125 cursor-pointer'
                        />
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div> */}


          {/* gpt */}

          <div className="relative inline-block md:absolute md:top-4 md:left-4 z-10">
            {/* <div className="relative"> */}

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
              {/* </div> */}
            </div>
          </div>

          {/* gpt */}
        </div>

      </div>

      {error ? <p className="text-lg text-red-500" > {error}</p>
        :
        loading ?
          <LoadingThreeDots />
          : data?.length > 0 ?
            <main className="px-4 py-7 grid grid-flow-row grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-3 md:gap-6 w-full max-w-[1520px] mx-auto ">
              {data.map((el, idx) => {
                return (
                  <ProductCard data={el} key={idx} />
                )
              })}
            </main>
            : <p className="text-lg text-red-500"> no products available </p>
      }
    </>
  );
}

export default Products;