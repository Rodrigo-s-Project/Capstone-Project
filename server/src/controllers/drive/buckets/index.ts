import { RESPONSE } from "../../controllers.types";

export const getBucketsFromTeam = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: false,
    typeMsg: "danger",
    data: {}
  };
  try {
    const { companyId, teamId } = req.params;

    if (isNaN(teamId) || isNaN(companyId)) {
      response.readMsg = true;
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

    const team: any = teams[0];

    const arrayBuckets: Array<any> = await team.getBuckets();
    let finalArrayBuckets: Array<any> = [];

    for (let i = 0; i < arrayBuckets.length; i++) {
      const isUserInBucket: boolean = await arrayBuckets[i].hasUser(req.user);

      if (isUserInBucket) {
        finalArrayBuckets.push(arrayBuckets[i]);
      }
    }

    response.data = {
      buckets: finalArrayBuckets
    };
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
