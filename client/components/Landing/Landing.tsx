import styles from './Landing.module.scss';

const LandingPage = () => {
    return (
        <section className={styles.landing}>
            <a rel="noreferrer" title="Open in Github" href="https://github.com/Rodrigo-s-Project" target="_blank">
                <span>Teamplace</span> is coming...
            </a>
        </section>
    );
};

export default LandingPage;