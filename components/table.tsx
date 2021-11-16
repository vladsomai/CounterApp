import { useState, useEffect } from "react";

const ProjectsTable = () => {
  const [counterInfoDB, setCounterInfoDB] = useState<any>([]);
  const fetchDataDB = () => {
    fetch("/api/getCounterInfo").then((result) =>
      result.json().then((resultJson) => {
        setCounterInfoDB(resultJson);
        console.log("Fetching data from DB");
      })
    );
  };

  const getDataAsync = async () => {
    setInterval(fetchDataDB, 5000);
  };

  useEffect(() => {
    fetchDataDB();
    getDataAsync();
  }, []);

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
};

export default ProjectsTable;
