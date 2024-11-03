import { ReactNode } from 'react';
import styles from './section.module.css';

export function Section({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
