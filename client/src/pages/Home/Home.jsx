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
    <HorizontalScroller />
    
    {/* <SearchBar /> */}
    </>
  );
}
 
export default Home;