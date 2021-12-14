import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="" role="navigation">
      <div className="container d-flex justify-content-around align-items-center">
        {!session ? (
          <Link href="/" passHref>
            <a className="btn scaleEffect">
              <Image
                src="/ContiPic.PNG"
                width={200}
                height={60}
                alt="continentalPicture"
                className="img-fluid w-50"
              ></Image>
            </a>
          </Link>
        ) : (
          <Link href="/editprojects" passHref>
            <a className="btn scaleEffect">
              <Image
                src="/ContiPic.PNG"
                width={200}
                height={60}
                alt="continentalPicture"
                className="img-fluid"
              ></Image>
            </a>
          </Link>
        )}

        <ul className="list-unstyled display-6 d-flex pt-3 pb-4 pb-md-0 justify-content-around align-items-center">
          {session ? (
            <li className="nav-item pt-3 pt-md-0">
              <Link href="" passHref={true}>
                <button
                  className="btn btn-primary fw-bold fs-3 scaleEffect"
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </Link>
            </li>
          ) : (
            <li className="nav-item pt-3 pt-md-0">
              <Link href="/signin" passHref={true}>
                <button className="btn btn-primary fw-bold fs-3 scaleEffect">
                  Sign in
                </button>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
