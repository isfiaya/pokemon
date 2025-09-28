import { Outlet } from 'react-router-dom';
import './Layout.css';

export const Layout = () => {
  return (
    <div className='layout'>
      <header className='header'>
        <h1 className='header-title'>Pokemon Explorer</h1>
        <p className='header-subtitle'>
          Discover and explore Pokemon from the PokeAPI
        </p>
      </header>
      <main className='main-content'>
        <Outlet />
      </main>
      <footer className='footer'>
        <p>
          Powered by{' '}
          <a
            href='https://pokeapi.co'
            target='_blank'
            rel='noopener noreferrer'
          >
            PokeAPI
          </a>
        </p>
      </footer>
    </div>
  );
};
