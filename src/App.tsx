import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Game from './components/Game/Game'
import Home from './components/Home/Home'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/game/:gid' element={<Game />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
