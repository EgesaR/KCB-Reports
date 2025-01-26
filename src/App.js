import { BrowserRouter as Router, Routes, Route } from "react-router"

/*-----Pages-----*/
//Portfolio
import Home from "./pages/_index"
import Pricing from "./pages/portfolio/Pricing"
import About from "./pages/portfolio/About"

//Auth
import Login from "./pages/_auth/login/route"
import Signup from "./pages/_auth/signup/route"


//Blockers
import WatchBoard from "./pages/blockers/WatchBoard"

/*-----App-----*/
import Dashboard from "./pages/app/route"


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/auth/Login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/blockers/watch" element={<WatchBoard />} />
      </Routes>
    </Router>
  )
}

export default App