import { User } from "../../../models/User";
import crypto from "crypto";

export const getCurrUser = async (
  userId: {
    iv: string;
    content: string;
  },
  companyId: number,
  teamId: number
): Promise<
  | {
      user: any;
      team: any;
    }
  | undefined
> => {
  try {
    if (isNaN(companyId) || isNaN(teamId)) return undefined;

    if (!userId) return undefined;

    // Decrypt hash
    const algorithm = "aes-256-ctr";
    let key = crypto
      .createHash("sha256")
      .update(String(process.env.JWT_SECRET))
      .digest("base64")
      .substr(0, 32);
    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(userId.iv, "hex")
    );

    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(userId.content, "hex")),
      decipher.final()
    ]);

    const refUserId = decrpyted.toString();

    const refUser: any = await User.findByPk(parseInt(refUserId));
    if (!refUser) return undefined;

    const teams: Array<any> = await refUser.getTeams({
      where: {
        id: teamId,
        companyId
      }
    });

    if (teams.length == 0) return undefined;

    return {
      user: refUser,
      team: teams[0]
    };
  } catch (error) {
    console.error(error);
  }
};

export const getCurrConnection = async (
  userId: {
    iv: string;
    content: string;
  },
  companyId: number,
  teamId: number,
  connectionId: number
): Promise<any> => {
  try {
    if (isNaN(connectionId)) return undefined;

    const refUser = await getCurrUser(userId, companyId, teamId);

    if (!refUser) return undefined;

    const refConnections: Array<any> = await refUser.user.getConnections({
      where: {
        id: connectionId
      }
    });

    if (refConnections.length == 0) {
      return undefined;
    }

    return refConnections[0];
  } catch (error) {
    console.error(error);
  }
};

export const getAllConnections = async (
  userId: {
    iv: string;
    content: string;
  },
  companyId: number,
  teamId: number
): Promise<any> => {
  try {
    const current = await getCurrUser(userId, companyId, teamId);
    if (!current) return undefined;

    if (!current.team || !current.user) return undefined;

    const allConnections: Array<any> = await current.team.getConnections();
    let connections: Array<any> = [];
    for (let i = 0; i < allConnections.length; i++) {
      const refUsers: Array<any> = await allConnections[i].getUsers();
      let allUsers: Array<any> = [];
      for (let j = 0; j < refUsers.length; j++) {
        const refUser: any = refUsers[j];
        const { password, ...dataUser } = refUser.toJSON();
        const refCompanies: Array<any> = await refUser.getCompanies({
          where: {
            id: companyId
          }
        });
        const refTeams: Array<any> = await refUser.getTeams({
          where: {
            id: teamId
          }
        });

        const {
          accessCodeClient,
          accessCodeEmployee,
          ...dataCompany
        } = refCompanies[0].toJSON();
        const { accessCode, ...datateam } = refTeams[0].toJSON();

        allUsers.push({
          user: dataUser,
          company: refCompanies.length > 0 ? dataCompany : {},
          team: refTeams.length > 0 ? datateam : {}
        });
      }
      let arrayMsgsCurrUser: Array<any> = await current.user.getMessages();
      const totalMsgsConnection: number = await allConnections[
        i
      ].countMessages();
      let totalReadMsgs: number = 0;
      for (let j = 0; j < arrayMsgsCurrUser.length; j++) {
        const msgReadUser: any = arrayMsgsCurrUser[j];

        // Check if this msgReadUser is from this connection
        if (msgReadUser.connectionId == allConnections[i].id) {
          totalReadMsgs += 1;
        }
      }


      connections.push({
        users: allUsers,
        connection: allConnections[i],
        totalUnread: totalMsgsConnection - totalReadMsgs
      });
    }

    return connections;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
