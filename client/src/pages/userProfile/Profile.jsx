import { useEffect, useState } from 'react';
import LoadingThreeDots from '../../components/LoadingThreeDots';
import { FiEdit } from 'react-icons/fi'
import useGetAxios from '../../hooks/useGetAxios';
import usePrivateAxios from '../../hooks/usePrivateAxios';
import profilePlaceholder from '../../assets/images/profilePlaceholder.png'
import useAuth from '../../hooks/useAuth';
const Profile = () => {

  //store original info in an object 
  // onchange compare the current input with the original data if it doesnt match then show Update Button
  // on update validate the fields data

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [dataAlert, setDataAlert] = useState('')
  const [changed, setChanged] = useState(false)
  const [img, setImg] = useState(null)
  const { setAuth } = useAuth()
  const serverUrl = process.env.REACT_APP_SERVER_URL
  const privateAxios = usePrivateAxios()
  const { data, loading, error } = useGetAxios('/user/profile', privateAxios, [])
  useEffect(() => {
    if (data) {
      setFirstName(data.firstName)
      setLastName(data.lastName)
      setPhone(data.phone)
      setAddress1(data.address1)
      setAddress2(data.address2)
    }
  }, [data])

  useEffect(() => {
    if (data) {
      if (data.firstName !== firstName || data.lastName !== lastName || data.phone !== phone || data.address1 !== address1 || data.address2 !== address2) {
        setChanged(true)
      } else {
        setChanged(false)
      }
    }
  }, [data, firstName, lastName, phone, address1, address2])

  const handleSetImage = (e) => {
    if (e.target.files[0]) {
      setImg(e.target.files[0])
    }
  }

  const handleImageSubmit = async () => {
    const f = new FormData()
    f.append('img', img)
    try {
      const res = await privateAxios.post('/user/updatepfp', f, { headers: { "Content-Type": 'multipart/form-data' } })
      if (res) {
        setAuth((p) => { return ({ ...p, userData: { ...p.userData, img: res.data.img } }) })
        data.profilePicture = res.data.img
        setImg(null)
      }
    } catch (e) {
      console.error(error)
    }
  }

  const handleUpdataInfo = async () => {
    const data = {
      firstName,
      lastName,
      phone,
      address1,
      address2
    }
    try {
      setDataAlert('')

      await privateAxios.post('/user/updateinfo', data)
      setChanged(false)
      const addresses = []
      if (address1)
        addresses.push(address1)
      if (address2)
        addresses.push(address2)

      setAuth((p) => { return ({ ...p, userData: { ...p.userData, addresses } }) })
    } catch (error) {
      if (error.response) {
        setDataAlert(error.response.data?.msg ? error.response.data?.msg : 'something went wrong')
      }
      if (error.request) {
        setDataAlert('no server response')
      }

    }

  }

  return (
    <>
      <div className='grow max-w-6xl mx-auto mb-10 px-3'>

        {
          error ?
            <div className="flex w-full h-[calc(100vh-64px)] justify-center items-center ">
              <p className="text-xl font font-semibold text-red-500">{error} </p>
            </div>
            :
            loading ?
              <LoadingThreeDots />
              :

              data && <>
                <div className='p-6 border-b flex flex-col sm:flex-row items-center sm:items-end gap-0 sm:gap-6'>
                  <div className='relative flex flex-col items-center'>
                    <label htmlFor='img' className='text-primary hover:text-blue-400  absolute top-2 right-2 cursor-pointer outline-none'><FiEdit /></label>
                    <input type="file" name="img" id="img" className='hidden' accept='image/*' onChange={handleSetImage} />
                    <img src={img ? URL.createObjectURL(img) : data.profilePicture ? serverUrl + '/api/image/' + data.profilePicture : profilePlaceholder} alt="" className='aspect-square w-40 h-40 rounded-full object-cover' />

                  </div>
                  <div>
                    {img &&
                      <div className='mt-1 mx-auto w-fit sm:w-auto'>
                        <button className='px-2 py-1 border border-primary text-primary text-xs rounded-full' onClick={handleImageSubmit}>Submit</button>
                        <button className='px-2 py-1 border border-zinc-600 text-zinc-600 text-xs rounded-full ml-2' onClick={() => { setImg(null) }}>Cancel</button>
                      </div>
                    }
                    <p className='text-2xl font-semibold my-2 sm:my-6 '> {`${data.firstName} ${data.lastName}`} </p>
                  </div>
                </div>

                <div className='flex flex-col flex-wrap items-start gap-1 py-4 text-xl font-nunito border-b'>
                  <p>cart: <span className='text-primary'>{data.cart?.length}</span></p>
                  <p>wishlist: <span className='text-primary'>{data.wishlist?.length}</span></p>
                  <p>total orders: <span className='text-primary'>{data.totalorders}</span></p>
                </div>

                <div className='mt-4 max-w-3xl text-zinc-700'>
                  <p className='text-lg w-fit'>Personal info:</p>
                  <div className='flex gap-4 flex-wrap mt-4'>
                    <div className='grow min-w-[250px] '>
                      <label htmlFor="first name" className='block'> First name:</label>
                      <input type="text" id="first name" className='outline-none border w-full rounded-lg bg-slate-100  p-2' value={firstName} onChange={(e) => { setFirstName(e.target.value) }} />
                    </div>
                    <div className='grow min-w-[250px]'>
                      <label htmlFor="last name" className='block'> Last name:</label>
                      <input type="text" id="last name" className='outline-none border w-full rounded-lg bg-slate-100  p-2' value={lastName} onChange={(e) => { setLastName(e.target.value) }} />
                    </div>
                    <div className='grow min-w-[250px]'>
                      <label htmlFor="phone number" className='block'> Phone number:</label>
                      <input type="text" id="phone number" className='outline-none numberinput none border w-full rounded-lg bg-slate-100 p-2' value={phone} onChange={(e) => { setPhone(e.target.value) }} />
                    </div>
                    <div className='w-full min-w-[250px]'>
                      <label htmlFor="adress" className='block'>Address1:</label>
                      <input type="text" id="adress" className='outline-none numberinput none border w-full rounded-lg bg-slate-100 p-2' value={address1} onChange={(e) => { setAddress1(e.target.value) }} />
                    </div>
                    <div className='w-full min-w-[250px]'>
                      <label htmlFor="adress" className='block'>Address2:</label>
                      <input type="text" id="adress" className='outline-none numberinput none border w-full rounded-lg bg-slate-100 p-2' value={address2} onChange={(e) => { setAddress2(e.target.value) }} />
                    </div>
                  </div>
                  {dataAlert && <p>{dataAlert}</p>}
                  <div className='w-full max-w-3xl '>
                    <button className={`mt-4 mx-auto block rounded-md px-4 py-1  border font-semibold border-primary text-primary ${changed ? '' : 'hidden'}`} onClick={handleUpdataInfo}>Update</button>
                  </div>


                </div>


              </>
        }
      </div>

    </>
  );
}

export default Profile;