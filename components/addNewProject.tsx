import { useSession } from "next-auth/react";
import { useRef } from "react";

const AddNewProject = (props: any) => {
  const { data: session, status } = useSession();
  const newProjectFrom = useRef(null);

  const handleInsertButtonTest = (e: any) => {
    const user: string = String(session?.user?.email || session?.user?.name);

    let errorDescription = "";

    // @ts-ignore: Object is possibly 'null'.
    if (newProjectFrom.current["project_name"].value === "")
      errorDescription = "Project name is empty, please fill it!";

    // @ts-ignore: Object is possibly 'null'.
    if (newProjectFrom.current["adapter_code"].value === "")
      errorDescription = "Adapter code is empty, please fill it!";

    // @ts-ignore: Object is possibly 'null'.
    if (newProjectFrom.current["fixture_type"].value === "")
      errorDescription = "Fixture type is empty, please fill it!";

    // @ts-ignore: Object is possibly 'null'.
    if (newProjectFrom.current["owner_email"].value === "")
      errorDescription = "Owner email is empty, please fill it!";

    // @ts-ignore: Object is possibly 'null'.
    if (newProjectFrom.current["contacts_limit"].value === "")
      errorDescription = "Limit is empty, please fill it!";

    // @ts-ignore: Object is possibly 'null'.
    if (newProjectFrom.current["warning_at"].value === "")
      errorDescription = "Warning is empty, please fill it!";

    if (!(errorDescription === "")) {
      props.openModalAction({
        title: "Error!",
        description: errorDescription,
        pictureUrl: "/undraw_cancel_u-1-it.svg",
        className: "text-center",
      });
      return;
    }

    makeDatabaseAction(
      "insertProject",
      // @ts-ignore: Object is possibly 'null'.
      newProjectFrom.current["project_name"].value,
      // @ts-ignore: Object is possibly 'null'.
      newProjectFrom.current["adapter_code"].value,
      // @ts-ignore: Object is possibly 'null'.
      newProjectFrom.current["fixture_type"].value,
      // @ts-ignore: Object is possibly 'null'.
      newProjectFrom.current["owner_email"].value,
      // @ts-ignore: Object is possibly 'null'.
      newProjectFrom.current["contacts_limit"].value,
      // @ts-ignore: Object is possibly 'null'.
      newProjectFrom.current["warning_at"].value,
      // @ts-ignore: Object is possibly 'null'.
      user
    )
      .then((result: any) => result.json())
      .then((resultJSON: any) => {
        if (resultJSON.status === 500) {
          resultJSON.message.includes("constraint")
            ? (resultJSON.message =
                "Please insert the limit higher than the warning!")
            : null;
          props.openModalAction({
            title: "Error!",
            description: resultJSON.message,
            pictureUrl: "/undraw_cancel_u-1-it.svg",
            className: "text-center",
          });
        } else if (resultJSON.status === 200) {
          if (resultJSON.message.affectedRows === 1) {
            props.openModalAction({
              title: "Success!",
              description: "Project has been successfully created!",
              pictureUrl: "/undraw_confirmation_re_b6q5.svg",
              className: "text-center",
            });
            // @ts-ignore: Object is possibly 'null'.
            newProjectFrom.current.reset();
          }
        }
      })
      .catch((err) => {
        console.log("fetch err ", err);
      });
  };

  const handleInsertButton = (e: any) => {
    const user: string = String(session?.user?.email || session?.user?.name);

    makeDatabaseAction(
      "insertProject",
      String(e.target.project_name.value),
      parseInt(e.target.adapter_code.value),
      String(e.target.fixture_type.value),
      String(e.target.owner_email.value),
      parseInt(e.target.contacts_limit.value),
      parseInt(e.target.warning_at.value),
      user
    )
      .then((result: any) => result.json())
      .then((resultJson) => {
        console.log(resultJson);
      });
  };

  return (
    <>
      <div className="cointainer d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex justify-content-around w-50">
          <p className="display-6 text-light text-center">
            Create a new project
          </p>
        </div>
        <form
          ref={newProjectFrom}
          className="d-flex align-items-center pt-2"
          method="post"
          // onSubmit={handleInsertButton}
        >
          <div className="row">
            <input
              name="project_name"
              type="text"
              className="form-control fs-6 fw-bolder me-2 col"
              placeholder="Project name"
              aria-label="Project"
              required
            ></input>
            <input
              name="adapter_code"
              type="number"
              className="form-control fs-6 fw-bolder me-2 col"
              placeholder="Adapter code"
              aria-label="Adapter"
              required
            ></input>
            <input
              name="fixture_type"
              type="text"
              className="form-control fs-6 fw-bolder me-2 col"
              placeholder="Fixture type"
              aria-label="Fixture type"
              required
            ></input>
            <input
              name="owner_email"
              type="email"
              className="form-control fs-6 fw-bolder me-2 col"
              placeholder="Owner email"
              aria-label="Owner"
              required
            ></input>
            <input
              name="contacts_limit"
              type="number"
              className="form-control fs-6 fw-bolder me-2 col"
              placeholder="Limit"
              aria-label="Limit"
              required
            ></input>
            <input
              name="warning_at"
              type="number"
              className="form-control fs-6 fw-bolder me-2 col"
              placeholder="Warning"
              aria-label="Warning"
              required
            ></input>
            <button
              type="button"
              onClick={handleInsertButtonTest}
              className="btn btn-primary fw-bold text-nowrap col"
            >
              Create!
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
export default AddNewProject;

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
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
