
import { Link } from 'react-router-dom'

const Orders = () => {
  return (
    <>
      <div className="grow max-w-6xl mx-auto flex flex-col gap-4 px-1 sm:px-4 py-4 mb-4 font-nunito">

        <div className="flex max-w-3xl border rounded-lg p-4 shadow-md">
          <div className='grow '>
            <div className='w-full flex justify-between items-start'>
              <h1 className='text-lg font-bold text-primary'>#726</h1>
              <p className='text-primary'>$637.99</p>
            </div>
            <p className='mt-1 text-zinc-500'>March 23/2023</p>
            <p className='inline-block px-2 mt-2 bg-zinc-200 rounded-md'>shipping</p>
            
            <div className='flex flex-col sm:flex-row gap-6'>
              <div className='border-t mt-2 grow min-w-[240px]'>
                <div className='py-1 border-b'><span>1</span> <p className='ml-2 inline-block'> T-shirt </p></div>
                <div className='py-1 border-b'><span>2</span> <p className='ml-2 inline-block'> jordan shoes </p></div>
                <div className='py-1 border-b '><span>3</span> <p className='ml-2 inline-block'> hat </p></div>
                <div className='py-1 border-b '><span> 2 </span><p className='ml-2 inline-block'> more .. </p></div>
              </div>
              
              <div className='flex sm:flex-col justify-end gap-3'>
                <Link to={'#'} className='w-20 px-4 box-content py-1 border font-medium hover:text-primary border-primary rounded text-center' > Details</Link>
                <Link to={'#'} className='w-20 px-4 box-content py-1 border font-medium hover:text-primary border-primary rounded text-center' > Details</Link>
                {/* <img src={shirt1} alt="" /> */}
              </div>
            
            </div>
          </div>

        </div>


        <div className="flex max-w-3xl border rounded-lg p-4 shadow-md">
          <div className='grow '>
            <div className='w-full flex justify-between items-start'>
              <h1 className='text-lg font-bold text-primary'>#726</h1>
              <p className='text-primary'>$637.99</p>
            </div>
            <p className='mt-1 text-zinc-500'>March 23/2023</p>
            <p className='inline-block px-2 mt-2 bg-zinc-200 rounded-md'>shipping</p>
            
            <div className='flex flex-col sm:flex-row gap-6'>
              <div className='border-t mt-2 grow min-w-[240px]'>
                <div className='py-1 border-b'><span>1</span> <p className='ml-2 inline-block'> T-shirt </p></div>
                <div className='py-1 border-b'><span>2</span> <p className='ml-2 inline-block'> jordan shoes </p></div>
                <div className='py-1 border-b '><span>3</span> <p className='ml-2 inline-block'> hat </p></div>
                <div className='py-1 border-b '><span> 2 </span><p className='ml-2 inline-block'> more .. </p></div>
              </div>
              
              <div className='flex sm:flex-col justify-end gap-3'>
                <Link to={'#'} className='w-20 px-4 box-content py-1 border font-medium hover:text-primary border-primary rounded text-center' > Details</Link>
                <Link to={'#'} className='w-20 px-4 box-content py-1 border font-medium hover:text-primary border-primary rounded text-center' > Details</Link>
                {/* <img src={shirt1} alt="" /> */}
              </div>
            
            </div>
          </div>

        </div>


        <div className="flex max-w-3xl border rounded-lg p-4 shadow-md">
          <div className='grow '>
            <div className='w-full flex justify-between items-start'>
              <h1 className='text-lg font-bold text-primary'>#726</h1>
              <p className='text-primary'>$637.99</p>
            </div>
            <p className='mt-1 text-zinc-500'>March 23/2023</p>
            <p className='inline-block px-2 mt-2 bg-zinc-200 rounded-md'>shipping</p>
            
            <div className='flex flex-col sm:flex-row gap-6'>
              <div className='border-t mt-2 grow min-w-[240px]'>
                <div className='py-1 border-b'><span>1</span> <p className='ml-2 inline-block'> T-shirt </p></div>
                <div className='py-1 border-b'><span>2</span> <p className='ml-2 inline-block'> jordan shoes </p></div>
                <div className='py-1 border-b '><span>3</span> <p className='ml-2 inline-block'> hat </p></div>
                <div className='py-1 border-b '><span> 2 </span><p className='ml-2 inline-block'> more .. </p></div>
              </div>
              
              <div className='flex sm:flex-col justify-end gap-3'>
                <Link to={'#'} className='w-20 px-4 box-content py-1 border font-medium hover:text-primary border-primary rounded text-center' > Details</Link>
                <Link to={'#'} className='w-20 px-4 box-content py-1 border font-medium hover:text-primary border-primary rounded text-center' > Details</Link>
                {/* <img src={shirt1} alt="" /> */}
              </div>
            
            </div>
          </div>

        </div>




      </div>
    </>
  );
}

export default Orders;


{/* <div className="w-1/5 max-w-[9rem] min-w-[5rem] per p-4 box-border">
          <img src={img} alt="" className=' w-full  rotateY aspect-[4/5] border rounded-md'  />
          <img src={shirt1} alt="" className= 'inset-4 absolute w-[calc(100%-32px)] trx1 rotateY aspect-[4/5] border rounded-md'  />
          <img src={img} alt="" className='inset-4 absolute w-[calc(100%-32px)] trx2 rotateY aspect-[4/5] border rounded-md'  />

        </div> */}