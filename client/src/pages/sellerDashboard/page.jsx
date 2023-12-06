import Chart from "./Chart.js";
import usePrivateAxios from "../../hooks/usePrivateAxios.js";
import useGetAxios from "../../hooks/useGetAxios.js";
import LoadingThreeDots from "../../components/LoadingThreeDots.jsx";
import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg';
import profilePlaceholder from '../../assets/images/profilePlaceholder.png';
import coverPlaceholder from '../../assets/images/coverPlaceholder.png';
import { Link } from "react-router-dom";
import { BsPencilFill } from 'react-icons/bs'
import { useEffect, useLayoutEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

const Dashboard = () => {
  const serverUrl = process.env.REACT_APP_URL
  const privateAxios = usePrivateAxios()

  const [profileImg, setProfileImg] = useState(null)
  const [coverImg, setCoverImg] = useState(null)
  const [bio, setBio] = useState('')
  const [name, setName] = useState('')
  const [edit, setEdit] = useState(false)
  const [reload, setReload] = useState(false)
  const [alert, setAlert] = useState('')
  const { data, loading, error } = useGetAxios('/seller/dashboard', privateAxios, [reload])

  const handleSetProfileImage = (e) => {
    if (e.target.files[0]) {
      setProfileImg(e.target.files[0])
    }
  }
  const handleSetCoverImage = (e) => {
    if (e.target.files[0]) {
      setCoverImg(e.target.files[0])
    }
  }

  useEffect(() => {
    if (data) {
      setName(data.shopName)
      setBio(data.bio || '')
    }
  }, [data])

  const toggleEdit = () => { 
    if(edit){
      setAlert('')
      setCoverImg(null)
      setProfileImg(null)
      setBio(data?.bio)
      setName(data?.shopName)
    }
    setEdit(!edit) 
  }


  const handleEditProfile = async () => {
    setAlert('')
    if (profileImg || coverImg || bio !== data?.bio || name !== data?.shopName) {
      const f = new FormData()
      if (profileImg) {
        f.append('images', profileImg)
      }
      if (coverImg) {
        f.append('images', coverImg)
      }
      const updateData = {
        profileImage: profileImg?.name || null,
        coverImage: coverImg?.name || null,
        bio: (bio !== data?.bio) ? bio : null,
        shopName: (name !== data?.shopName) ? name : null,
      }
      f.append('data', JSON.stringify(updateData))

      try {
        await privateAxios.post('/seller/updateprofile', f, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        setReload(p => !p)
        setCoverImg(null)
        setProfileImg(null)
        setEdit(false)

      } catch (error) {
        if (error.response) {
          setAlert(error.response.data?.msg ? error.response.data?.msg : 'something went wrong')
        } else if (error.request) {
          setAlert('no server response')
        }
      }
    }
  }

  // const data = true
  // const loading = false, error = false
  return (
    <div className="grow max-w-6xl self-stretch mx-auto px-1 sm:px-4 py-4 mb-4 font-nunito">
      {
        error ? <p className="text-lg text-red-500 " > {error}</p>
          :
          loading ?
            <LoadingThreeDots />
            : data &&
            <>
              <div className="w-full border py-4 sm:py-0 rounded-2xl shadow-md overflow-hidden">

                <div className="hidden sm:block relative">
                  <img src={coverImg ? URL.createObjectURL(coverImg) : data.coverPicture ? serverUrl + '/' + data.coverPicture : coverPlaceholder} alt="" className=' w-full aspect-[3/1] object-cover' />

                  <div className={`${edit ? '' : 'hidden'} absolute bottom-2 right-2 `}>
                    <label htmlFor='cimg' className='text-primary hover:text-blue-400 cursor-pointer outline-none block p-2'><FiEdit /></label>
                    <input type="file" name="cimg" id="cimg" className='hidden' accept='image/*' onChange={handleSetCoverImage} />
                  </div>
                </div>

                <div className='relative sm:mb-16'>
                  <div className='sm:absolute sm:-top-24 sm:left-20 flex flex-col sm:flex-row justify-center items-center gap-2 sm:items-end sm:w-fit'>

                    <div className='pfp before:hidden after:hidden sm:before:block sm:after:block z-0 relative w-40 h-40'>
                      <img src={profileImg ? URL.createObjectURL(profileImg) : data.profilePicture ? serverUrl + '/' + data.profilePicture : profilePlaceholder} alt="" className='object-cover border-white sm:border-4 bg-white rounded-full w-full h-full' />

                      {/* <button className="text-sm text-zinc-700 hover:text-primary "></button> */}
                      <div className={`${edit ? '' : 'hidden'} absolute top-2 right-2 `}>
                        <label htmlFor='pimg' className='text-primary hover:text-blue-400 cursor-pointer outline-none block p-2'><FiEdit /></label>
                        <input type="file" name="pimg" id="pimg" className='hidden' accept='image/*' onChange={handleSetProfileImage} />
                      </div>
                    </div>
                    <h1 className={`text-xl font-semibold sm:mb-7 sm:ml-1 z-0 line-clamp-1 max-w-[220px] text-ellipsis ${edit ? 'hidden' : ''}`} >{name}</h1>
                    <input type="text" name="name" id="name" value={name} onChange={(e) => { setName(e.target.value) }} className={`text-xl font-semibold sm:mb-7 sm:pl-1 z-0 outline-none max-w-[220px] border-b  ${edit ? '' : 'hidden'}`} />
                  </div>
                  <button className={` hover:text-primary p-2 rounded-full float-right -mt-16 sm:mt-3 mr-3 border hover:border-primary ${edit ? 'text-primary border-primary' : 'text-zinc-600'}`} onClick={toggleEdit}><BsPencilFill /></button>
                </div>
                <div className='text-zinc-700 max-w-xl px-4 py-2 font-medium '>
                  <p >About me:  <span className={` text-sm text-zinc-500 ${edit ? '' : 'hidden'}`}>{bio.trim().length}/200</span></p>
                  <p className={`break-words hyphens-auto ${edit ? 'hidden' : ''}`}>{data.bio}</p>
                  <textarea name="bio" id="bio" rows="4" value={bio} onChange={(e) => { if (e.target.value.trim().length <= 200) { setBio(e.target.value) } }} className={`w-full p-1 rounded-md outline-none border resize-none ${edit ? '' : 'hidden'} `}></textarea>
                </div>
                <p className={`text-red-500 px-4 ${edit ? '' : 'hidden'}`}>{alert}</p>
                <div className="w-full flex justify-center mb-4">
                  <button className={`px-3 py-1 border-2 font-semibold text-primary border-primary rounded-full hover:px-4 transition-all duration-200
                  ${(edit && (name?.trim() !== data.shopName || bio?.trim() !== data.bio || profileImg || coverImg) ? '' : 'hidden')}`}
                    onClick={handleEditProfile}>Update</button>
                </div>

              </div>



              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-5 mt-5 text-white font-nunito">
                <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-red-400 h-32 rounded-xl shadow-md">
                  <p className="text-xl sm:text-3xl">{data.productsCount}</p>
                  <p className="text-base sm:text-xl">Products</p>
                </div>
                <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-green-400 h-32 rounded-xl shadow-md">
                  <p className="text-xl sm:text-3xl">{data.totalOrders}</p>
                  <p className="text-base sm:text-xl">Total orders</p>
                </div>
                <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-blue-400 h-32 rounded-xl shadow-md">
                  <p className="text-xl sm:text-3xl">${(data.totalSales / 100).toFixed(2)}</p>
                  <p className="text-base sm:text-xl">Total sales</p>
                </div>
                <div className="flex flex-col mx-auto gap-2 justify-center items-center p-3 w-full bg-zinc-600 h-32 rounded-xl shadow-md">
                  <p className="text-xl sm:text-3xl">${(data.lastSevenDays / 100).toFixed(2)}</p>
                  <p className="text-base sm:text-xl">Last 7 days</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-5 mt-5 text-lg font-nunito ">
                <div className="w-full rounded-xl shadow-md bg-white border ">
                  <p className="border-b border-red text-lg p-2">orders :</p>
                  <div className="py-2 px-4">

                    <div className="flex justify-between w-full">
                      <p>pending :</p>
                      <p>{data.pending}</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>processing :</p>
                      <p>{data.processing}</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>shipping :</p>
                      <p>{data.shipping}</p>
                    </div>
                    <div className="flex justify-between w-full">
                      <p>complete :</p>
                      <p>{data.complete}</p>
                    </div>
                  </div>
                </div>



              </div>

              {/* chart for sales and orders */}
              {/* chart resise based on container , container should have known sizes (not percentages) */}
              <div className=" relative max-w-4xl px-1 md:px-4 py-2 mt-5 min-h-[250px]  mx-auto w-full sm:w-[70vw] aspect-[2/1] bg-white rounded-lg shadow-md border scroller overflow-x-auto">
                <div className="w-full h-full min-w-[450px]">
                  <Chart chartData={data.chartData} />
                </div>
              </div>


              {/* <div className="h-36 w-[70vw]  max-w-fit bg-red-300 overflow-auto">
                      <div className="flex flex-nowrap min-w-fit">
                        <div className="w-36">h</div>
                        <div className="w-36">h</div>
                        <div className="w-36">h</div>
                        <div className="w-36">h</div>
                      </div>
                    </div> */}

              {/* most sold products */}
              <div className=" max-w-4xl mt-5 mx-auto bg-white rounded-xl overflow-hidden shadow-md border ">

                <div className=" w-full  overflow-auto noscrollbar">
                  <table className="w-full min-w-max text-left  bg-white ">
                    <thead className=" font-medium border-b border-zinc-300 bg-white sticky top-0">
                      <tr>
                        <th scope="col" className="px-3 py-3 ">#</th>
                        <th scope="col" className="px-3 py-3">product name</th>
                        <th scope="col" className="px-3 py-3"># of orders</th>
                        <th scope="col" className="px-3 py-3 ">price</th>
                      </tr>
                    </thead>
                    <tbody className="[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-zinc-300">
                      {
                        data.topProducts.map((el, idx) => {
                          return (
                            <tr className="">
                              <td className="px-3 py-2 w-fit">{idx + 1}</td>
                              <td className="box-border">
                                <Link to={'/seller/products/' + el._id} className="w-full px-3 py-2 flex min-w-max items-center hover:bg-slate-200">

                                  <img src={el.images[0] ? serverUrl + '/' + el.images[0] : prodPlaceholder} alt="" className="w-11 aspect-square object-cover rounded-full" />
                                  <p className="ml-3 font-semibold max-w-[150px] break-words">{el.name}</p>
                                </Link>
                              </td>
                              <td className="px-3 py-2">{el.sold}</td>
                              <td className="px-3 py-2">${(el.price / 100).toFixed(2)}</td>
                            </tr>

                          )
                        })
                      }

                    </tbody>
                  </table>

                </div>
              </div>



            </>
      }
    </div >
  );
}

export default Dashboard;