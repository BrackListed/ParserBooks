import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Feed } from "./pages/Feed";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<Feed/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}