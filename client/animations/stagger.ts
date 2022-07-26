export const containerVariants = {
  hidden: {
    opacity: 1
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.1,
      staggerChildren: 0.1,
      when: "beforeChildren"
    }
  }
};
export const elementVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200 }
  }
};
export const ownStaggerVariants = (delay: number) => {
  return {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.85
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 0.85,
      transition: { delay, duration: 0.3 }
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.85,
      transition: { delay, duration: 0.3 }
    }
  };
};
