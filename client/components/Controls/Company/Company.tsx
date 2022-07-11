import styles from "../Controls.module.scss";
import { GlobalContext } from "../../../pages/_app";
import { useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import BtnSpinner from "../../Buttons/BtnClick/BtnClick";

// Icons
import CameraIcon from "../../Svgs/Camera";
import EditIcon from "../../Svgs/Edit";
import CreditCardIcon from "../../Svgs/CreditCard";
import CopyIcon from "../../Svgs/Copy";
import TrashAltIcon from "../../Svgs/TrashAlt";

// Routes
import {
  getCompanyEndpoint,
  DATA_GET_COMPANY,
  getUsersCompanyEndpoint,
  DATA_GET_USER_COMPANY,
  USER_COMPANY
} from "../../../routes/dashboard.company.routes";
import { RESPONSE } from "../../../routes/index.routes";

const CompanySettingsController = () => {
  const {
    setArrayMsgs,
    setSelectedCompany,
    selectedCompany,
    user,
    setModalPopUpEditControl,
    setControlModalState
  } = useContext(GlobalContext);

  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(false);
  // TODO: loader

  const [usersCompany, setUsersCompany] = useState<Array<USER_COMPANY>>([]);

  const notAvailable = () => {
    // TODO: remove this when all finished
    if (setArrayMsgs)
      setArrayMsgs(prev => [
        {
          type: "info",
          text: "Feature not available..."
        },
        ...prev
      ]);
  };

  const getCompanyData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(getCompanyEndpoint.url(id), {
        withCredentials: true
      });
      setIsLoading(false);

      const data: RESPONSE = response.data;
      const companyData: DATA_GET_COMPANY = data.data;

      if (!companyData) {
        router.replace("/");
        return;
      }

      if (!companyData.company) {
        router.replace("/");
        return;
      }

      if (!companyData.company.id) {
        router.replace("/");
        return;
      }

      if (setSelectedCompany) {
        setSelectedCompany(companyData.company);
      }
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
      router.replace("/");
    }
  }, [setArrayMsgs, setSelectedCompany, id, router]);

  const copyToClipBoard = useCallback(
    (text: string) => {
      const navigatorExtendedInstance: any = navigator;
      if (!navigatorExtendedInstance) return;

      navigatorExtendedInstance.clipboard.writeText(text).then(() => {
        // Put a message
        if (setArrayMsgs)
          setArrayMsgs(prev => [
            {
              type: "success",
              text: "Copied to clipboard!"
            },
            ...prev
          ]);
      });
    },
    [setArrayMsgs]
  );

  const getUsersFromCompany = useCallback(async () => {
    try {
      // Do fetch
      setIsLoading(true);
      const response = await axios.get(getUsersCompanyEndpoint.url(id), {
        withCredentials: true
      });
      setIsLoading(false);

      const data: RESPONSE = response.data;
      const companyData: DATA_GET_USER_COMPANY = data.data;

      if (!companyData) {
        router.replace("/");
        return;
      }

      if (!companyData.users) {
        router.replace("/");
        return;
      }

      if (setUsersCompany) {
        setUsersCompany(companyData.users);
      }
      if (setArrayMsgs && data.readMsg) {
        setArrayMsgs(prev => [
          {
            type: data.typeMsg,
            text: data.message
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);

      // Put a message
      if (setArrayMsgs)
        setArrayMsgs(prev => [
          {
            type: "danger",
            text: "Server error"
          },
          ...prev
        ]);
      router.replace("/");
    }
  }, [setArrayMsgs, id, router, setUsersCompany]);

  useEffect(() => {
    getCompanyData();
  }, [getCompanyData]);

  useEffect(() => {
    if (!user || !selectedCompany) return;
    if (user.id != selectedCompany.adminId) return;
    getUsersFromCompany();
  }, [user, selectedCompany]);

  return (
    <AnimatePresence>
      {!selectedCompany || !user ? null : (
        <div className={styles.control}>
          <div className={styles.control_top}>
            <div className={styles.control_top_img}>
              <CameraIcon />

              <div
                style={{
                  backgroundImage: `url(${selectedCompany.companyPictureURL})`
                }}
                className={styles.control_top_img_container}
              ></div>

              {selectedCompany.adminId == user.id && (
                <div
                  title="Change picture"
                  className={`${styles.control_top_img_edit} ${styles.control_top_img}`}
                >
                  <EditIcon />
                </div>
              )}
            </div>
            <h1>{selectedCompany.name}</h1>
          </div>
          <div className={styles.control_container}>
            {selectedCompany.adminId == user.id && (
              <>
                <div className={styles.control_container_title}>Account:</div>
                <div className={styles.control_container_row}>
                  <div className={styles.control_container_row_bold}>
                    Name of company:
                  </div>
                  <div className={styles.control_container_row_data}>
                    {selectedCompany.name}
                  </div>
                  <div
                    title="Edit name of company"
                    className={styles.control_container_row_edit}
                    onClick={() => {
                      if (setModalPopUpEditControl && setControlModalState) {
                        setControlModalState({
                          typeEdit: "company",
                          identifier: "name",
                          teamId: 0,
                          companyId: selectedCompany.id,
                          updatedValue: "",
                          isUpdateOnSingleModel: true
                        });
                        setModalPopUpEditControl(true);
                      }
                    }}
                  >
                    <EditIcon />
                  </div>
                </div>
                <div className={styles.control_container_row}>
                  <div className={styles.control_container_row_bold}>
                    Type of company:
                  </div>
                  <div className={styles.control_container_row_data}>
                    {selectedCompany.typeCompany}
                  </div>
                  <div
                    title="Upgrade company account"
                    className={styles.control_container_row_edit}
                    onClick={notAvailable}
                  >
                    <CreditCardIcon />
                  </div>
                </div>
                <div className={styles.control_container_row}>
                  <div className={styles.control_container_row_bold}>
                    Code for employees:
                  </div>
                  <div className={styles.control_container_row_data}>
                    {selectedCompany.accessCodeEmployee}
                  </div>
                  <div className={styles.control_container_row}>
                    <div
                      title="Copy code"
                      className={styles.control_container_row_copy}
                      onClick={() => {
                        copyToClipBoard(selectedCompany.accessCodeEmployee);
                      }}
                    >
                      <CopyIcon />
                    </div>
                    <div
                      title="Edit code for employees"
                      className={styles.control_container_row_edit}
                    >
                      <EditIcon />
                    </div>
                  </div>
                </div>
                <div className={styles.control_container_row}>
                  <div className={styles.control_container_row_bold}>
                    Code for clients:
                  </div>
                  <div className={styles.control_container_row_data}>
                    {selectedCompany.accessCodeClient}
                  </div>
                  <div className={styles.control_container_row}>
                    <div
                      title="Copy code"
                      className={styles.control_container_row_copy}
                      onClick={() => {
                        copyToClipBoard(selectedCompany.accessCodeClient);
                      }}
                    >
                      <CopyIcon />
                    </div>
                    <div
                      title="Edit code for clients"
                      className={styles.control_container_row_edit}
                    >
                      <EditIcon />
                    </div>
                  </div>
                </div>
                <div className={styles.control_container_title}>Stats:</div>
                <div className={styles.control_container_row}>
                  <div className={styles.control_container_row_bold}>
                    Used storage (GB):
                  </div>
                  <div className={styles.control_container_row_data}>
                    {selectedCompany.storage} /{" "}
                    {selectedCompany.typeCompany == "Basic" ? 1000 : 100000} GB
                  </div>
                  <div
                    title="Upgrade storage company"
                    className={styles.control_container_row_edit}
                    onClick={notAvailable}
                  >
                    <CreditCardIcon />
                  </div>
                </div>
                <div className={styles.control_container_title}>
                  Manage users:
                </div>
                <div className={styles.control_container_subtitle}>
                  Users: {usersCompany.length} /{" "}
                  {selectedCompany.typeCompany == "Basic" ? "30" : "Unlimited"}
                </div>
                <div className={styles.control_container_users}>
                  {usersCompany.map(
                    (userCompany: USER_COMPANY, index: number) => {
                      return (
                        <div
                          key={index}
                          className={styles.control_container_users_row}
                        >
                          <div
                            className={styles.control_container_users_row_img}
                          >
                            <div
                              className={
                                styles.control_container_users_row_img_svg
                              }
                            >
                              <CameraIcon />
                            </div>
                            {userCompany.profilePictureURL && (
                              <img
                                src={userCompany.profilePictureURL}
                                alt={userCompany.User_Company.username}
                              />
                            )}
                          </div>
                          <div
                            className={styles.control_container_users_row_name}
                            title={userCompany.User_Company.username}
                          >
                            {userCompany.User_Company.username}
                          </div>
                          {userCompany.id != user.id && (
                            <div
                              className={
                                styles.control_container_users_row_trash
                              }
                            >
                              <TrashAltIcon />
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}
            <div className={styles.control_container_title}>Own account:</div>
            <div className={styles.control_container_row}>
              <div className={styles.control_container_row_bold}>
                Username in company:
              </div>
              <div className={styles.control_container_row_data}>
                {selectedCompany.User_Company.username}
              </div>

              <div className={styles.control_container_row}>
                <div
                  title="Edit username"
                  className={styles.control_container_row_edit}
                  onClick={() => {
                    if (setModalPopUpEditControl && setControlModalState) {
                      setControlModalState({
                        typeEdit: "company",
                        identifier: "username",
                        teamId: 0,
                        companyId: selectedCompany.id,
                        updatedValue: "",
                        isUpdateOnSingleModel: false
                      });
                      setModalPopUpEditControl(true);
                    }
                  }}
                >
                  <EditIcon />
                </div>
              </div>
            </div>
            {selectedCompany.adminId == user.id && (
              <>
                <div
                  className={`${styles.control_container_title} ${styles.danger}`}
                >
                  Danger Zone:
                </div>
                <div className={styles.control_container_row}>
                  <BtnSpinner
                    text="Delete company"
                    callback={() => {}}
                    color="danger"
                    border="round_5"
                    additionalClass="btn-delete-creation"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CompanySettingsController;
