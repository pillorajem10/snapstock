//STYLE
import styles from './index.module.css';

//REACT ROUTER DOM
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.mainName}>Softdrinks/Beer Inventory</div>
      <div className={styles.listings}><Link to = '/'>Home</Link></div>
      <div className={styles.listings}><Link to = '/viewinvt'>Products</Link></div>
      <div className={styles.listings}><Link to = '/vieworders'>Orders</Link></div>
    </div>
  )
}

export default Navbar
