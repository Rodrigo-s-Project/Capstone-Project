import { getCurrConnection, getCurrUser } from "../utils/index";
import { SOCKET_ELEMENT } from "../chat.types";
import { Message } from "../../../models/Message";
import { addReadToTheseMessages } from "../utils/users";
import {
  getAllMessagesWithUsers,
  sendMessagesToEveryone
} from "../utils/messages";

export const getMessagesFromConnection = async (
  SOCKET_LIST: Object,
  socketEl: SOCKET_ELEMENT
) => {
  try {
    const { userId, companyId, teamId, socket } = socketEl;

    socket.on("get-messages", async (connectionId: number) => {
      let refMessages: Array<any> = [];

      const refConnection: any = await getCurrConnection(
        userId,
        companyId,
        teamId,
        connectionId
      );

      if (refConnection) {
        refMessages = await refConnection.getMessages();

        // Update read
        await addReadToTheseMessages(userId, companyId, teamId, refMessages);

        refMessages = await getAllMessagesWithUsers(
          refConnection,
          companyId,
          teamId
        );
      }

      // Add connectionId
      SOCKET_LIST[socketEl.socket.id] = {
        ...SOCKET_LIST[socketEl.socket.id],
        connectionId
      };

      // Send updated msgs to everybody
      await sendMessagesToEveryone(
        SOCKET_LIST,
        connectionId,
        companyId,
        teamId,
        refMessages,
        refConnection
      );
    });
  } catch (error) {
    console.error(error);
  }
};

export const createMessage = async (
  SOCKET_LIST: Object,
  socketEl: SOCKET_ELEMENT
) => {
  try {
    const { userId, companyId, teamId, socket } = socketEl;

    socket.on("create-message", async (...allMyParams) => {
      const [connectionId, text, mediaURL, lat, lng] = allMyParams;

      const refConnection: any = await getCurrConnection(
        userId,
        companyId,
        teamId,
        connectionId
      );

      const currState = await getCurrUser(userId, companyId, teamId);
      let refMessages: Array<any> = [];

      if (currState && refConnection && currState.user) {
        // Check that at least it has something
        if (
          (text && text.trim() != "") ||
          mediaURL ||
          (!isNaN(lat) && !isNaN(lng))
        ) {
          // At least one passes
          const newMsg: any = await Message.create({
            text,
            mediaURL,
            lat,
            lng,
            ownerId: currState.user.id
          });

          // make association with connection
          await refConnection.addMessage(newMsg);

          // Add read
          if (!(await currState.user.hasMessage(newMsg))) {
            await currState.user.addMessage(newMsg);
          }

          refMessages = await refConnection.getMessages();
        }
      }

      // Send msgs to everybody
      await sendMessagesToEveryone(
        SOCKET_LIST,
        connectionId,
        companyId,
        teamId,
        refMessages,
        refConnection
      );
    });
  } catch (error) {
    console.error(error);
  }
};
