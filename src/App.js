import './App.css'
import Play from './components/Game.js'
import Home from './components/Home.js'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/play/:gid' element={<Play/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
