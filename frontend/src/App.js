import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import CreateStory from './pages/CreateStory';
import ViewStory from './pages/ViewStory';
import MyStories from './pages/MyStories';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateStory />} />
            <Route path="/stories" element={<MyStories />} />
            <Route path="/story/:id" element={<ViewStory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 