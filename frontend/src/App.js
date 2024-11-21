import React from 'react'
import{Route,BrowserRouter,Routes} from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Header from './components/Header'
const App = () => {
  return (
    <div>
      <BrowserRouter>
          <Header/>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
