// import { store } from "@/presentation/redux/store";
import "./styles/global.scss";
import "./App.css";
import { Provider } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ranking from "./pages/Ranking";
import MyPoin from "./pages/MyPoin";
import AllPost from "./pages/AllPost";
import History from "./pages/History";

function App() {
  return (
    // <Provider store={store}>
    <div className="body-dark w-screen h-[100vh] overflow-y-scroll">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AllPost />} />,
          <Route path="/my-poin" element={<MyPoin />} />,
          <Route path="/history" element={<History />} />,
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/ranking" element={<Ranking />} />,
        </Routes>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </div>
    // </Provider>
  );
}

export default App;
