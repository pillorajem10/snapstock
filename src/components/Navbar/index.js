//STYLE
import styles from './index.module.css';
import Cookies from 'js-cookie';

//REACT ROUTER DOM
import { Link } from 'react-router-dom';

const Navbar = () => {
  const storedToken = Cookies.get('token');
  console.log('TOKEEEEEEEEEEEEEEEEEEN', storedToken)
  return (
    <div className={styles.navbarContainer}>
      <div className={styles.mainName}>Softdrinks/Beer Inventory</div>
      {storedToken ? (
        <>
          <div className={styles.listings}><Link to='/home'>Home</Link></div>
          <div className={styles.listings}><Link to='/viewinvt'>Products</Link></div>
          <div className={styles.listings}><Link to='/viewallorders'>All Orders</Link></div>
          <div className={styles.listings}><Link to='/deliveries'>Add Products</Link></div>
        </>
      ) : (
        null
      )}
    </div>
  );
}


export default Navbar
