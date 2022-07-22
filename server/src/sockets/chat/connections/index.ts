import { getAllConnections } from "../utils/index";
import { SOCKET_ELEMENT } from "../chat.types";

export const getConnections = async (socketEl: SOCKET_ELEMENT) => {
  try {
    const { userId, companyId, teamId, socket } = socketEl;

    socket.on("get-connections", async () => {
      const refConnections: Array<any> = await getAllConnections(
        userId,
        companyId,
        teamId
      );

      socket.emit("send-connections", {
        connections: refConnections
      });
    });
  } catch (error) {
    console.error(error);
  }
};
