import { Connection } from "../../../models/Connection";
import { getCurrUser } from "./index";

export const isUserOnConnection = async (
  userId: {
    iv: string;
    content: string;
  },
  companyId: number,
  teamId: number,
  connectionId: number
): Promise<boolean> => {
  // This function helps us to know if a user is
  // on a group chat or not
  try {
    const refConnection: any = await Connection.findByPk(connectionId);
    const refUser = await getCurrUser(userId, companyId, teamId);

    if (!refUser || !refConnection) return false;

    if (!refUser.user) return false;

    return await refConnection.hasUser(refUser.user);
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const addReadToTheseMessages = async (
  userId: {
    iv: string;
    content: string;
  },
  companyId: number,
  teamId: number,
  arrayMsgs: Array<any>
): Promise<boolean> => {
  // This function helps us to add a user
  // to the joint table of "Users that have read Messages"
  // of a specific message
  try {
    const refUser = await getCurrUser(userId, companyId, teamId);
    if (!refUser) return false;

    if (!refUser.user) return false;

    for (let i = 0; i < arrayMsgs.length; i++) {
      const hasMsg: boolean = await refUser.user.hasMessage(arrayMsgs[i]);
      if (!hasMsg) {
        await refUser.user.addMessage(arrayMsgs[i]);
      }
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
