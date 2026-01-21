import { Routes, Route } from 'react-router-dom'
import { APP_NAME } from './utils/constants'
import './App.scss'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>{APP_NAME}</h1>
      </header>

      <main className="App-main">
        <Routes>
          <Route path="/" element={<div>Home - Gallery</div>} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/contact" element={<div>Contact</div>} />
          <Route path="/paintings/:id" element={<div>Painting Detail</div>} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </main>

      <footer className="App-footer">
        <p>&copy; 2024 Juliette Fitzgerald. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
