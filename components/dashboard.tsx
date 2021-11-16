import Card from "../components/card";

const Dashboard = () => {
  return (
    <>
      <div className="d-flex justify-content-around">
        <button className="btn btn-secondary rounded-top rounded-end rounded-pill">
          <Card
            displayText="View projects"
            picturePath="/undraw_reviewed_docs_re_9lmr.svg"
            pictureHeight={250}
            pictureWidth={360}
          ></Card>
        </button>
        <button className="btn btn-danger rounded-top rounded-start rounded-pill">
          <Card
            displayText="Edit projects"
            picturePath="/undraw_control_panel_re_y3ar.svg"
            pictureHeight={250}
            pictureWidth={360}
          ></Card>
        </button>
      </div>
    </>
  );
};

export default Dashboard;
