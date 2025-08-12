import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin/Admin";
import Login from "./Login/Login";
import Lead from "./pages/lead/Lead";
import Offerlatter from "./pages/latters/Offerlatter";
import Relievinglatter from "./pages/latters/Relievinglatter";
import SalarySlip from "./pages/latters/SalarySlip";
import AllotmentLatter from "./pages/latters/AllotmentLatter";
import LatterHead from "./pages/latters/LatterHead";
import Latter from "./pages/latters/Latter";
import DemandLetter from "./pages/latters/Demandlatter";
import Material from "./pages/material/Material";
import Addmeterial from "./pages/material/Addmeterial";
import Customer from "./pages/customer/Customer";
import AddCustomer from "./pages/customer/AddCustomer";
import Flat from "./pages/addflat/AddFlats";
import FlatList from "./pages/addflat/FlatList";
import EditLead from "./pages/lead/EditLead";
import Flatowner from "./pages/addflat/Flatowner";
import AddLead from "./pages/lead/AddLead";
import AddLand from "./pages/addlands/AddLands";
import LandPurchase from "./pages/addlands/LandPurchase";
import EditLand from "./pages/addlands/EditLand";
import Home from "./pages/admin/Home";
import AppUserRegistration from "./Registration/AppUserRegistration";
import ProtectedRoute from "./ProtectedComponent/ProtectedRoute";
import Employee from "./pages/addEmployes/Employee";
import NocLetter from "./pages/latters/NocLetter";
import Possession from "./pages/latters/Possession";
import Contractor from "./pages/contractor/Contractor";
import ContractorDetail from "./pages/contractor/ContractorDetail";
import SingleVendor from "./pages/material/SingleVendor";
import EmployeeForm from "./Registration/EmployeeForm";
import Notification from "./pages/Notification/Notification";
import StockDetails from "./pages/material/StockDetails";
import Structure from "./pages/structure/Structure";
import StructureDetail from "./pages/structure/StructureDetail";
import Office from "./pages/office/Office";
import AgSalarySlip from "./pages/latters/AgSalarySlip";
import Subadmin from "./pages/addEmployes/Subadmin";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<ProtectedRoute />}>
          <Route element={<Admin />} path="/">
            <Route element={<Home />} path="" index />
            <Route element={<Lead />} path="lead" />
            <Route element={<Material />} path="material" />
            <Route element={<Addmeterial />} path="addmaterial/:id" />
            <Route element={<Customer />} path="customer" />
            <Route element={<AddCustomer />} path="clist" />
            <Route element={<Flat />} path="flat/:id" />
            <Route element={<Flat />} path="flat" />
            <Route element={<FlatList />} path="flatlist/:id" />
            <Route element={<EditLead />} path="editlead/:id" />
            <Route element={<Flatowner />} path="flatowner/:id" />
            <Route element={<AddLead />} path="addlead" />
            <Route element={<AddLand />} path="lands" />
            <Route element={<LandPurchase />} path="/landpurchase" />
            <Route element={<EditLand />} path="editland/:id" />
            <Route element={<LandPurchase />} path="/landpurchase" />
            <Route element={<Latter />} path="letter" />
            <Route element={<Offerlatter />} path="/offerlatter" />
            <Route element={<Relievinglatter />} path="/Relievinglatter" />
            <Route element={<SalarySlip />} path="/SalarySlip" />
            <Route element={<AllotmentLatter />} path="/allotment" />
            <Route element={<DemandLetter />} path="/demand" />
            <Route element={<LatterHead />} path="/letterhead" />
            <Route
              element={<AppUserRegistration />}
              path="/appuserregistration"
            />
            <Route element={<Employee />} path="/employee" />
            <Route element={<NocLetter />} path="/nocletter" />
            <Route element={<Possession />} path="/possession" />
            <Route element={<Contractor />} path="/contractor" />
            <Route
              element={<ContractorDetail />}
              path="/contractordetail/:id"
            />
            <Route
              path="/singleVendor/:projectId/:vendorId"
              element={<SingleVendor />}
            />
            <Route path="/employeregistration" element={<EmployeeForm />} />
            <Route element={<Notification />} path="/notification" />
            <Route element={<StockDetails />} path="/StockDetails/:id/:name" />
            <Route element={<Structure />} path="/structure" />
            <Route
              element={<StructureDetail />}
              path="/structureDetail/:id/:name"
            />
            <Route path="/office" element={<Office />} />
            <Route path="/AgsalarySlip" element={<AgSalarySlip />} />
            <Route path="/Subadmin" element={<Subadmin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
