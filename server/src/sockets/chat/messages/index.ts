import { getCurrConnection } from "../utils/index";
import { SOCKET_ELEMENT } from "../chat.types";

export const getMessagesFromConnection = async (socketEl: SOCKET_ELEMENT) => {
  try {
    const { userId, companyId, teamId, socket } = socketEl;

    socket.on(
      "get-messages",
      async ({ connectionId }: { connectionId: number }) => {
        let refMessages: Array<any> = [];

        const refConnection: any = await getCurrConnection(
          userId,
          companyId,
          teamId,
          connectionId
        );

        if (refConnection) {
          refMessages = await refConnection.getMessages();
          // TODO: modify if necessary
        }

        socket.emit("send-messages", {
          messages: refMessages
        });
      }
    );
  } catch (error) {
    console.error(error);
  }
};
