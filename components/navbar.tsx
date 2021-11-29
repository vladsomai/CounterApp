import Image from "next/image";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status } = useSession();


  return (
    <nav className="container d-flex justify-content-md-around ">
      <Image
        src="/ContiPic.PNG"
        width={300}
        height={90}
        alt="continentalPicture"
        className="d-none d-md-block"
      ></Image>
      <ul className="list-unstyled display-6 d-flex mt-3">
        <li className="me-5">
          <Link href="/">
            <button className="btn btn-primary btn-lg fw-bold fs-3">Dashboard</button>
          </Link>
        </li>

        {session ? (
          <li>
            <Link href="" passHref={true}>
              <button className="btn btn-primary btn-lg fw-bold fs-3" onClick={()=>signOut()}>Sign out</button>
            </Link>
          </li>
        ) : (
          <li>
            <Link href="/signin" passHref={true}>
              <button className="btn btn-primary btn-lg fw-bold fs-3">Sign in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};
export default Navbar;
