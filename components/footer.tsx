const Footer = () => {
  const currentDate:Date = new Date(); 

  return (
    <footer>
      <p className="fw-normal text-light d-flex justify-content-center pt-4 fs-6">
        &copy;&nbsp;Continental Automotive Romania&nbsp;- {currentDate.getFullYear()}
      </p>
    </footer>
  );
};
export default Footer;
