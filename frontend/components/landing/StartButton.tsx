import styles from './Landing.module.css';

interface StartButtonProps {
  onClick: () => void;
}

export const StartButton = ({ onClick }: StartButtonProps) => {
  return (
    <button
      className={styles.startButton}
      onClick={onClick}
    >
      Start
    </button>
  );
}; 