import { SectionDungeon } from '../dungeon';
import { SectionLabyrinth } from '../labyrinth';
import { SectionFOV } from '../fov';
import styles from './app.module.css';
import { SectionPathfinder } from '../pathfinder';

export function App() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <h1 className={styles.title}>rglk.js</h1>
          <p>
            Simple library for development roguelike games. <br /> Check API on{' '}
            <a href="https://github.com/krutoo/rglk">GitHub</a>.
          </p>
        </header>

        <SectionDungeon />
        <SectionLabyrinth />
        <SectionFOV />
        <SectionPathfinder />

        <footer className={styles.footer}>(c) Dmitry Petrov</footer>
      </div>
    </div>
  );
}
