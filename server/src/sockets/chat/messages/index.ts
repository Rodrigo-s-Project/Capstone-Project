import {
  getCurrConnection,
  getCurrUser,
  getAllConnections
} from "../utils/index";
import { SOCKET_ELEMENT } from "../chat.types";
import { Message } from "../../../models/Message";
import { isUserOnConnection, addReadToTheseMessages } from "../utils/users";

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

        refMessages = await refConnection.getMessages();
        // TODO: modify if necessary
      }

      // Add connectionId
      SOCKET_LIST[socketEl.socket.id] = {
        ...SOCKET_LIST[socketEl.socket.id],
        connectionId
      };

      socket.emit("send-messages", {
        messages: refMessages
      });
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
          // TODO: modify if necessary
        }
      }

      // Send message to everyone in same connection
      for (let i = 0; i < Object.keys(SOCKET_LIST).length; i++) {
        const element: SOCKET_ELEMENT =
          SOCKET_LIST[Object.keys(SOCKET_LIST)[i]];
        if (element.connectionId != 0 && element.connectionId == connectionId) {
          // Update read
          await addReadToTheseMessages(
            element.userId,
            companyId,
            teamId,
            refMessages
          );

          // Get ref
          refMessages = await refConnection.getMessages();
          // TODO: modify if necessary

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
    });
  } catch (error) {
    console.error(error);
  }
};
