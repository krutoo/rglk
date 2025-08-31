import { createRoot } from 'react-dom/client';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { SandboxApp } from '@krutoo/showcase/runtime-sandbox';
import foundStories from '#found-stories';
import './reset.css';

createRoot(document.getElementById('root')!).render(
  <SandboxApp stories={filterValidStories(foundStories).validStories} />,
);
