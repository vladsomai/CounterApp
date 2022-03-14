import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Project } from "../pages/api/counterTypes";
import { FixedSizeGrid as Grid } from "react-window";

const Cell = ({ columnIndex, rowIndex, style }: any) => (
  <div style={style}>
    Item {rowIndex},{columnIndex}
  </div>
);

const Example = () => (
  <Grid
    columnCount={1000}
    columnWidth={100}
    height={150}
    rowCount={1000}
    rowHeight={35}
    width={innerWidth/1.03}
  >
    {Cell}
  </Grid>
);

const ProjectsTable = (props: any) => {
  const counterInfoDB = useRef<Project[]>([]);
  const displayedProjects = useRef<Project[]>([]);
  const pagesCount = useRef<number[]>(new Array());
  const [API_Responded, setAPI_Responded] = useState<boolean>(false);
  const firstPaint = useRef(true);
  const [projectNameFilter, setProjectNameFilter] = useState<string>("");
  const [ownerEmailFilter, setOwnerEmailFilter] = useState<string>("");
  const [fixtureTypeFilter, setFixtureTypeFilter] = useState<string>("");
  const [connectionTimedOut, setConnectionTimedOut] = useState<boolean>(false);
  const isMounted = useRef(false);
  const inputFilterValue = useRef(null);
  const router = useRouter();

  const buttonHeight = 20;
  const buttonWidth = 20;

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

    //XOR between contact limit and warning ->
    if (updateContactsLimit ? !updateWarning : updateWarning) {
      props.openModalAction({
        title: "Error!",
        description: `In case you want to update Limit and Warning, you must fill in both of the fields!`,
        pictureUrl: "/undraw_cancel_u-1-it.svg",
        className: "text-center",
      });
      return;
    }
    const indexOfEntryToBeSaved = e.target.id - 1;
    const projectToBeSaved: Project =
      counterInfoDB.current[indexOfEntryToBeSaved];
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
            0,
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
            0,
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

          //in case user entered both warning and limit but the database did not update the info-> send error
          if (!updateContactsLimitAndWarningOK) {
            props.openModalAction({
              title: "Error!",
              description: `The Limit must be greater than the Warning!`,
              pictureUrl: "/undraw_cancel_u-1-it.svg",
              className: "text-center",
            });
            return;
          }
        }
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
          pictureUrl: "/confirm_OK.svg",
          className: "text-center",
        });
        fetchDataDB();
      }
    }
  };

  const handleResetButton = (e: any) => {
    const indexOfEntryToBeReseted = e.target.id - 1;
    const projectToBeReseted: Project =
      counterInfoDB.current[indexOfEntryToBeReseted];
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
        0,
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
          pictureUrl: "/confirm_OK.svg",
          className: "text-center",
        });
        fetchDataDB();
      });
    }
  };
  const handleInfoButton = (e: any) => {
    const indexOfEntryToBeShown = e.target.id - 1;
    const projectIDToBeShown =
      counterInfoDB.current[indexOfEntryToBeShown].entry_id;
    try {
      router.push(`/project/${projectIDToBeShown}`);
    } catch (err) {}
  };

  const handleDeleteButton = (e: any) => {
    const indexOfEntryToBeDeleted = e.target.id - 1;
    const projectToBeDeleted: Project =
      counterInfoDB.current[indexOfEntryToBeDeleted];

    if (
      confirm(
        `Are you sure you want to delete ${projectToBeDeleted.project_name} ?`
      )
    ) {
      makeDatabaseAction(
        "deleteProject",
        0,
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
          pictureUrl: "/confirm_OK.svg",
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
            //sort the array based on contacts
            let sortedInfo = resultJson.message.sort((a: any, b: any) => {
              return b.contacts - a.contacts;
            });
            counterInfoDB.current = sortedInfo;

            if (firstPaint.current) {
              const numberOfPages = Math.ceil(
                counterInfoDB.current.length / 20
              );
              for (let i = 1; i <= numberOfPages; i++) {
                pagesCount.current.push(i);
              }
              firstPaint.current = false;

              //   displayedProjects.current = [...counterInfoDB];
            }

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

  const checkInputValue = (e: any) => {
    e.preventDefault();
    setProjectNameFilter("");
    setFixtureTypeFilter("");
    setOwnerEmailFilter("");
    const searchBy: string = e.target[0].value;
    if (searchBy === "SearchBy") return;
    const value = e.target[1].value;

    switch (searchBy) {
      case "SearchBy":
        return;
      case "ProjectName":
        setProjectNameFilter(value);
        return;
      case "FixtureType":
        setFixtureTypeFilter(value);
        return;
      case "OwnerEmail":
        setOwnerEmailFilter(value);
        return;
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchDataDB();

    return () => {
      isMounted.current = false;
    };
  }, [fetchDataDB]);

  if (API_Responded) {
    return (
      <>
        <Example></Example>;
        <form
          onSubmit={checkInputValue}
          className="d-flex flex-column flex-md-row mx-4 my-4 justify-content-start bg-grey align-items-center p-3 rounded shadowEffect border border-2  "
        >
          <select
            className="form-select fw-bolder w-auto mx-2 my-2"
            aria-label="Default select example"
          >
            <option className="fw-bolder" value="SearchBy">
              Search by
            </option>
            <option className="fw-bolder" value="ProjectName">
              Project name
            </option>
            <option className="fw-bolder" value="FixtureType">
              Fixture type
            </option>
            <option className="fw-bolder" value="OwnerEmail">
              Owner email
            </option>
          </select>

          <input
            ref={inputFilterValue}
            name="inputFilterValue"
            type="text"
            className="form-control fw-bolder mx-2 my-2 searchBarWidth"
            placeholder="What are you looking for?"
            aria-label="Filter"
          ></input>
          <button
            className="btn btn-primary scaleEffect fs-6 fw-bolder w-auto mx-2 my-2"
            type="submit"
          >
            Search
            <Image
              src="/search.svg"
              width={20}
              height={20}
              alt="filterPic"
              className="img-fluid pt-2 ms-1"
            ></Image>
          </button>
        </form>
        <div className="table-responsive mx-4">
          <table className="table table-sm table-secondary fontSmall fw-bold border-light table-bordered text-center align-middle table-hover">
            <thead>
              <tr className="fs-6">
                {!(props.mode === "view") ? (
                  <th className="bg-primary align-middle col-xxl-2">Menu</th>
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
              {counterInfoDB.current.map((Project: any) => {
                if (
                  Project.project_name
                    .toLowerCase()
                    .includes(projectNameFilter.toLowerCase()) &&
                  Project.owner_email
                    .toLowerCase()
                    .includes(ownerEmailFilter.toLowerCase()) &&
                  Project.fixture_type
                    .toLowerCase()
                    .includes(fixtureTypeFilter.toLowerCase())
                )
                  return (
                    <tr key={counterInfoDB.current.indexOf(Project)}>
                      {!(props.mode === "view") ? (
                        <td>
                          <button
                            onClick={handleResetButton}
                            id={(
                              counterInfoDB.current.indexOf(Project) + 1
                            ).toString()}
                            className="btn btn-secondary me-2 mb-1 btn-sm pt-2 menubuttons"
                            title="Reset"
                          >
                            <Image
                              id={(
                                counterInfoDB.current.indexOf(Project) + 1
                              ).toString()}
                              src="/reset.svg"
                              width={buttonWidth}
                              height={buttonHeight}
                              alt="Reset"
                              priority
                            ></Image>
                          </button>
                          <button
                            onClick={handleDeleteButton}
                            className="btn btn-danger me-2 mb-1 btn-sm pt-2 menubuttons"
                            title="Delete"
                            id={(
                              counterInfoDB.current.indexOf(Project) + 1
                            ).toString()}
                          >
                            <Image
                              id={(
                                counterInfoDB.current.indexOf(Project) + 1
                              ).toString()}
                              src="/delete.svg"
                              width={buttonWidth}
                              height={buttonHeight}
                              alt="Delete"
                              className=""
                              priority
                            ></Image>
                          </button>

                          {
                            //currently disabled
                            /* <button
                            onClick={handleInfoButton}
                            className="btn btn-info me-2 mb-1 btn-sm pt-2 menubuttons"
                            title="Info"
                            id={counterInfoDB.current.indexOf(Project) + 1}
                          >
                            <Image
                              id={counterInfoDB.current.indexOf(Project) + 1}
                              src="/file-earmark-text.svg"
                              width={buttonWidth}
                              height={buttonHeight}
                              alt="Info"
                              className=""
                              priority
                            ></Image>
                          </button> */
                          }

                          {EditModeForAllEntries &&
                          !EditModeForAllEntries[
                            counterInfoDB.current.indexOf(Project)
                          ]?.editMode ? (
                            <button
                              id={(
                                counterInfoDB.current.indexOf(Project) + 1
                              ).toString()}
                              className="btn btn-primary me-2 mb-1 btn-sm pt-2 menubuttons"
                              onClick={handleEditButton}
                              title="Edit"
                            >
                              <Image
                                id={(
                                  counterInfoDB.current.indexOf(Project) + 1
                                ).toString()}
                                src="/edit.svg"
                                width={buttonWidth}
                                height={buttonHeight}
                                alt="Edit"
                                className=""
                                priority
                              ></Image>
                            </button>
                          ) : (
                            <button
                              onClick={handleSaveButton}
                              id={(
                                counterInfoDB.current.indexOf(Project) + 1
                              ).toString()}
                              className="btn btn-success me-2 mb-1 btn-sm pt-2 menubuttons"
                              title="Save"
                            >
                              <Image
                                id={(
                                  counterInfoDB.current.indexOf(Project) + 1
                                ).toString()}
                                src="/save.svg"
                                width={buttonWidth}
                                height={buttonHeight}
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
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {" "}
                        {counterInfoDB.current.indexOf(Project) + 1}
                      </td>
                      <td
                        className={
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {Project.project_name}
                      </td>
                      <td
                        className={
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {Project.adapter_code}
                      </td>
                      <td
                        className={
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {Project.fixture_type}
                      </td>
                      <td
                        className={
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {EditModeForAllEntries &&
                        !EditModeForAllEntries[
                          counterInfoDB.current.indexOf(Project)
                        ]?.editMode ? (
                          Project.owner_email
                        ) : (
                          <input
                            id={`${counterInfoDB.current.indexOf(
                              Project
                            )}_owner_email`}
                            name="owner_email_edit"
                            type="email"
                            className="form-control fw-bolder w-100"
                            placeholder="Owner email"
                            aria-label="Owner"
                          ></input>
                        )}
                      </td>
                      <td
                        className={
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {Project.contacts}
                      </td>
                      <td
                        className={
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {EditModeForAllEntries &&
                        !EditModeForAllEntries[
                          counterInfoDB.current.indexOf(Project)
                        ]?.editMode ? (
                          Project.contacts_limit
                        ) : (
                          <input
                            id={`${counterInfoDB.current.indexOf(
                              Project
                            )}_contacts_limit`}
                            name="contacts_limit_edit"
                            type="number"
                            className="form-control fw-bolder m-auto"
                            placeholder="Limit"
                            aria-label="Limit"
                          ></input>
                        )}
                      </td>
                      <td
                        className={
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {EditModeForAllEntries &&
                        !EditModeForAllEntries[
                          counterInfoDB.current.indexOf(Project)
                        ]?.editMode ? (
                          Project.warning_at
                        ) : (
                          <input
                            id={`${counterInfoDB.current.indexOf(
                              Project
                            )}_warning_at`}
                            name="warning_at_edit"
                            type="number"
                            className="form-control fw-bolder m-auto"
                            placeholder="Warning"
                            aria-label="Warning"
                            required
                          ></input>
                        )}
                      </td>
                      <td
                        className={
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {Project.resets}
                      </td>
                      <td
                        className={
                          highlightProject[
                            counterInfoDB.current.indexOf(Project)
                          ]?.highlightTypeClass
                        }
                      >
                        {Project.modified_by}
                      </td>
                      {
                        <td
                          className={
                            highlightProject[
                              counterInfoDB.current.indexOf(Project)
                            ]?.highlightTypeClass
                          }
                        >
                          {new Date(Project.last_update).getFullYear()}-
                          {new Date(Project.last_update).getMonth() + 1}-
                          {new Date(Project.last_update).getDate()} &nbsp;
                          {new Date(Project.last_update).getHours()}:
                          {String(
                            new Date(Project.last_update).getMinutes()
                          ).padStart(2, "0")}
                          {/* :{new Date(Project.last_update).getSeconds()} */}
                        </td>
                      }
                    </tr>
                  );
              })}
            </tbody>
          </table>
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className="page-item">
                <a className="page-link" href="#">
                  Previous
                </a>
              </li>
              {pagesCount.current.map((page: number) => (
                <li key={page} id={page.toString()} className="page-item">
                  <a className="page-link" href="#">
                    {page}
                  </a>
                </li>
              ))}
              <li className="page-item">
                <a className="page-link" href="#">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </>
    );
  } else if (connectionTimedOut) {
    return (
      <>
        <div className="d-flex flex-column align-items-center justify-content-center screen-80 ">
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
      </>
    );
  } else
    return (
      <>
        <div className="d-flex flex-column align-items-center justify-content-center screen-80 paddingTopBottom">
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
      </>
    );
};

export const makeDatabaseAction = (
  actionParam: string,
  entry_idParam: number,
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
        entry_id: entry_idParam,
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

export default ProjectsTable;
