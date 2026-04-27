import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Game from './components/Game/Game'
import Home from './components/Home/Home'
import { useEffect } from 'react';

function App() {
    console.log("hello");
    console.log(import.meta.env.VITE_BACKEND_URL);
    
    useEffect(() => {
        async function send_get_request() {
            let resp = await fetch(import.meta.env.VITE_BACKEND_URL);
            console.log(resp);
        }
        send_get_request()
    }, [])

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
