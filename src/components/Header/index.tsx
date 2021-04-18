import { ActiveLink } from '../ActiveLink';

import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="Logo ig.news"/>
        <ActiveLink href="/" activeClassName={styles.active}>
          <a>Home</a>
        </ActiveLink>
        <ActiveLink href="/posts" activeClassName={styles.active}>
          <a>Posts</a>
        </ActiveLink>
      </div>
    </header>
  )
}