import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Play from './components/Play/Play'
import Home from './components/Home'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/play/:gid' element={<Play />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
