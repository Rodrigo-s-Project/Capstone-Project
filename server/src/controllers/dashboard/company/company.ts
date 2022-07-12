import { RESPONSE } from "../../controllers.types";
import { Company } from "../../../models/Company";

// Types
import { BODY_CREATE, BODY_JOIN } from "./company.types";

// Models
import { User } from "../../../models/User";

// Utils
import { createToken } from "../../../utils/keys";
import { isNameRepeated } from "../../helpers/index";

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

export const getCompanyFromUser = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { id } = req.params;

    if (isNaN(id)) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    const company = await req.user.getCompanies({
      where: {
        id
      }
    });

    response.data = {
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

export const getCompanyUsersFromId = async (req, res) => {
  let response: RESPONSE = {
    isAuth: true,
    message: "",
    readMsg: true,
    typeMsg: "danger",
    data: {}
  };

  try {
    const { id } = req.params;

    if (isNaN(id)) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    // Get company
    const company = await req.user.getCompanies({
      where: {
        id
      }
    });

    if (company.length == 0) {
      response.message = "Invalid id.";
      res.json(response);
      return;
    }

    // Get all users
    const allUsers: any = await company[0].getUsers();
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

    if (await isNameRepeated("company", req.user, name)) {
      response.message = "Repeated name of company.";
      res.json(response);
      return;
    }

    const newCompany = await Company.create({
      name,
      accessCodeEmployee: `${name}_${createToken(5)}`,
      accessCodeClient: `${name}_${createToken(6)}`,
      adminId: req.user.id,
      typeCompany: "Basic" // TODO: change with Stripe
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
        username: user.globalUsername,
        typeAccount: "Basic" // TODO: get the payment method
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

    // TODO: check limit of users in company

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
        username: user.globalUsername,
        typeAccount: "Free"
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
