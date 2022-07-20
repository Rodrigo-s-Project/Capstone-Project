import { RESPONSE } from "../controllers.types";

export const getArrayConnections = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { companyId, teamId } = req.params;

    if (isNaN(companyId) || isNaN(teamId)) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const teams: Array<any> = await req.user.getTeams({
      where: {
        id: teamId,
        companyId
      }
    });

    if (teams.length == 0) {
      response.message = "Invalid credentials.";
      res.json(response);
      return;
    }

    const teamRef: any = teams[0];

    const allConnections: Array<any> = await teamRef.getConnections();
    let connections: Array<any> = [];
    for (let i = 0; i < allConnections.length; i++) {
      const refUsers: Array<any> = await allConnections[i].getUsers();
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
          team: refTeams.length > 0 ? datateam : {}
        });
      }
      connections.push({
        users: allUsers,
        connection: allConnections[i]
      });
    }

    response.readMsg = false;
    response.typeMsg = "success";
    response.data = {
      connections
    };
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
