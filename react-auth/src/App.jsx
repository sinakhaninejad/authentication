import Signup from "./Signup";
import Signin from "./Signin";
import Home from "./Home";

import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/auth">
          <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="signin" element={<Signin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
