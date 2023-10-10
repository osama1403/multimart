import Hero from "./Hero";
import HorizontalScroller from "./HorizontalScroller";
import CategoriesSection from "./CategoriesSection";

const Home = () => {
  
  return (
    <>
    <Hero />
    <HorizontalScroller category={'Automotive'}/>
    <CategoriesSection />
    <HorizontalScroller category={'Others'}/>
    <HorizontalScroller category = {'Apparel and Fashion'}/>
    
    {/* <SearchBar /> */}
    </>
  );
}
 
export default Home;