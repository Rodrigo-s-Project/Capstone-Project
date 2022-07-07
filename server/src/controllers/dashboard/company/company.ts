import { RESPONSE } from "../../controllers.types";
import { Company } from "../../../models/Company";

// Types
import { BODY_CREATE, BODY_JOIN } from "./company.types";

// Models
import { User } from "../../../models/User";

// Utils
import { createToken } from "../../../utils/keys";

export const getCompaniesFromUser = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const companies = await req.user.getCompanies();

    response.data = {
      companies
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

export const createCompany = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { name }: BODY_CREATE = req.body;

    if (name.trim() == "") {
      response.message = "Invalid information.";
      res.json(response);
      return;
    }

    const newCompany = await Company.create({
      name,
      accessCodeEmployee: `${name}_${createToken(5)}`,
      accessCodeClient: `${name}_${createToken(6)}`,
      adminId: req.user.id
    });

    // Join itself
    const { id } = req.user.toJSON();

    // Token was correct
    const user: any = await User.findOne({
      where: {
        id
      }
    });
    await user.addCompany(newCompany, {
      through: {
        typeUser: "Admin",
        username: user.globalUsername
      }
    });

    response.message = "Successful company creation!";
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

export const joinCompany = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { code }: BODY_JOIN = req.body;

    const companyEmployee = await Company.findOne({
      where: {
        accessCodeEmployee: code
      }
    });

    const companyClient = await Company.findOne({
      where: {
        accessCodeClient: code
      }
    });

    if (!companyEmployee && !companyClient) {
      response.message = "Company not found";
      res.json(response);
      return;
    }

    let company;
    let typeUser;
    if (companyEmployee && !companyClient) {
      company = companyEmployee;
      typeUser = "Employee";
    }
    if (companyClient && !companyEmployee) {
      company = companyClient;
      typeUser = "Client";
    }

    // Check if user already in company
    const companies = await req.user.getCompanies();

    for (let i = 0; i < companies.length; i++) {
      if (companies[i].id == company.id) {
        response.message = "User already in company";
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
    await user.addCompany(company, {
      through: {
        typeUser,
        username: user.globalUsername
      }
    });

    const result = await User.findOne({
      where: { id },
      include: Company
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
