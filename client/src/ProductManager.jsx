import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AddProducts from "./AddProducts";
import EditProduct from "./EditProduct";
import Dashboard from "./Dashboard";

function ProductManager() {
    return (
        <BrowserRouter>
            <Header />
            <main className="bg-gray-100 flex flex-col pb-48">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/addproducts" element={<AddProducts />} />
                    <Route path="/editproduct/:id" element={<EditProduct />} />
                </Routes>
            </main>
            <Footer />
        </BrowserRouter>
    );
}

export default ProductManager;
