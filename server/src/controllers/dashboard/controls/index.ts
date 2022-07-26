import { RESPONSE } from "../../controllers.types";
import { BODY_EDIT_SECTION } from "./index.types";
import { createToken } from "../../../utils/keys";

import { isNameRepeated } from "../../helpers/index";

export const editSection = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };
  try {
    const {
      typeEdit,
      identifier,
      teamId,
      companyId,
      updatedValue,
      isUpdateOnSingleModel
    }: BODY_EDIT_SECTION = req.body;

    if (isNaN(companyId)) {
      response.message = "Invalid company ID.";
      res.json(response);
      return;
    }

    const allCompanies: any = await req.user.getCompanies({
      where: {
        id: companyId
      }
    });

    if (!allCompanies || allCompanies.length == 0) {
      response.message = "Invalid company ID.";
      res.json(response);
      return;
    }

    const company = allCompanies[0];

    if (!company) {
      response.message = "Company not found.";
      res.json(response);
      return;
    }

    if (identifier != "username" && company.adminId != req.user.id) {
      response.message = "Unauthorized.";
      res.json(response);
      return;
    }

    if (typeEdit == "company") {
      // Get update object
      let updateObj = {};

      // Update single model
      if (isUpdateOnSingleModel) {
        if (identifier == "name") {
          if (updatedValue.trim() == "") {
            response.message = "Information incomplete.";
            res.json(response);
            return;
          }

          if (await isNameRepeated("company", req.user, updatedValue)) {
            response.message = "Repeated name of company.";
            res.json(response);
            return;
          }

          updateObj["name"] = updatedValue;
        } else if (identifier == "code-clients") {
          updateObj["accessCodeClient"] = `${company.name}_${createToken(6)}`;
        } else if (identifier == "code-employees") {
          updateObj["accessCodeEmployee"] = `${company.name}_${createToken(5)}`;
        } else if (identifier == "img") {
          if (updatedValue.trim() == "") {
            response.message = "Information incomplete.";
            res.json(response);
            return;
          }

          updateObj["companyPictureURL"] = updatedValue;
        }

        await company.update(updateObj);
      } else {
        if (identifier == "username") {
          if (updatedValue.trim() == "") {
            response.message = "Information incomplete.";
            res.json(response);
            return;
          }

          updateObj["username"] = updatedValue;
        }
        await company.User_Company.update(updateObj);
      }

      // Send new company
      const updatedCompany = await req.user.getCompanies({
        where: {
          id: companyId
        }
      });

      response.data = {
        newModel: updatedCompany.length > 0 ? updatedCompany[0] : {}
      };
    } else if (typeEdit == "team") {
      if (isNaN(companyId) || isNaN(teamId)) {
        response.message = "Invalid credentials.";
        res.json(response);
        return;
      }

      const allTeams: any = await req.user.getTeams({
        where: {
          id: teamId,
          companyId
        }
      });

      if (!allTeams || allTeams.length == 0) {
        response.message = "Invalid team ID.";
        res.json(response);
        return;
      }

      const team = allTeams[0];

      if (!team) {
        response.message = "Team not found.";
        res.json(response);
        return;
      }

      // Get update object
      let updateObj = {};

      // Update single model
      if (isUpdateOnSingleModel) {
        if (identifier == "name") {
          if (updatedValue.trim() == "") {
            response.message = "Information incomplete.";
            res.json(response);
            return;
          }

          if (await isNameRepeated("team", req.user, updatedValue)) {
            response.message = "Repeated name of team.";
            res.json(response);
            return;
          }

          updateObj["name"] = updatedValue;
        } else if (identifier == "code") {
          updateObj["accessCode"] = `${team.name}_${createToken(5)}`;
        } else if (identifier == "img") {
          updateObj["teamPictureURL"] = updatedValue;
        }

        await team.update(updateObj);
      } else {
        if (identifier == "username") {
          if (updatedValue.trim() == "") {
            response.message = "Information incomplete.";
            res.json(response);
            return;
          }

          updateObj["username"] = updatedValue;
        }

        await team.User_Team.update(updateObj);
      }

      // Send new company
      const updatedTeam = await req.user.getTeams({
        where: {
          id: teamId,
          companyId
        }
      });

      response.data = {
        newModel: updatedTeam.length > 0 ? updatedTeam[0] : {}
      };
    } else {
      response.message = "Invalid access.";
      res.json(response);
      return;
    }

    // Success
    response.readMsg = false;
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
