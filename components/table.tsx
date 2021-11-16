import { useState, useEffect, useRef } from "react";

const ProjectsTable = () => {
  const [counterInfoDB, setCounterInfoDB] = useState<any>([]);
  const [API_Responded, setAPI_Responded] = useState<any>(false);
  const isMounted = useRef(false);

  const fetchDataDB = () => {
    const controller = new AbortController();

    // 5 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    setAPI_Responded(false);
    fetch("/api/getCounterInfo", { signal: controller.signal })
      .then((result) =>
        result.json().then((resultJson) => {
          setCounterInfoDB(resultJson);
          setAPI_Responded(true);
        })
      )
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getDataAsync = async () => {
      const intervalID = setInterval(fetchDataDB, 5000);
      if (isMounted.current === false) clearInterval(intervalID);
    };

    fetchDataDB();
    getDataAsync();

    //keep track of component mount to cancel fetch request
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (API_Responded) {
    return (
      <div className="table-responsive">
        <table className="table table-sm table-striped table-hover mt-5 table-secondary fw-bold border-dark table-bordered text-center">
          <thead>
            <tr className="fs-5">
              <th className="bg-primary">Project name</th>
              <th className="bg-primary">Adapter code</th>
              <th className="bg-primary">Owner email</th>
              <th className="bg-primary">Number of contacts</th>
              <th className="bg-primary">Limit</th>
              <th className="bg-primary">Warning</th>
              <th className="bg-primary">Resets</th>
              <th className="bg-primary">Last update</th>
            </tr>
          </thead>
          <tbody>
            {counterInfoDB.map((Project: any) => {
              return (
                <tr key={counterInfoDB.indexOf(Project)}>
                  <td>{Project.project_name}</td>
                  <td>{Project.adapter_code}</td>
                  <td>{Project.owner_email}</td>
                  <td>{Project.contacts}</td>
                  <td>{Project.contacts_limit}</td>
                  <td>{Project.warning_at}</td>
                  <td>{Project.resets}</td>
                  <td>
                    {Project.last_update.substring(0, 10)} &nbsp;{" "}
                    {Project.last_update.substring(12, 19)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <p className="display-3 text-danger fw-bolder w-750 m-auto">
        Could not connect to server, please check your internet connection!
      </p>
    );
  }
};

export default ProjectsTable;
