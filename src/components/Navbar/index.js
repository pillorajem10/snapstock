//STYLE
import styles from './index.module.css';
import Cookies from 'js-cookie';

//REACT ROUTER DOM
import { Link } from 'react-router-dom';

//redux
import { useDispatch } from 'react-redux';
import { jkai } from '../../redux/combineActions';

const Navbar = () => {
  const storedToken = Cookies.get('token');
  console.log('TOKEEEEEEEEEEEEEEEEEEN', storedToken);

  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(jkai.user.userLogout())
  };

  return (
    <div className={styles.navbarContainer}>
      {storedToken ? (
        <>
          <Link to='/home'>
            <div className={styles.mainName}>Softdrinks/Beer Inventory</div>
          </Link>
          <div className={styles.listings}><Link to='/viewinvt'>Products</Link></div>
          <div className={styles.listings}><Link to='/viewallorders'>All Orders</Link></div>
          <div className={styles.listings}><Link to='/deliveries'>Add Products</Link></div>
          <div className={styles.listings} onClick={handleSignOut}><Link>Sign Out</Link></div>
        </>
      ) : (
        <Link to='/'>
          <div className={styles.mainName}>Softdrinks/Beer Inventory</div>
        </Link>
      )}
    </div>
  );
}


export default Navbar
