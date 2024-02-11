import Hero from "./Hero";
import HorizontalScroller from "./HorizontalScroller";
import CategoriesSection from "./CategoriesSection";
import Categories from "../../Categories";

const Home = () => {
  
  return (
    <>
    <Hero />
    <CategoriesSection />
    <HorizontalScroller category={Categories[2].name}/>
    <HorizontalScroller category = {Categories[1].name}/>
    <HorizontalScroller category={Categories[0].name}/>
    
    {/* <SearchBar /> */}
    </>
  );
}
 
export default Home;