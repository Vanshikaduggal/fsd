import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Basic from './Basic'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Basic/>
  </StrictMode>,
)
