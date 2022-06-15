import type { NextApiRequest, NextApiResponse } from 'next'
import queryDatabase from '../../lib/database'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const reqJSON = JSON.parse(req.body)
  let sqlCommand: string = ''

  switch (reqJSON.action) {
    case 'getProjects':
      console.log('Client asks for data')
      sqlCommand = 'select * from Projects'
      break

    case 'getProjectByID':
      console.log('Client asks for a project')
      sqlCommand = `select * from Projects where entry_id=${reqJSON.entry_id}`
      break

    case 'insertProject':
      console.log('Client asks to insert a project')
      sqlCommand = `call insertProject("${reqJSON.project_name}", ${reqJSON.adapter_code}, "${reqJSON.fixture_type}", "${reqJSON.owner_email}", ${reqJSON.contacts_limit}, ${reqJSON.warning_at}, "${reqJSON.modified_by}");`
      break

    case 'resetCounter':
      console.log('Client asks to reset counter of a project')
      sqlCommand = `call resetCounter(${reqJSON.adapter_code}, "${reqJSON.fixture_type}", "${reqJSON.modified_by}");`
      break

    case 'deleteProject':
      console.log('Client asks to delete a project')
      sqlCommand = `call deleteProject(${reqJSON.adapter_code}, "${reqJSON.fixture_type}");`
      break

    case 'updateOwner':
      console.log('Client asks to update owner email')
      sqlCommand = `call updateEmail(${reqJSON.adapter_code}, "${reqJSON.fixture_type}", "${reqJSON.owner_email}", "${reqJSON.modified_by}");`
      break

    case 'updateContactsLimitAndWarning':
      console.log('Client asks to update contacts limit and warning')
      sqlCommand = `call updateLimitWarning(${reqJSON.adapter_code}, "${reqJSON.fixture_type}", ${reqJSON.contacts_limit},${reqJSON.warning_at} ,"${reqJSON.modified_by}");`
      break

    default:
      console.log('Client asks for an unknown commad')
      sqlCommand = ''
      break
  }

  return new Promise((resolve, reject) => {
    queryDatabase(sqlCommand)
      .then((result) =>
        resolve(res.status(200).json({ message: result, status: 200 })),
      )
      .catch((err) => {
        console.log(err)
        resolve(res.status(500).json({ message: err, status: 500 }))
      })
  })
}
