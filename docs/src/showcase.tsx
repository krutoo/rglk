import { createRoot } from 'react-dom/client';
import foundStories from '#found-stories';
import { filterValidStories } from '@krutoo/showcase/runtime';
import { ShowcaseApp } from '@krutoo/showcase/runtime-showcase';
import './reset.css';
import '@krutoo/showcase/showcase.css';

createRoot(document.getElementById('root')!).render(
  <ShowcaseApp
    title='rglk.js'
    stories={filterValidStories(foundStories).validStories}
    headerLinks={[
      {
        name: 'GitHub',
        href: 'https://github.com/krutoo/showcase',
      },
      {
        name: 'NPM',
        href: 'https://www.npmjs.com/package/rglk',
      },
    ]}
  />,
);
