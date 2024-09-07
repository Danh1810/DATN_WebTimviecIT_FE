import "./App";
import Components from "./components"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FloatButton } from "antd";

function App() {
  return (
    <div className="">
      <Components />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <FloatButton.BackTop style={{ right: 96 }} />
    </div>
  );
}

export default App;
