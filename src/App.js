import './App.css'
import Game from './components/Game.js'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/game/:gid' element={<Game/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
