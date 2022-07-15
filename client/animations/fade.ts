export const fadeVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      delay: 0
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      delay: 0
    }
  }
};

export const fadeVariantsLongerExit = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      delay: 0
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 1,
      ease: "easeInOut",
      delay: 0
    }
  }
};

export const fadeVariantsDelayExit = {
  hidden: {
    opacity: 1
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeInOut",
      delay: 0
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      delay: 0
    }
  }
};
