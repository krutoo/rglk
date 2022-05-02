import { createRoot } from 'react-dom/client';
import { App } from './components/app';
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#main');

  if (container) {
    const root = createRoot(container);

    root.render(<App />);
  } else {
    throw Error('Container element not found');
  }
});
