import { FaFacebook, FaInstagram,FaXTwitter  } from 'react-icons/fa6'
import { ReactComponent as Logo } from '../../assets/logo.svg'
const AboutUs = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] py-10 flex items-center justify-center">
      <div className="w-full p-4 max-w-2xl rounded-lg border">
        <Logo className="w-full h-fit p-4 max-w-[220px] mx-auto " />
        <p className='text-lg py-2'>
          Welcome to MultiMart,the ultimate multivendor e-commerce platform where buyers and sellers unite. Our platform provides a seamless marketplace for sellers to showcase and sell their goods while offering buyers a diverse range of products.
        </p>
        <p className='text-lg py-2'>
          At MultiMart, we are committed to revolutionizing online commerce. We provide sellers with a user-friendly platform to easily sell their goods to a global customer base. Buyers can explore a wide range of categories, from fashion to electronics, all in one place.
        </p>
        <p className='text-lg py-2'>
          With verified sellers and secure payment options, MultiMart ensures a safe and convenient shopping experience. Our dedicated customer support team is available to assist with any inquiries or concerns.
        </p>
        <p className='text-lg py-2'>
          Join MultiMart today and experience the future of e-commerce. Connect with like-minded individuals, discover unique products, and be part of a community that fosters growth and entrepreneurship. Together, let's reshape online commerce with MultiMart.
        </p>

        <div className='flex items-center flex-wrap gap-3 w-fit mt-4 text-lg '>
          <p>Follow us on:</p>
          <div className='flex items-center text-primary space-x-6'>
            <a href="#" className='block'><FaFacebook className=' inline text-3xl hover:text-blue-500' /></a>
            <a href="#" className='block'><FaInstagram className=' inline text-3xl hover:text-pink-600' /></a>
            <a href="#" className='block'><FaXTwitter className=' inline text-3xl hover:text-black' /></a>
          </div>
        </div>


      </div>
    </div>
  );
}

export default AboutUs;