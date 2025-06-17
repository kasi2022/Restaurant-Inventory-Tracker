import { Routes, Route } from 'react-router-dom';
import SignInSide from './sign-in-side/SignInSide.js'
import Dashboard from './dashboard/Dashboard.tsx'
import AddProduct from './pages/addproduct.js';
import SignIn from './sign-in/SignIn.js';
import ConsumerPage from './pages/ConsemuerScreen.js';
function AppMain() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignInSide />} />
        <Route path="/dashbord" element={<Dashboard />} />
        <Route path="/add-products" element={<AddProduct />} />
        <Route path="/register" element={<SignIn />} />
        <Route path="/consumerpage" element={<ConsumerPage />} />
      </Routes>

    </div>
  );
}

export default AppMain;
