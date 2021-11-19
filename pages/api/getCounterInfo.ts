import type { NextApiRequest, NextApiResponse } from "next";

const queryDB: any = (sqlCommand: string) => {
  const mysql = require("mysql");

  return new Promise((resolve, reject) => {
    try {
      const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "3ng1n33r",
        database: "counterdb",
      });

      con.connect(function (connectionErr: any) {
        if (connectionErr) throw connectionErr;
        con.query(
          { sql: sqlCommand, timeout: 2000 },
          function (queryErr: any, result: any) {
            if (queryErr) throw queryErr;
            if (result) {
              con.end();
              resolve(result);
            } else reject(queryErr.message);
          }
        );
      });
    } catch (allErrors: any) {
      reject(allErrors.message);
    }
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const reqJSON = JSON.parse(req.body);
 
  console.log(reqJSON);
  switch (reqJSON.action) {
    case "getProjects":
      console.log("Client asks for data");
      return new Promise((resolve, reject) => {
        queryDB("select * from projects")
          .then((responseFromDB: any) => {
            resolve(res.status(200).json(responseFromDB));
          })
          .catch((err: any) => {
            reject(res.status(500).json(err));
          });
      });
    case "insertProject":
      console.log("Client asks to insert a project");

      return new Promise((resolve, reject) => {
        queryDB(
          `call insertProject("${reqJSON.project_name}", ${reqJSON.adapter_code}, "${reqJSON.fixture_type}", "${reqJSON.owner_email}", ${reqJSON.contacts_limit}, ${reqJSON.warning_at}, "${reqJSON.modified_by}");`
        )
          .then((responseFromDB: any) => {
            console.log("response from db", responseFromDB[0][0]);
            resolve(res.status(200).json(responseFromDB[0]));
          })
          .catch((err: any) => {
            reject(res.status(500).json(err));
          });
      });
    case "resetCounter":
      console.log("Client asks to reset counter of a project");

      return new Promise((resolve, reject) => {
        queryDB(
          `call resetCounter(${reqJSON.adapter_code}, "${reqJSON.fixture_type}", "${reqJSON.modified_by}");`
        )
          .then((responseFromDB: any) => {
            console.log("response from db", responseFromDB);
            resolve(res.status(200).json(responseFromDB));
          })
          .catch((err: any) => {
            reject(res.status(500).json(err));
          });
      });
    case "deleteProject":
      console.log("Client asks to delete a project");

      return new Promise((resolve, reject) => {
        queryDB(
          `call deleteProject(${reqJSON.adapter_code}, "${reqJSON.fixture_type}");`
        )
          .then((responseFromDB: any) => {
            console.log("response from db", responseFromDB);
            resolve(res.status(200).json(responseFromDB));
          })
          .catch((err: any) => {
            reject(res.status(500).json(err));
          });
      });
  }
}
