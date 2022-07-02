import styles from './LandingNav.module.scss';
import Link from 'next/link';
import ColorSwitch from '../../Colors/Colors';
import BtnLink from '../../Buttons/BtnLink/BtnLink';

const LandingNav = () => {
    return (
        <nav className={styles.nav}>
            <div className={styles.nav_links}>
                <Link href='/'>
                    HOME
                </Link>
                <Link href='/#about-us' scroll={false}>
                    ABOUT US
                </Link>
            </div>
            <div className={styles.nav_btns}>
                <ColorSwitch />
                <BtnLink
                    additionalClass='log-in'
                    text='Log in'
                    url='/'
                    color='lavender-200'
                    border='complete_rounded'
                    title='Go to Log In'
                />
            </div>
        </nav>
    )
};

export default LandingNav;