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
