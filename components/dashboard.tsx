import Card from "../components/card";
import Link from "next/link";
import Image from "next/image";

const Dashboard = () => {
  return (
    <>
      <div className="d-flex flex-column justify-content-center pt-5 fullScreen">
        <div className="d-flex justify-content-center">
          <div className="bg-dark rounded-bottom rounded-pill">
            <p className="display-6 text-light text-center">
              Welcome to the line counter tool !
            </p>
            <Image
              src="/undraw_welcome_re_h3d9.svg"
              height={250}
              width={800}
              alt="Welcome Picture"
              priority
              //   className="animate__animated animate__tada"
            ></Image>
          </div>
        </div>
        <div className="d-flex justify-content-center pt-5">
          <Link href="/viewprojects" passHref={true}>
            <button className="btn btn-secondary rounded-top rounded-end rounded-pill">
              <Card
                displayText="View projects"
                picturePath="/undraw_reviewed_docs_re_9lmr.svg"
                pictureHeight={250}
                pictureWidth={360}
              ></Card>
            </button>
          </Link>
          <Link href="/editprojects" passHref={true}>
            <button className="btn btn-danger rounded-top rounded-start rounded-pill">
              <Card
                displayText="Edit projects"
                picturePath="/undraw_control_panel_re_y3ar.svg"
                pictureHeight={250}
                pictureWidth={360}
              ></Card>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
