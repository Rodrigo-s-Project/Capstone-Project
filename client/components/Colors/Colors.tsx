import styles from './Colors.module.scss';

import { useContext } from 'react';

import { GlobalContext } from '../../pages/_app';

const Colors = () => {

  const { isDarkMode, setIsDarkMode } = useContext(GlobalContext);

  const handleColorChange = () => {
    if (setIsDarkMode) setIsDarkMode(prev => !prev);
    // changeVarsInCSS();
  };

  // const changeVarsInCSS = () => {
  //   // TODO
  // };

  return (
    <div className={styles.color}>
      <div onClick={handleColorChange} className={styles.color_pill} title='Toggle mode'>
        <div className={`${styles.color_pill_circle} ${isDarkMode ? styles.dark : styles.light}`}>
        </div>
      </div>
      <div className={styles.color_text}>
        {isDarkMode && 'Dark mode'}
        {!isDarkMode && 'Light mode'}
      </div>
    </div>
  )
};

export default Colors;