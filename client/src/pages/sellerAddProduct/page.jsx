import { useState } from "react";
import categs from '../../Categories'
import { AiFillCloseCircle, AiOutlineCheck } from 'react-icons/ai'
import { BsThreeDots } from "react-icons/bs";
import { FaPlus, } from 'react-icons/fa6'
import usePrivateAxios from '../../hooks/usePrivateAxios'
// import axios from "../../api/axios";

const AddProduct = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [priceCents, setPriceCents] = useState(0)
  const [stock, setStock] = useState(0)
  const [alwAvail, setAlwAvail] = useState(false)
  const [description, setDescription] = useState('')
  const [specifications, setSpecifications] = useState([])
  const [categories, setCategories] = useState([])
  const [opencategs, setOpenCategs] = useState(false)
  const [opencust, setOpenCust] = useState(false)
  const [custname, setCustName] = useState('')
  const [custoptions, setCustOptions] = useState([])
  const [customizations, setCustomizations] = useState([])
  const [custalert, setCustAlert] = useState();
  const [images, setImages] = useState([])
  const [alert, setAlert] = useState('')
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState(false)
  const privateaxios = usePrivateAxios()

  const addSpecification = (e) => {
    setSpecifications(p => {
      let sp = [...p]
      sp.push('')
      return sp
    })
  }

  const alertCustomization = (text) => {
    setCustAlert(text)
    setTimeout(() => {
      setCustAlert(null)
    }, 5000);
  }

  const handleAddCustomization = () => {
    if (!custname.trim()) {
      alertCustomization('please provide a name for this customization')
      return
    }
    if (custoptions.length < 2) {
      alertCustomization('customization must at least has two options')
      return
    }
    if (custoptions.filter((el) => { return el.trim() === '' }).length > 0) {
      alertCustomization('option should at least be one character')
      return
    }

    const cust = {
      name: custname,
      options: custoptions
    }
    setCustomizations((p) => {
      let temp = [...p]
      temp.push(cust)
      return temp
    })
    setCustName('')
    setCustOptions([])
    setOpenCust(false)
  }

  const handleAddImage = (e) => {
    if (e.target.files[0]) {
      const img = e.target.files[0]
      setImages((p) => {
        const temp = [...p]
        temp.push(img)
        return temp
      })
    }
    // e.target.files=null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const prodPrice = price * 100 + priceCents
      if (!name || prodPrice === 0 || categories.length === 0) {
        setAlert("please provide all necessarry data")
        return
      }
      const stockCount = alwAvail ? -1 : stock
      setLoading(true)
      const productData = JSON.stringify({
        name,
        price: prodPrice,
        stock: stockCount,
        description,
        specifications,
        categories,
        customizations
      })

      const f = new FormData()
      images.forEach((el) => {
        f.append('images', el)
      })
      f.append('productData', productData)

      const response = await privateaxios.post('/seller/addproduct', f, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response) {
        setAdded(true)
      }
    } catch (error) {
      if (error.response) {
        setAlert(error.response.data?.msg ? error.response.data?.msg : 'something went wrong')
      } else if (error.request) {
        setAlert('no server response')
      }
    }
    setLoading(false)
  }

  return (
    <>
      <div className="grow bg-inc-50 min-h-screen px-2 sm:px-6 py-8 max-w-6xl mx-auto">
        <div className="py-2 px-4 border rounded-lg shadow-md">

          <h1 className="text-2xl text-primary">Add new product :</h1>
          <form className="mt-6" onSubmit={handleSubmit} autoComplete="off">
            <div className="mt-4">
              <label htmlFor="name" className="block">Product Name:</label>
              <input type="text" autoComplete="off" id="name" value={name} onChange={(e) => { setName(e.target.value) }}
                className="outline-none bg-zinc-50 border px-2 py-1 text-lg rounded-lg w-full max-w-lg"
               />
            </div>

            <div className="mt-4">
              <label htmlFor="" className="mr-2">Price:</label>
              <input type="text" value={price} onChange={(e) => {
                const value = e.target.value
                if (value.match("^\\d{0,5}$")) {
                  setPrice(value ? parseInt(value) : 0)
                }
              }}
                className="outline-none bg-zinc-50 border px-1 text-lg rounded-lg w-16 max-w-lg"
              />
              <span className="mx-1 text-lg">.</span>
              <input type="text" value={priceCents} onChange={(e) => {
                const value = e.target.value
                if (value.match("^\\d{0,2}$")) {
                  setPriceCents(value ? parseInt(value) : 0)
                }
              }}
                className="outline-none bg-zinc-50 border px-1 text-lg rounded-lg w-8 max-w-lg"
              />
              < span className="ml-4">{price}.{priceCents.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })} $</span>
            </div>

            <div className="mt-4">
              <label htmlFor="" className="mr-2">Stock:</label>
              <input type="text" value={stock} onChange={(e) => {
                const value = e.target.value
                if (value.match("^\\d{0,5}$")) {
                  setStock(value ? parseInt(value) : 0)
                }
              }}
                disabled={alwAvail}
                className="outline-none bg-zinc-50 border px-1 text-lg rounded-lg w-16 max-w-lg"
              />
              <input type="checkbox" id="alwaysavailable" className="ml-4" checked={alwAvail} onChange={(e) => { setAlwAvail(e.target.checked) }} />
              <label htmlFor="alwaysavailable" className={`${alwAvail ? 'text-green-600' : ''}`}> Always Available</label>

            </div>

            <div className="mt-4">
              <label htmlFor="description" className="block">Description:</label>
              <textarea name="description" id="description" rows={5}
                className="outline-none bg-zinc-50 border px-2 resize-none py-1 rounded-lg w-full max-w-lg"
                value={description} onChange={(e) => { setDescription(e.target.value) }}
              />
            </div>

            {/* specifications */}
            <div className="mt-4  w-full max-w-lg">
              <div className="flex justify-between items-center">
                <p className="text-lg">Specifications:</p>
                <button type="button" onClick={addSpecification} className="flex items-center hover:text-green-500 p-1 rounded-md"><FaPlus className="text-green-500 mr-1" />Add</button>
              </div>

              <div className="px-2 py-1 rounded-lg border flex flex-col space-y-3">

                {specifications.length > 0 ?
                  specifications.map((el, idx) => {
                    return (
                      <div key={idx} className="w-full flex items-center">
                        <p className="inline-block">{idx}-</p>
                        <input type="text" value={el}
                          onChange={(e) => {
                            setSpecifications((p) => {
                              let temp = [...p]
                              temp[idx] = e.target.value
                              return (temp)
                            })
                          }}
                          className="outline-none bg-zinc-50 border px-2 py-1 mx-2 rounded-lg grow"
                        />
                        <button type="button"
                          onClick={(e) => {
                            setSpecifications((p) => {
                              let temp = [...p]
                              temp.splice(idx, 1)
                              return temp
                            })
                          }}
                          className="text-red-500 text-xl"
                        ><AiFillCloseCircle /></button>

                      </div>
                    )
                  })
                  : <p>no specifications</p>
                }
              </div>



            </div>

            {/* Categories */}
            <div className="mt-5 w-full max-w-lg">
              <div className="flex items-center justify-between">
                <p className="text-lg">Categories:</p>
                <button type="button" className="p-1 rounded-md flex items-center hover:text-green-500"
                  onClick={() => { setOpenCategs(!opencategs) }}
                ><FaPlus className="text-green-500 mr-1" /> Add</button>
              </div>

              {opencategs &&
                <div className="p-2 my-2 rounded-lg border border-zinc-500 flex flex-wrap gap-2 w-full">
                  {
                    categs.map((el, idx) =>
                      <div key={idx} className={`px-2 py-1 border rounded-full cursor-pointer ${categories.includes(el.name) ? 'border-green-600 text-green-600' : 'border-zinc-500'}`}
                        onClick={() => {
                          let temp = [...categories];
                          if (temp.includes(el.name)) {
                            temp = temp.filter(item => item !== el.name)
                          } else {
                            temp.push(el.name)
                          }
                          setCategories(temp)
                        }}
                      >
                        <p>{el.name}</p>
                      </div>
                    )
                  }
                </div>
              }

              <div className=" flex flex-wrap gap-2 border rounded-md px-2 py-1">
                {categories.length ?
                  categories.map((el, idx) =>
                    <div className="py-1 px-2 border border-zinc-400 rounded-full flex items-center" key={idx}>
                      <p className="mr-2">{el} </p>
                      <span className="text-red-500 text-xl cursor-pointer" onClick={() => {
                        setCategories((p) => {
                          let temp = [...p]
                          temp.splice(idx, 1)
                          return temp
                        })
                      }}><AiFillCloseCircle /></span>

                    </div>
                  )
                  : <p>no categories</p>
                }
              </div>

            </div>


            {/* customizations */}

            <div className="mt-5 w-full max-w-lg">
              <div className="w-full flex items-center justify-between">
                <p className="text-lg">Customizations (options)</p>
                <button type="button" className="p-1 rounded-md flex items-center hover:text-green-500"
                  onClick={() => { setOpenCust(!opencust) }}
                ><FaPlus className="text-green-500 mr-1" /> Add</button>
              </div>

              {/* adding block */}
              <div className={`w-full my-2 border rounded-md p-2 ${opencust ? 'block' : 'hidden'}`}>
                <p className="text-primary mb-3 font-medium">new customization:</p>

                <label htmlFor="custname" className="block">name:</label>
                <input type="text" id="custname" value={custname}
                  onChange={(e) => { setCustName(e.target.value) }}
                  className="px-2 py-1 w-full max-w-sm border border-zinc-400 rounded-lg outline-none mb-3" />

                <div className="flex items-center space-x-2">
                  <p>options:</p>
                  <button type="button" className="text-xl text-green-600 px-2 "
                    onClick={(e) => {
                      setCustOptions((p) => {
                        const temp = [...p]
                        temp.push('')
                        return temp
                      })
                    }}>
                    <FaPlus />
                  </button>
                </div>

                {(custoptions.length > 0) &&
                  custoptions.map((el, idx) => {
                    return (
                      <div className="flex items-center" key={idx}>

                        <input type="text" value={el} className="px-2 py-1 mt-2 w-full max-w-[150px] border border-zinc-400 rounded-lg outline-none mb-3"
                          onChange={(e) => {
                            setCustOptions((p) => {
                              let temp = [...p]
                              temp[idx] = e.target.value
                              return temp
                            })
                          }} />

                        <button type="button" className="text-red-500 text-lg p-2"
                          onClick={() => {
                            setCustOptions((p) => {
                              let temp = [...p]
                              temp.splice(idx, 1)
                              return temp
                            })
                          }}
                        ><AiFillCloseCircle /></button>


                      </div>
                    )
                  })
                }
                {custalert && <p className="text-red-600 mt-3">{custalert}</p>}
                <div className="w-full">

                  <button type="button" className="px-3 py-1 mt-3 border border-primary hover:text-primary w-fit mx-auto rounded-lg font-nunito"
                    onClick={handleAddCustomization}
                  >APPLY</button>
                </div>

              </div>

              <div className=" border rounded-lg px-2 py-1 flex flex-col  [&>*:not(:last-child)]:border-b">
                {
                  customizations.length > 0 ?
                    customizations.map((el, idx) =>
                      <div className="flex items-center space-x-6 py-1 " key={idx}>
                        <p className="font-medium">{el.name}:</p>
                        {el.options.map((el, idx) =>
                          <p key={idx}>{el},</p>
                        )}
                        <button type="button" className="text-red-500 text-lg p-1"
                          onClick={() => {
                            setCustomizations((p) => {
                              let temp = [...p]
                              temp.splice(idx, 1)
                              return temp
                            })
                          }}
                        ><AiFillCloseCircle /></button>                      </div>
                    )
                    : <p>no customizations</p>
                }
              </div>

            </div>

            {/* images */}
            <div className="mt-5 w-full max-w-lg">
              <p className="text-xl mb-3">Images:</p>
              <div className="flex flex-wrap gap-4">
                {
                  images.map((el, idx) => {
                    return (
                      <div className="w-24 h-24  relative border rounded-md" key={idx}>
                        <button type="button" className="absolute -top-2 -right-2 text-lg text-red-500"
                          onClick={() => {
                            setImages((p) => {
                              let temp = [...p]
                              temp.splice(idx, 1)
                              return temp
                            })
                          }}
                        >
                          <AiFillCloseCircle />
                        </button>
                        <img src={URL.createObjectURL(el)} alt="pro img" className="object-cover w-full h-full rounded-md" />
                      </div>
                    )

                  })

                }

                <label htmlFor="img" className={`cursor-pointer ${images.length < 4 ? 'block' : 'hidden'}`}>
                  <div className="w-24 h-24 rounded-md bg-zinc-200 flex items-center justify-center">
                    <FaPlus className="text-4xl text-zinc-400" />
                  </div>
                </label>
                <input type="file" name="img" id="img" className="hidden" accept="image/*"
                  onChange={handleAddImage}
                />

              </div>
            </div>
            <p className="my-1 text-red-500">{alert}</p>

            <div className="w-full max-w-lg mt-5 mb-9">
              <button className={` block px-12 py-1 mx-auto border ${added ? 'bg-green-500 text-white' : 'border-primary hover:bg-primary hover:text-white  text-primary'} rounded-md font-semibold text-xl`}>{added ? <AiOutlineCheck className="text-2xl" /> : loading ? <BsThreeDots className="text-2xl" /> : 'Add'} </button>
            </div>

          </form>
        </div >

      </div >
    </>
  );
}

export default AddProduct;