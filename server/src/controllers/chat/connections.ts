import { RESPONSE } from "../controllers.types";
import {
  BODY_CREATE_CONNECTION,
  BODY_EDIT_CONNECTION,
  BODY_DELETE_CONNECTION,
  BODY_ADD_REMOVE_USER_CONNECTION
} from "./chat.types";
import { Connection } from "../../models/Connection";
import { User } from "../../models/User";

export const createConnection = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    // Body
    const { name, companyId, teamId }: BODY_CREATE_CONNECTION = req.body;

    if (isNaN(teamId) || isNaN(companyId)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    if (name.trim() == "") {
      response.message = "Invalid name.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId: companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companies: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companies.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const team: any = teams[0];
    const company: any = companies[0];

    if (company.User_Company.typeUser == "Client") {
      response.message = "You don't have permission.";
      res.json(response);
      return;
    }

    const allConnectionsWithSameName: Array<any> = await team.getConnections({
      where: {
        name
      }
    });

    if (allConnectionsWithSameName.length > 0) {
      response.message = "The name is repeated.";
      res.json(response);
      return;
    }

    // Create it
    const newConnection: any = await Connection.create({
      name
    });

    // Associations
    // Add team
    await team.addConnection(newConnection);

    // Add curr user
    await req.user.addConnection(newConnection);

    response.message = "Successful group creation!";
    response.readMsg = true;
    response.typeMsg = "success";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const editConnection = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    // Body
    const {
      name,
      companyId,
      teamId,
      connectionId
    }: BODY_EDIT_CONNECTION = req.body;

    if (isNaN(teamId) || isNaN(companyId) || isNaN(connectionId)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    if (name.trim() == "") {
      response.message = "Invalid name.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId: companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companies: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companies.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const team: any = teams[0];
    const company: any = companies[0];

    if (company.User_Company.typeUser == "Client") {
      response.message = "You don't have permission.";
      res.json(response);
      return;
    }

    const allConnectionsWithSameName: Array<any> = await team.getConnections({
      where: {
        name
      }
    });

    if (allConnectionsWithSameName.length > 0) {
      response.message = "The name is repeated.";
      res.json(response);
      return;
    }

    // Edit it
    const refConnection: any = await Connection.findByPk(connectionId);

    if (!refConnection) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    await refConnection.update({
      name
    });

    response.message = "";
    response.readMsg = false;
    response.typeMsg = "success";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const deleteConnection = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    // Body
    const {
      companyId,
      teamId,
      connectionId
    }: BODY_DELETE_CONNECTION = req.body;

    if (isNaN(teamId) || isNaN(companyId) || isNaN(connectionId)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId: companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companies: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companies.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const team: any = teams[0];
    const company: any = companies[0];

    if (company.User_Company.typeUser == "Client") {
      response.message = "You don't have permission.";
      res.json(response);
      return;
    }

    // Delete it
    const refConnection: any = await Connection.findByPk(connectionId);

    if (!refConnection) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    // Unassociate
    await team.removeConnection(refConnection);

    await refConnection.removeUsers();

    const allMsgs: Array<any> = await refConnection.getMessages();

    // Loop msgs
    for (let i = 0; i < allMsgs.length; i++) {
      await allMsgs[i].destroy();
    }

    await refConnection.setMessages([]);

    // Destroy
    await refConnection.destroy();

    response.message = "Group deleted successfully!";
    response.readMsg = true;
    response.typeMsg = "success";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const addRemoveUserConnection = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    // Body
    const {
      companyId,
      teamId,
      connectionId,
      userId
    }: BODY_ADD_REMOVE_USER_CONNECTION = req.body;

    if (
      isNaN(teamId) ||
      isNaN(companyId) ||
      isNaN(connectionId) ||
      isNaN(userId)
    ) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId: companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const companies: Array<any> = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companies.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const team: any = teams[0];
    const company: any = companies[0];

    if (company.User_Company.typeUser == "Client") {
      response.message = "You don't have permission.";
      res.json(response);
      return;
    }

    // get refs
    const refConnection: any = await Connection.findByPk(connectionId);
    const refUser: any = await User.findByPk(userId);

    if (!refUser || !refConnection) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const isAlreadyIn: boolean = await refUser.hasConnection(refConnection);
    if (isAlreadyIn) {
      // Unassociate
      const userMsgs: Array<any> = await refUser.getMessages({
        where: {
          connectionId
        }
      });

      for (let i = 0; i < userMsgs.length; i++) {
        await userMsgs[i].removeUser(refUser);
      }

      await refUser.removeConnection(refConnection);
    } else {
      // Associate
      await refUser.addConnection(refConnection);
    }

    response.message = "";
    response.readMsg = false;
    response.typeMsg = "success";
    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = false;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};
