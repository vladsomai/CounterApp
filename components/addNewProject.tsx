import { useSession } from "next-auth/react";

const AddNewProject = () => {
  const { data: session, status } = useSession();

  const handleInsertButton = (e: any) => {
    const user: string = String(session?.user?.email || session?.user?.name);
    console.log(e.target.project_name.value);
    makeDatabaseAction(
      "insertProject",
      String(e.target.project_name.value),
      parseInt(e.target.adapter_code.value),
      String(e.target.fixture_type.value),
      String(e.target.owner_email.value),
      parseInt(e.target.contacts_limit.value),
      parseInt(e.target.warning_at.value),
      user
    );
  };

  return (
    <div className="cointainer d-flex flex-column justify-content-center align-items-center">
      <div className="d-flex justify-content-around w-50">
        <p className="display-6 text-light text-center">Create a new project</p>
      </div>
      <form
        className="d-flex align-items-center pt-2"
        method="post"
        onSubmit={handleInsertButton}
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
            type="submit"
            className="btn btn-primary fw-bold text-nowrap col"
          >
            Create!
          </button>
        </div>
      </form>
    </div>
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
      .then((result) => result.json())
      .then((resultJson) => {
        console.log(JSON.stringify(resultJson));
        resolve(JSON.stringify(resultJson));
      })
      .catch((err) => {
        console.log(err.message);
        reject(err.message);
      });
  });
};
