import styles from "./Product.module.scss";
import stylesLanding from "../Landing.module.scss";
import { useRef } from "react";

// Hooks
import {
  useAnimationsScroll,
  ArrayElement
} from "../../../hooks/useAnimationsScroll";

// Svgs
import DriveSvg from "../../Svgs/Drive";
import ChatSvg from "../../Svgs/Chat";
import CalendarSvg from "../../Svgs/Calendar";

type Props = {
  title: string;
  children?: any;
  Icon: any;
  _ref: any;
};

const ProductCard = ({ title, children, Icon, _ref }: Props) => {
  return (
    <div title={`Go to ${title}`} ref={_ref} className={styles.product_card}>
      <div className={styles.product_card_svg}>
        <Icon />
      </div>
      <div className={styles.product_card_title}>{title}</div>
      <div className={styles.product_card_children}>{children}</div>
    </div>
  );
};

const Product = () => {
  // Animations on scroll
  const h1 = useRef<any>(null);
  const card1 = useRef<any>(null);
  const card2 = useRef<any>(null);
  const card3 = useRef<any>(null);

  const animClass = (
    elem: any,
    percentage: number,
    customClass: string = styles.product_card_animation
  ): ArrayElement => {
    return {
      notAppearClass: customClass,
      screenPercentage: percentage,
      element: elem
    };
  };

  useAnimationsScroll({
    componentsList: [
      animClass(h1, 0.5, styles.product_h1_animation),
      animClass(card1, 0.35),
      animClass(card2, 0.35),
      animClass(card3, 0.35)
    ]
  });

  return (
    <section className={`${styles.product} ${stylesLanding.section}`}>
      <h2 className={styles.product_h1} ref={h1}>
        What is Teamplace?
      </h2>
      <div className={styles.product_cards}>
        <ProductCard _ref={card1} title="Custom Chats" Icon={ChatSvg}>
          We offer a custom chat for each team in a company to stay connected at
          any time.
        </ProductCard>
        <ProductCard _ref={card2} title="Drive Integration" Icon={DriveSvg}>
          Teamplace has its own Drive implementation to stablish a work
          communication between the company and its clients.
        </ProductCard>
        <ProductCard _ref={card3} title="Calendar Tool" Icon={CalendarSvg}>
          Our calendar offers the option to connect people and tasks in each
          working environment.
        </ProductCard>
      </div>
    </section>
  );
};

export default Product;
