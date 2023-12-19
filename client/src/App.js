import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home";
import Layout from "./Layouts/Layout";
import Login from "./pages/login/Login";
import SignUp from "./pages/signUp/SignUp";
import Products from "./pages/products/Products";
import ProductPage from "./pages/singleProduct/PorductPage";
import Cart from "./pages/cart/Cart";
import UserLayout from "./Layouts/UserLayout";
import Profile from "./pages/userProfile/Profile";
import Orders from "./pages/orders/Orders";
import Wishlist from "./pages/wishlist/Wishlist";
import OrderPage from "./pages/singleOrder/OrderPage";
import Dashboard from './pages/sellerDashboard/page'
import SellerProducts from './pages/sellerProducts/page'
import SellerAddProduct from './pages/sellerAddProduct/page'
import SellerSingleProduct from "./pages/sellerSingleProduct/Page";
import SellerLayout from "./Layouts/SellerLayout";
import SellerOrders from "./pages/sellerOrders/page";
import SellerSingleOrder from "./pages/sellerSingleOrder/page";
import SellerLogin from './pages/sellerLogin/page'
import SellerSignUp from './pages/sellerSignUp/page'
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./pages/unauthorized/Unauthorized";
import SellerPage from "./pages/sellerPage/SellerPage";
import Chat from "./pages/chat/Chat";
import SingleChat from "./pages/singleChat/SingleChat";
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PersistLogin />}>

          <Route element={<Layout />}>

            <Route element={<RequireAuth allowedRoles={['visitor']} />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="seller/login" element={<SellerLogin />} />
              <Route path="seller/signup" element={<SellerSignUp />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={['visitor', 'user']} />}>
              <Route path="/" element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductPage />} />
              <Route path="seller/:id" element={<SellerPage />} />

            </Route>

            {/* protect for normal users only */}
            <Route element={<RequireAuth allowedRoles={['user']} />}>
              <Route element={<UserLayout />}>
                <Route path="profile" element={<Profile />} />
                <Route path="cart" element={<Cart />} />
                <Route path="orders" element={<Orders />} />
                <Route path="orders/:id" element={<OrderPage />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="chat" element={<Chat />} />
                <Route path="chat/:id" element={<SingleChat />} />
              </Route>
            </Route>

          </Route>
        </Route>

        {/* protect for sellers only */}
        <Route element={<RequireAuth allowedRoles={['seller']} />}>
          <Route path="/seller" element={<SellerLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/:id" element={<SellerSingleProduct />} />
            <Route path="addproduct" element={<SellerAddProduct />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="orders/:id" element={<SellerSingleOrder />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:id" element={<SingleChat />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<></>} />
      </Routes>
    </>
  );
}

export default App;
