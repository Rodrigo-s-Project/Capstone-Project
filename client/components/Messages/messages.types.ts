export type USER_CONNECTION = {
  company: {
    id: number;
    name: string;
    adminId: number;
    companyPictureURL: string | null;
    storage: number;
    typeCompany: string;
    User_Company: {
      companyId: number;
      typeAccount: string;
      typeUser: string;
      userId: number;
      username: string;
    };
  };
  team: {
    companyId: number;
    id: number;
    name: string;
    teamPictureURL: string | null;
    User_Team: {
      teamId: number;
      userId: number;
      username: string;
    };
  };
  user: {
    email: string;
    globalUsername: string;
    id: number;
    isDarkModeOn: boolean;
    profilePictureURL: string | null;
    status: string;
    User_Connections: {
      connectionId: number;
      userId: number;
    };
  };
  createdAt?: Date;
};

export type CONNECTION = {
  connection: {
    id: number;
    name: string;
    teamId: number;
  };
  users: Array<USER_CONNECTION>;
  totalUnread: number;
};

export type MESSAGE = {
  users: Array<USER_CONNECTION>;
  message: {
    id: number;
    text: string;
    mediaURL: string | null;
    lat: number;
    lng: number;
    connectionId: number;
    createdAt: Date;
    ownerId: number;
    language: string | undefined
  };
};
