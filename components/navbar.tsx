import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="" role="navigation">
      <div className="container d-md-flex justify-content-between">
        <Link href="/" passHref={false}>
          <Image
            src="/ContiPic.PNG"
            width={300}
            height={20}
            alt="continentalPicture"
            className="d-none d-md-inline btn img-fluid"
          ></Image>
        </Link>
        <ul className="list-unstyled display-6 d-flex pt-md-3 justify-content-center pb-4 pb-md-0">
          <li className="nav-item me-md-5">
            <Link href="/" passHref={true}>
              <button type="button" className="btn btn-primary fw-bold fs-3">
                Dashboard
              </button>
            </Link>
          </li>

          {session ? (
            <li className="nav-item">
              <Link href="" passHref={true}>
                <button
                  className="btn btn-primary fw-bold fs-3 "
                  onClick={() => signOut()}
                >
                  Sign out
                </button>
              </Link>
            </li>
          ) : (
            <li className="nav-item">
              <Link href="/signin" passHref={true}>
                <button className="btn btn-primary fw-bold fs-3">
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
