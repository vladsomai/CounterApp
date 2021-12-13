import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

const ProjectsTable = (props: any) => {
  const [counterInfoDB, setCounterInfoDB] = useState<any>([]);
  const [API_Responded, setAPI_Responded] = useState<any>(false);
  const [connectionTimedOut, setConnectionTimedOut] = useState<any>(false);
  const isMounted = useRef(false);
  const { data: session, status } = useSession();

  const [EditModeForAllEntries, setEditMode] = useState<any>();

  //state for highlighting each project(notReached(0) - normal, warning(1) - yellow, limit(2) - red)
  const [highlightProject, setHighlightProject] = useState<any>([]);

  const handleEditButton = (e: any) => {
    setEditMode(
      EditModeForAllEntries.map((item: any) => {
        if (item.entry_id === parseInt(e.target.id) - 1) {
          item = { entry_id: item.entry_id, editMode: true };
        }
        return item;
      })
    );
  };
  const handleSaveButton = async (e: any) => {
    setEditMode(
      EditModeForAllEntries.map((item: any) => {
        if (item.entry_id === parseInt(e.target.id) - 1) {
          item = { entry_id: item.entry_id, editMode: false };
        }
        return item;
      })
    );

    let ownerEmailFromEdit = document.getElementById(
      `${e.target.id - 1}_owner_email`
    );
    let contactsLimitFromEdit = document.getElementById(
      `${e.target.id - 1}_contacts_limit`
    );
    let warningAtFromEdit = document.getElementById(
      `${e.target.id - 1}_warning_at`
    );

    let updateOwner = false;
    let updateContactsLimit = false;
    let updateWarning = false;

    // @ts-ignore: Object is possibly 'null'.
    if (ownerEmailFromEdit.value != "") updateOwner = true;

    // @ts-ignore: Object is possibly 'null'.
    if (contactsLimitFromEdit.value != "") updateContactsLimit = true;

    // @ts-ignore: Object is possibly 'null'.
    if (warningAtFromEdit.value != "") updateWarning = true;

    const indexOfEntryToBeSaved = e.target.id - 1;
    const projectToBeSaved = counterInfoDB[indexOfEntryToBeSaved];
    const loggedUser: string = String(
      session?.user?.email || session?.user?.name
    );
    let updateOwnerOK = false;
    let updateContactsLimitAndWarningOK = false;

    if (updateOwner || updateContactsLimit || updateWarning) {
      if (
        confirm(
          `Are you sure you want to save the modifications for ${projectToBeSaved.project_name} ?`
        )
      ) {
        if (updateOwner) {
          await makeDatabaseAction(
            "updateOwner",
            "",
            projectToBeSaved.adapter_code,
            projectToBeSaved.fixture_type,
            // @ts-ignore: Object is possibly 'null'.
            ownerEmailFromEdit.value,
            0,
            0,
            loggedUser
          )
            .then((res) => JSON.parse(String(res)))
            .then((resJSON) => {
              if (parseInt(resJSON.message.affectedRows) === 1)
                updateOwnerOK = true;
              else updateOwnerOK = false;
            });
        }

        if (updateContactsLimit && updateWarning) {
          await makeDatabaseAction(
            "updateContactsLimitAndWarning",
            "",
            projectToBeSaved.adapter_code,
            projectToBeSaved.fixture_type,
            "",
            // @ts-ignore: Object is possibly 'null'.
            contactsLimitFromEdit.value,
            // @ts-ignore: Object is possibly 'null'.
            warningAtFromEdit.value,
            loggedUser
          )
            .then((res) => JSON.parse(String(res)))
            .then((resJSON) => {
              if (resJSON.message.affectedRows === 1)
                updateContactsLimitAndWarningOK = true;
              else updateContactsLimitAndWarningOK = false;
            });
        }
      }
      if (updateContactsLimit ? !updateWarning : updateWarning) {
        props.openModalAction({
          title: "Error!",
          description:
            "You must fill in both limit and warning fields, limit must be greater than warning!",
          pictureUrl: "/undraw_cancel_u-1-it.svg",
          className: "text-center",
        });
        return;
      }

      if (!updateContactsLimitAndWarningOK) {
        props.openModalAction({
          title: "Error!",
          description: `The Limit must be greater than the Warning!`,
          pictureUrl: "/undraw_cancel_u-1-it.svg",
          className: "text-center",
        });
      }

      if (updateOwnerOK || updateContactsLimitAndWarningOK) {
        props.openModalAction({
          title: "Success!",
          description: `Fixture with code ${
            projectToBeSaved.adapter_code
          } from ${projectToBeSaved.fixture_type} has been modified for
        ${updateOwnerOK ? "Owner email" : ""}
        ${updateContactsLimitAndWarningOK ? " Contacts limit and Warning " : ""}
        !`,
          pictureUrl: "/undraw_confirmation_re_b6q5.svg",
          className: "text-center",
        });
      }
    }
    return;
  };

  const handleResetButton = (e: any) => {
    const indexOfEntryToBeReseted = e.target.id - 1;
    const projectToBeReseted = counterInfoDB[indexOfEntryToBeReseted];
    const loggedUser: string = String(
      session?.user?.email || session?.user?.name
    );
    if (
      confirm(
        `Are you sure you want to reset contacts for ${projectToBeReseted.project_name} ?`
      )
    ) {
      makeDatabaseAction(
        "resetCounter",
        "",
        projectToBeReseted.adapter_code,
        projectToBeReseted.fixture_type,
        "",
        0,
        0,
        loggedUser
      ).then(() => {
        props.openModalAction({
          title: "Success!",
          description: `Fixture with code ${projectToBeReseted.adapter_code} from ${projectToBeReseted.fixture_type} has been reset to 0 contacts!`,
          pictureUrl: "/undraw_confirmation_re_b6q5.svg",
          className: "text-center",
        });
        fetchDataDB();
      });
    }
  };
  const handleDeleteButton = (e: any) => {
    const indexOfEntryToBeDeleted = e.target.id - 1;
    const projectToBeDeleted = counterInfoDB[indexOfEntryToBeDeleted];

    if (
      confirm(
        `Are you sure you want to delete ${projectToBeDeleted.project_name} ?`
      )
    ) {
      makeDatabaseAction(
        "deleteProject",
        "",
        projectToBeDeleted.adapter_code,
        projectToBeDeleted.fixture_type,
        "",
        0,
        0,
        ""
      ).then(() => {
        props.openModalAction({
          title: "Success!",
          description: `Fixture with code ${projectToBeDeleted.adapter_code} from ${projectToBeDeleted.fixture_type} has been deleted!`,
          pictureUrl: "/undraw_confirmation_re_b6q5.svg",
          className: "text-center",
        });
        fetchDataDB();
      });
    }
  };

  const getHighlightType = (counterInfoArray: any) => {
    let highlightTypeTemp: string = "";

    return counterInfoArray.map((item: any) => {
      if (item.contacts > item.contacts_limit) {
        highlightTypeTemp = "bg-danger";
      } else if (item.contacts > item.warning_at) {
        highlightTypeTemp = "bg-warning";
      } else {
        highlightTypeTemp = "";
      }

      return {
        entry_id: counterInfoArray.indexOf(item),
        highlightTypeClass: highlightTypeTemp,
      };
    });
  };

  const fetchDataDB = useCallback(async () => {
    console.log("Fetching new data..");
    await fetch("/api/getCounterInfo", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "omit",
      body: JSON.stringify({
        action: "getProjects",
        project_name: "",
        adapter_code: 0,
        fixture_type: "",
        owner_email: "",
        contacts_limit: 0,
        warning_at: 0,
        modified_by: "",
      }),
    })
      .then((result) =>
        result.json().then((resultJson) => {
          if (
            resultJson.message.code === "ER_ACCESS_DENIED_ERROR" ||
            resultJson.message.code === "ECONNREFUSED"
          )
            throw "Cannot connect to DB";
          if (isMounted.current === true) {
            setCounterInfoDB(resultJson.message);
            setAPI_Responded(true);

            setEditMode(
              resultJson.message.map((item: any) => {
                return {
                  entry_id: resultJson.message.indexOf(item),
                  editMode: false,
                };
              })
            );
            setHighlightProject(getHighlightType(resultJson.message));
            console.log("Data fetched successfully!");
          }
        })
      )
      .catch((err) => {
        console.log(err);
        if (isMounted.current === true) setConnectionTimedOut(true);
      });
  }, []);
  const makeDatabaseAction = (
    actionParam: string,
    project_nameParam: string,
    adapter_codeParam: number,
    fixture_typeParam: string,
    owner_emailParam: string,
    contacts_limitParam: number,
    warning_atParam: number,
    modified_byParam: string
  ) => {
    return new Promise((resolve, reject) => {
      fetch("/api/getCounterInfo", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "omit",
        body: JSON.stringify({
          action: actionParam,
          project_name: project_nameParam,
          adapter_code: adapter_codeParam,
          fixture_type: fixture_typeParam,
          owner_email: owner_emailParam,
          contacts_limit: contacts_limitParam,
          warning_at: warning_atParam,
          modified_by: modified_byParam,
        }),
      })
        .then((result) => result.json())
        .then((resultJson) => {
          resolve(JSON.stringify(resultJson));
        })
        .catch((err) => {
          console.log(err.message);
          reject(err.message);
        });
    });
  };

  useEffect(() => {
    isMounted.current = true;
    fetchDataDB();

    return () => {
      isMounted.current = false;
    };
  }, [props.triggerFetchProp, fetchDataDB]);

  if (API_Responded) {
    return (
      <div className="table-responsive mx-4">
        <table className="table table-sm mt-5 table-secondary fw-bold border-dark table-bordered text-center align-middle">
          <thead>
            <tr className="fs-6">
              {!(props.mode === "view") ? (
                <th className="bg-primary align-middle col-1">Menu</th>
              ) : null}
              <th className="bg-primary align-middle col">#</th>
              <th className="bg-primary align-middle col">Project name</th>
              <th className="bg-primary align-middle col">Adapter code</th>
              <th className="bg-primary align-middle col">Fixture type</th>
              <th className="bg-primary align-middle col-2">Owner email</th>
              <th className="bg-primary align-middle col-1">Contacts</th>
              <th className="bg-primary align-middle col-1">Limit</th>
              <th className="bg-primary align-middle col-1">Warning</th>
              <th className="bg-primary align-middle col">Resets</th>
              <th className="bg-primary align-middle col-2">Modified by</th>
              <th className="bg-primary align-middle col-1">Last update</th>
            </tr>
          </thead>
          <tbody>
            {counterInfoDB.map((Project: any) => {
              return (
                <tr key={counterInfoDB.indexOf(Project)}>
                  {!(props.mode === "view") ? (
                    <td>
                      <button
                        onClick={handleResetButton}
                        id={counterInfoDB.indexOf(Project) + 1}
                        className="btn btn-secondary me-2 mb-1 btn-sm pt-2 menubuttons"
                        title="Reset"
                      >
                        <Image
                          id={counterInfoDB.indexOf(Project) + 1}
                          src="/reset.svg"
                          width={20}
                          height={20}
                          alt="Reset"
                          priority
                        ></Image>
                      </button>
                      <button
                        onClick={handleDeleteButton}
                        className="btn btn-danger me-2 mb-1 btn-sm pt-2 menubuttons"
                        title="Delete"
                        id={counterInfoDB.indexOf(Project) + 1}
                      >
                        <Image
                          id={counterInfoDB.indexOf(Project) + 1}
                          src="/delete.svg"
                          width={20}
                          height={20}
                          alt="Delete"
                          className=""
                          priority
                        ></Image>
                      </button>

                      {EditModeForAllEntries &&
                      !EditModeForAllEntries[counterInfoDB.indexOf(Project)]
                        ?.editMode ? (
                        <button
                          id={counterInfoDB.indexOf(Project) + 1}
                          className="btn btn-primary me-2 mb-1 btn-sm pt-2 menubuttons"
                          onClick={handleEditButton}
                          title="Edit"
                        >
                          <Image
                            id={counterInfoDB.indexOf(Project) + 1}
                            src="/edit.svg"
                            width={20}
                            height={20}
                            alt="Edit"
                            className=""
                            priority
                          ></Image>
                        </button>
                      ) : (
                        <button
                          onClick={handleSaveButton}
                          id={counterInfoDB.indexOf(Project) + 1}
                          className="btn btn-success me-2 mb-1 btn-sm pt-2 menubuttons"
                          title="Save"
                        >
                          <Image
                            id={counterInfoDB.indexOf(Project) + 1}
                            src="/save.svg"
                            width={20}
                            height={20}
                            alt="Save"
                            className=""
                            priority
                          ></Image>
                        </button>
                      )}
                    </td>
                  ) : null}

                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {" "}
                    {counterInfoDB.indexOf(Project) + 1}
                  </td>
                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {Project.project_name}
                  </td>
                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {Project.adapter_code}
                  </td>
                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {Project.fixture_type}
                  </td>
                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {EditModeForAllEntries &&
                    !EditModeForAllEntries[counterInfoDB.indexOf(Project)]
                      ?.editMode ? (
                      Project.owner_email
                    ) : (
                      <input
                        id={`${counterInfoDB.indexOf(Project)}_owner_email`}
                        name="owner_email_edit"
                        type="email"
                        className="form-control-sm fw-bolder w-100"
                        placeholder="Owner email"
                        aria-label="Owner"
                      ></input>
                    )}
                  </td>
                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {Project.contacts}
                  </td>
                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {EditModeForAllEntries &&
                    !EditModeForAllEntries[counterInfoDB.indexOf(Project)]
                      ?.editMode ? (
                      Project.contacts_limit
                    ) : (
                      <input
                        id={`${counterInfoDB.indexOf(Project)}_contacts_limit`}
                        name="contacts_limit_edit"
                        type="number"
                        className="form-control-sm fw-bolder w-75"
                        placeholder="Limit"
                        aria-label="Limit"
                      ></input>
                    )}
                  </td>
                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {EditModeForAllEntries &&
                    !EditModeForAllEntries[counterInfoDB.indexOf(Project)]
                      ?.editMode ? (
                      Project.warning_at
                    ) : (
                      <input
                        id={`${counterInfoDB.indexOf(Project)}_warning_at`}
                        name="warning_at_edit"
                        type="number"
                        className="form-control-sm fw-bolder w-75"
                        placeholder="Warning"
                        aria-label="Warning"
                        required
                      ></input>
                    )}
                  </td>
                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {Project.resets}
                  </td>
                  <td
                    className={
                      highlightProject[counterInfoDB.indexOf(Project)]
                        ?.highlightTypeClass
                    }
                  >
                    {Project.modified_by}
                  </td>
                  {
                    <td
                      className={
                        highlightProject[counterInfoDB.indexOf(Project)]
                          ?.highlightTypeClass
                      }
                    >
                      {new Date(Project.last_update).getFullYear()}-
                      {new Date(Project.last_update).getMonth()}-
                      {new Date(Project.last_update).getDate()} &nbsp;
                      {new Date(Project.last_update).getHours()}:
                      {String(
                        new Date(Project.last_update).getMinutes()
                      ).padStart(2, "0")}
                      :{new Date(Project.last_update).getSeconds()}
                    </td>
                  }
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else if (connectionTimedOut) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100">
        <Image
          src="/undraw_questions_re_1fy7.svg"
          height={250}
          width={800}
          alt="Error Picture"
          priority
          className="animate__animated animate__bounceIn"
        ></Image>
        <p className="text-danger display-3 text-center p-5">
          Database did not respond, please contact your administrator!
        </p>
      </div>
    );
  } else
    return (
      <div className="d-flex flex-column align-items-center justify-content-center h-100">
        <div className="d-flex justify-content-center">
          <div
            className="spinner-grow text-primary"
            style={{ width: "10rem", height: "10rem" }}
            role="status"
          >
            <span className=""></span>
          </div>
        </div>
        <div className="d-flex justify-content-center p-5">
          <p className="text-white display-5">Loading data...</p>
        </div>
      </div>
    );
};

export default ProjectsTable;
