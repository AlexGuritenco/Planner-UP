import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {AuthProvider} from './AuthContext'
import {App as AntApp} from 'antd'
import 'antd/dist/reset.css'
import App from './App'

//  Argument of type HTMLElement | null is not assignable to parameter of type Container
// therefore check for null
const RootElement = document.getElementById('root')

if (RootElement === null || !RootElement) {
    throw new Error('Root element with id "root" not found')
}

createRoot(RootElement).render(
    <StrictMode>
        <AntApp>
            <BrowserRouter>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </BrowserRouter>
        </AntApp>
    </StrictMode>,
)
