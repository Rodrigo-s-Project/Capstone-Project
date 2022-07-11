import { RESPONSE } from "../../controllers.types";
import { Company } from "../../../models/Company";
import { Team } from "../../../models/Team";

// Types
import { BODY_CREATE, BODY_JOIN } from "./team.types";

// Models
import { User } from "../../../models/User";
import { Bucket } from "../../../models/Bucket";
import { Connection } from "../../../models/Connection";

// Utils
import { createToken } from "../../../utils/keys";
import { isNameRepeated } from "../../helpers/index";

export const getTeamsFromUser = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { companyId } = req.params;

    if (!companyId) {
      response.message = "Invalid company ID.";
      res.json(response);
      return;
    }

    if (isNaN(companyId)) {
      response.message = "Invalid company ID.";
      res.json(response);
      return;
    }

    const teams = await req.user.getTeams({
      where: {
        companyId
      }
    });

    response.data = {
      teams
    };
    response.readMsg = false;

    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = true;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const getTeamUsersFromId = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { idCompany, idTeam } = req.params;

    if (isNaN(idTeam) || isNaN(idCompany)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    // Get company
    const team = await req.user.getTeams({
      where: {
        id: idTeam,
        companyId: idCompany
      }
    });

    if (team.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    // Get all users
    const allUsers: any = await team[0].getUsers();
    let usersFromRes: any = [];

    for (let i = 0; i < allUsers.length; i++) {
      const { password: userPswd, ...userData } = allUsers[i].toJSON();
      usersFromRes.push(userData);
    }

    response.data = {
      users: usersFromRes
    };
    response.readMsg = false;

    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = true;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const getTeamFromUser = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { idCompany, idTeam } = req.params;

    if (isNaN(idTeam) || isNaN(idCompany)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const team = await req.user.getTeams({
      where: {
        id: idTeam,
        companyId: idCompany
      }
    });

    const company = await req.user.getCompanies({
      where: {
        id: team.length > 0 ? team[0].companyId : 0
      }
    });

    response.data = {
      team: team.length > 0 ? team[0] : {},
      company: company.length > 0 ? company[0] : {}
    };
    response.readMsg = false;

    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = true;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const createTeam = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { name, companyId }: BODY_CREATE = req.body;

    if (name.trim() == "" || companyId.toString().trim() == "") {
      response.message = "Invalid information.";
      res.json(response);
      return;
    }

    // Get company
    const company: any = await Company.findOne({
      where: {
        id: companyId
      }
    });

    if (!company) {
      response.message = "Company doesn't exist.";
      res.json(response);
      return;
    }

    const companiesAssociation = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companiesAssociation.length == 0) {
      response.message = "Company doesn't exist.";
      res.json(response);
      return;
    }

    // Only admin can create
    if (company.adminId != req.user.id) {
      response.message = "You don't have access to this information.";
      res.json(response);
      return;
    }

    if (isNameRepeated("team", req.user, name)) {
      response.message = "Repeated name of team.";
      res.json(response);
      return;
    }

    const newTeam: any = await Team.create({
      name,
      accessCode: `${name}_${createToken(5)}`,
      companyId
    });

    // Join itself
    const { id } = req.user.toJSON();

    // Token was correct
    const user: any = await User.findOne({
      where: {
        id
      }
    });

    await user.addTeam(newTeam, {
      through: {
        username: companiesAssociation[0].User_Company.username // Username company
      }
    });

    // --------------------- Create connections in the database

    // ---- Calendar
    // Create relation to its only calendar
    await newTeam.createCalendar();

    // ---- Bucket
    // Create main bucket
    const bucketRef = await Bucket.create({
      name: "Main directory"
    });
    await newTeam.addBucket(bucketRef);

    // Then add the relation to that bucket with admin user
    await user.addBucket(bucketRef);

    // ---- Connection
    // Add its first connection to the team
    const connectionRef = await Connection.create({
      name: "Main chat"
    });
    await newTeam.addConnection(connectionRef);

    // Then add the relation to that connection with admin user
    await user.addConnection(connectionRef);

    response.message = "Successful team creation!";
    response.readMsg = true;
    response.typeMsg = "success";

    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = true;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};

export const joinTeam = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { code, companyId }: BODY_JOIN = req.body;

    const teamRef: any = await Team.findOne({
      where: {
        accessCode: code,
        companyId
      }
    });

    if (!teamRef) {
      response.message = "Team not found.";
      res.json(response);
      return;
    }

    const companiesAssociation: any = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (companiesAssociation.length == 0) {
      response.message = "Team not found.";
      res.json(response);
      return;
    }

    // Check if user already in company
    const teams: any = await req.user.getTeams();

    for (let i = 0; i < teams.length; i++) {
      if (teams[i].id == teamRef.id) {
        response.message = "User already in team";
        res.json(response);
        return;
      }
    }

    const { id } = req.user.toJSON();

    // Token was correct
    const user: any = await User.findOne({
      where: {
        id
      }
    });
    await user.addTeam(teamRef, {
      through: {
        username: companiesAssociation[0].User_Company.username // Username company
      }
    });

    // --------------------- Create connections in the database
    // ---- Bucket
    // Then add the relation to the main bucket with this user
    const bucketRef = await teamRef.getBuckets({
      where: {
        name: "Main directory" // This name cannot be changed
      }
    });
    await user.addBucket(bucketRef);

    // ---- Connection
    // Add its first connection to the main team chat
    const connectionRef = await teamRef.getConnections({
      where: {
        name: "Main chat" // This name cannot be changed
      }
    });
    await user.addConnection(connectionRef);

    // Give away result
    const result = await User.findOne({
      where: { id },
      include: Team
    });

    response.data = result;
    response.readMsg = false;

    res.json(response);
  } catch (error) {
    console.error(error);

    // Send Error
    response.data = {};
    response.isAuth = true;
    response.message = error.message;
    response.readMsg = true;
    response.typeMsg = "danger";
    res.json(response);
  }
};
