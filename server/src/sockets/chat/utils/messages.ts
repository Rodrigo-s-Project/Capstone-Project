import { SOCKET_ELEMENT } from "../chat.types";
import { addReadToTheseMessages, isUserOnConnection } from "./users";
import { getAllConnections } from "./index";

export const getAllMessagesWithUsers = async (
  refConnection: any,
  companyId,
  teamId
): Promise<Array<any>> => {
  // This function helps us to get all the messages
  // of a specific connection with the ussers
  // That had read those messages
  try {
    const allMessages: Array<any> = await refConnection.getMessages();
    let messages: Array<any> = [];

    for (let i = 0; i < allMessages.length; i++) {
      const refUsers: Array<any> = await allMessages[i].getUsers();
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
          team: refTeams.length > 0 ? datateam : {},
          createdAt: refUser.User_Read_Messages.createdAt
        });
      }

      messages.push({
        users: allUsers,
        message: allMessages[i]
      });
    }

    return messages;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const sendMessagesToEveryone = async (
  SOCKET_LIST: Object,
  connectionId: number,
  companyId: number,
  teamId: number,
  refMessages: Array<any>,
  refConnection
) => {
  // This function helps us to send the updated messages
  // to a list of specific users that are on a group
  try {
    // Send message to everyone in same connection
    for (let i = 0; i < Object.keys(SOCKET_LIST).length; i++) {
      const element: SOCKET_ELEMENT = SOCKET_LIST[Object.keys(SOCKET_LIST)[i]];
      if (element.connectionId != 0 && element.connectionId == connectionId) {
        // Update read
        await addReadToTheseMessages(
          element.userId,
          companyId,
          teamId,
          refMessages
        );

        // Get ref
        refMessages = await getAllMessagesWithUsers(
          refConnection,
          companyId,
          teamId
        );

        // Send message
        element.socket.emit("send-messages", {
          messages: refMessages
        });
      } else if (
        (await isUserOnConnection(
          element.userId,
          companyId,
          teamId,
          connectionId
        )) &&
        element.connectionId == 0
      ) {
        // It is on groups pages
        // Send update
        const refConnections: Array<any> = await getAllConnections(
          element.userId,
          companyId,
          teamId
        );

        element.socket.emit("send-connections", {
          connections: refConnections
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
};
