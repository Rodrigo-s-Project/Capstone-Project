import { sequelize } from "../database/database";
import { DataType } from "sequelize-typescript";

// Models
import { Bucket } from "../models/Bucket";
import { Calendar } from "../models/Calendar";
import { Company } from "../models/Company";
import { Connection } from "../models/Connection";
import { File } from "../models/File";
import { Folder } from "../models/Folder";
import { Message } from "../models/Message";
import { Notification } from "../models/Notification";
import { Payment } from "../models/Payment";
import { Tag } from "../models/Tag";
import { Task } from "../models/Task";
import { Team } from "../models/Team";
import { User } from "../models/User";

export const setAssociations = () => {
  // ------------------------------ Bucket
  // (Bucket) 1:Many (File)
  Bucket.hasMany(File);
  File.belongsTo(Bucket);

  // (Bucket) 1:Many (Folder)
  Bucket.hasMany(Folder);
  Folder.belongsTo(Bucket);

  // ------------------------------ Calendar
  // (Calendar) 1:Many (Tag)
  Calendar.hasMany(Tag);
  Tag.belongsTo(Calendar);

  // (Calendar) 1:Many (Task)
  Calendar.hasMany(Task);
  Task.belongsTo(Calendar);

  // ------------------------------ Company
  // (Company) 1:Many (Team)
  Company.hasMany(Team);
  Team.belongsTo(Company);

  // ------------------------------ Connection
  // (Connection) 1:Many (Message)
  Connection.hasMany(Message);
  Message.belongsTo(Connection);

  // ------------------------------ Folder
  // (Folder) 1:Many (File)
  Folder.hasMany(File);
  File.belongsTo(Folder);

  // (Folder) 1:Many (Folder)
  Folder.hasMany(Folder);
  Folder.belongsTo(Folder);

  // ------------------------------ Notification
  // (Notification) Many:Many (Message)
  Notification.belongsToMany(Message, {
    through: "Notification_Unread_Messages"
  });
  Message.belongsToMany(Notification, {
    through: "Notification_Unread_Messages"
  });

  // (Notification) Many:Many (File)
  Notification.belongsToMany(File, { through: "Notification_Unread_Files" });
  File.belongsToMany(Notification, { through: "Notification_Unread_Files" });

  // (Notification) Many:Many (Task)
  Notification.belongsToMany(Task, { through: "Notification_Unread_Tasks" });
  Task.belongsToMany(Notification, { through: "Notification_Unread_Tasks" });

  // ------------------------------ Task
  // (Task) 1:Many (Tag)
  Task.hasMany(Tag);
  Tag.belongsTo(Task);

  // ------------------------------ Team
  // (Team) 1:1 (Calendar)
  Team.hasOne(Calendar);
  Calendar.belongsTo(Team);

  // (Team) 1:Many (Bucket)
  Team.hasMany(Bucket);
  Bucket.belongsTo(Team);

  // (Team) 1:Many (Connection)
  Team.hasMany(Connection);
  Connection.belongsTo(Team);

  // ------------------------------ User
  // (User) Many:Many (Company)
  const User_Company = sequelize.define(
    "User_Company",
    {
      typeUser: DataType.STRING,
      username: DataType.STRING
    },
    { timestamps: false }
  );
  User.belongsToMany(Company, { through: User_Company });
  Company.belongsToMany(User, { through: User_Company });

  // (User) Many:Many (Team)
  const User_Team = sequelize.define(
    "User_Team",
    {
      typeUser: DataType.STRING
    },
    { timestamps: false }
  );
  User.belongsToMany(Team, { through: User_Team });
  Team.belongsToMany(User, { through: User_Team });

  // (User) 1:Many (Company)
  User.hasMany(Company, {
    foreignKey: "adminId"
  });
  Company.belongsTo(User, { foreignKey: "adminId" });

  // (User) Many:Many (Bucket)
  User.belongsToMany(Bucket, { through: "User_Buckets" });
  Bucket.belongsToMany(User, { through: "User_Buckets" });

  // (User) Many:Many (Connection)
  User.belongsToMany(Connection, { through: "User_Connections" });
  Connection.belongsToMany(User, { through: "User_Connections" });

  // (User) Many:Many (File)
  User.belongsToMany(File, { through: "User_Read_Files" });
  File.belongsToMany(User, { through: "User_Read_Files" });

  // (User) Many:Many (Message)
  User.belongsToMany(Message, { through: "User_Read_Messages" });
  Message.belongsToMany(User, { through: "User_Read_Messages" });

  // (User) 1:1 (Notification)
  User.hasOne(Notification);
  Notification.belongsTo(User);

  // (User) 1:1 (Payment)
  User.hasOne(Payment);
  Payment.belongsTo(User);

  // (User) Many:Many (Task)
  User.belongsToMany(Task, { through: "User_Tasks" });
  Task.belongsToMany(User, { through: "User_Tasks" });
};
