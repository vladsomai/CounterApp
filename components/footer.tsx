const Footer = () => {
  const currentDate:Date = new Date(); 

  return (
    <footer>
      <p className="text-light text-center m-0">
        &copy;&nbsp;Continental Automotive Romania&nbsp;- {currentDate.getFullYear()}
      </p>
    </footer>
  );
};
export default Footer;
