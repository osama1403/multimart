import prodPlaceholder from '../../assets/images/prodPlaceholder.jpg'
const OrderProductItem = ({ product, customizations }) => {
  const serverUrl = process.env.REACT_APP_URL
  console.log(product);
  return (
    <div className='w-full flex flex-col sm:flex-row gap-3 py-4 max-w-2xl '>

      <div className='grow flex flex-nowrap  gap-4 items-center  font-semibold font-nunito'>
        <img src={product.images[0] ? serverUrl + '/' + product.images[0] : prodPlaceholder} alt="" className='w-28 object-cover shadow-zinc-400 shadow-md aspect-[5/5] rounded-md' />

        <div className=' flex flex-col py-4 items-start self-stretch min-w-[200px]' >
          <h2 className='font-semibold text-lg'>{product.name}</h2>
          <div className='my-auto grow flex flex-col justify-center'>
            {
              product.customizations.map((el, idx) => {
                return <p className=''><span className='text-zinc-600'>{el.name}:</span> {customizations[el.name]}</p>
              })
            }
          </div>
        </div>
      </div>

      <div className='grow w-fit sm:w-auto flex justify-between gap-4'>
        <p className=''>${(product.price / 100).toFixed(2)}</p>
        <p className=''>#2</p>
        <p>$-</p>
      </div>

    </div>
  );
}

export default OrderProductItem;