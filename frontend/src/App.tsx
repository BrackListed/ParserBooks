import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { WorkCalendar } from "./pages/WorkCalendar";
import { MaintenanceSchedule } from "./pages/MaintenanceSchedule";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<Home/>}></Route>
        <Route path = "/work-calendar" element={<WorkCalendar/>}></Route>
        <Route path = "/maintenance-schedule" element={<MaintenanceSchedule/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}