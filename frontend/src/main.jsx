import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {App as AntApp} from 'antd'
import 'antd/dist/reset.css'
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AntApp>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AntApp>
    </StrictMode>,
)
