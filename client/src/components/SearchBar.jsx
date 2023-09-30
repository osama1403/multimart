import { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai'
const SearchBar = () => {
  const [search, Setsearch] = useState('');

  const handleSearch = () => {
    if (search) {
      console.log(search);
    }
  }

  return (
    <>
      {/* <div className="w-full  h-16 flex items-center justify-center border-b border-zinc-200"> */}
        <div className="w-full mx-auto h-12 max-w-lg flex items-center space-x-2 rounded-full shadow-md font-nunito text-primary text-xl overflow-hidden bg-white">
          <i onClick={handleSearch} className='h-full pl-3 pr-2 flex justify-center items-center cursor-pointer active:bg-zinc-200'>
              <AiOutlineSearch />
          </i>
          
          <input type="text" autoComplete='off' name="search" id="search" placeholder='Search items ...'
            className='grow outline-none placeholder:text-primary placeholder:opacity-50 h-full'
            onFocus={(e) => { e.target.setAttribute('placeholder', '') }}
            onBlur={(e) => { e.target.setAttribute('placeholder', 'Search items ...') }}
            onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch() } }}
            value={search} onChange={(e) => { Setsearch(e.target.value) }}
          />
        </div>
      {/* </div> */}
    </>
  );
}

export default SearchBar;