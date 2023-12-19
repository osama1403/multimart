import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg'
import { Link } from 'react-router-dom'
import { AiFillStar } from 'react-icons/ai'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import usePrivateAxios from '../../hooks/usePrivateAxios'

const OrderProductItem = ({ product, details, rating,delivered }) => {
  const serverUrl = process.env.REACT_APP_URL
  const privateAxios = usePrivateAxios()
  const [rate, setRate] = useState()
  const handleRate = async (x) => {
    console.log(x);
    console.log(product._id)
    const id = product._id
    try {
      await privateAxios.post('/user/rateproduct', { id, rate: x })
      setRate(x)
    } catch (error) {
      console.log(error);
    }

  }
  // rating stars coloring
  const one = useRef()
  const two = useRef()
  const three = useRef()
  const four = useRef()
  const five = useRef()
  
  const rateStars = useCallback((x) => {
    const a = [one, two, three, four, five]
    for (let i = 0; i < 5; i++) {
      if (x > i) {
        a[i].current.style.color = '#ea3c12' //primary color
      }
      else {
        a[i].current.style.color = 'gray' // #808080
      }
    }
  },[])
  useLayoutEffect(()=>{
    setRate(rating?.rating ? rating.rating : 0)
  },[rating?.rating])
  useEffect(() => {
    rateStars(rate)
  }, [rateStars,rate])

  console.log(product);
  return (
    <div className='w-full flex flex-col sm:flex-row items-center sm:items-stretch gap-3 py-4 max-w-2xl '>

      <div className='grow flex flex-col sm:flex-row flex-nowrap  gap-3 items-center  font-semibold font-nunito'>
        <img src={product.images[0] ? serverUrl + '/' + product.images[0] : prodPlaceholder} alt="" className='w-28 object-cover shadow-zinc-400 shadow-md aspect-[5/5] rounded-md' />

        <div className=' flex flex-col sm:py-4 items-center sm:items-start self-stretch sm:min-w-[200px]' >
          <Link to={`/products/${product._id}`} className='font-semibold text-lg'>{product.name}</Link>
          <div className='my-auto grow flex flex-col justify-center'>
            {
              product.customizations.map((el, idx) => {
                return <p className='' key={idx}><span className='text-zinc-600'>{el.name}:</span> {details.customizations[el.name]}</p>
              })
            }
          </div>
        </div>
      </div>
      <div className=' grow w-fit sm:w-auto flex flex-col justify-between'>
        <div className='grow w-fit sm:w-auto flex justify-between gap-4'>
          <p className=''>${(product.price / 100).toFixed(2)}</p>
          <p className=''>x{details.count}</p>
          <p>${((product.price * details.count) / 100).toFixed(2)}</p>
        </div>

        <div className={`text-primary ${!delivered?'hidden':''}`}>
          <p className='font-semibold'>Rate this product:</p>

          <div className='flex w-min text-xl mt-1 cursor-pointer text-[#808080]' onMouseOut={(() => { rateStars(rate) })} >
            <span ref={one}   onMouseOver={() => { rateStars(1) }} onClick={() => { handleRate(1) }}><AiFillStar /></span>
            <span ref={two}   onMouseOver={() => { rateStars(2) }} onClick={() => { handleRate(2) }}><AiFillStar /></span>
            <span ref={three} onMouseOver={() => { rateStars(3) }} onClick={() => { handleRate(3) }}><AiFillStar /></span>
            <span ref={four}  onMouseOver={() => { rateStars(4) }} onClick={() => { handleRate(4) }}><AiFillStar /></span>
            <span ref={five}  onMouseOver={() => { rateStars(5) }} onClick={() => { handleRate(5) }}><AiFillStar /></span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default OrderProductItem;