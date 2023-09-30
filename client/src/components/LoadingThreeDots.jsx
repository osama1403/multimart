import { BsThreeDots } from 'react-icons/bs'

const LoadingThreeDots = () => {
  return (
    <div className='flex w-full h-[calc(100vh-64px)] justify-center items-center'>
      <BsThreeDots className='text-6xl text-primary' />
    </div>
  );
}

export default LoadingThreeDots;