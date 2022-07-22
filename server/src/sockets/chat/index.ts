import { getConnections } from "./connections/index";
import { getMessagesFromConnection, createMessage } from "./messages/index";
import { getCurrUser } from "./utils/index";
import { SOCKET_ELEMENT } from "./chat.types";

const initializeConnection = (
  socket: any,
  SOCKET_LIST: Object,
  callback: () => any
) => {
  try {
    // Initialize connections
    socket.on(
      "handshake",
      async (
        userId: {
          iv: string;
          content: string;
        },
        companyId: number,
        teamId: number
      ) => {
        const current = await getCurrUser(userId, companyId, teamId);
        if (!current) {
          socket.emit("reject", {});
          return;
        }

        if (!current.user) {
          socket.emit("reject", {});
          return;
        }

        // Save on memory
        let newEl: SOCKET_ELEMENT = {
          socket, // To communicate
          userId, // To know the user ref
          companyId, // To know on which company it is
          teamId, // To know on which team it is
          connectionId: 0 // Right now is nothing
        };

        SOCKET_LIST[socket.id] = newEl;

        socket.emit("accept", {});

        callback();
      }
    );
  } catch (error) {
    console.error(error);
  }
};

export const manageSocketChat = async (socket: any, SOCKET_LIST: Object) => {
  try {
    // Initialize
    initializeConnection(socket, SOCKET_LIST, () => {
      // Get all connections
      getConnections(SOCKET_LIST[socket.id]);

      // You enter a connection
      getMessagesFromConnection(SOCKET_LIST, SOCKET_LIST[socket.id]);
      createMessage(SOCKET_LIST, SOCKET_LIST[socket.id]);
    });

    // Disconnect
    socket.on("disconnect", function() {
      delete SOCKET_LIST[socket.id];
    });
  } catch (error) {
    console.error(error);
  }
};
