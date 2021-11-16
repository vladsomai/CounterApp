// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type CounterInfo = {
  entry_id: number;
  project_name: string;
  adapter_code: number;
  owner_email: string;
  contacts: number;
  contacts_limit: number;
  warning_at: number;
  resets: number;
  last_update: Date;
};

const queryDB: any = () => {
  const mysql = require("mysql");

  return new Promise((resolve, reject) => {
    const con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "3ng1n33r",
      database: "counterdb",
    });

    con.connect(function (err: any) {
      if (err) throw err;
      con.query("select * from projects", function (err: any, result: any) {
        if (err) throw err;
        if (result) 
        {
            con.end();
            resolve(result);
        }
        else reject(result);
      });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return new Promise((resolve,reject)=>{
      queryDB().then((responseFromDB: any) => {
          resolve(res.status(200).json(responseFromDB));
      });
}) 
}
