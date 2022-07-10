import styles from "./Task.module.scss";

export type TaskType = {
  id: number;
  name: string;
  description: string;
  fromDate: number;
  arrayPeople: Array<any>; // Temp
  arrayTags: Array<any>; // Temp
  singleDate: boolean;
  toDate: number;
};

type Props = {
  task: TaskType;
};

const Task = ({ task }: Props) => {
  return (
    <div className={styles.task} title="Open task">
      {/* {task.name} */}
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque
      accusamus nam ratione eius! Vero debitis nemo omnis doloribus, alias
      inventore. Et iure sequi est, quidem, eligendi quibusdam praesentium
      minima eveniet dignissimos, enim laborum facere! Cumque maiores ipsam est
      atque assumenda laudantium non, eveniet, dolore earum veritatis
      repellendus eos ipsa reprehenderit?
    </div>
  );
};

export default Task;
