import React from "react";

function Footer() {
  return (
    <footer
      className="mt-4"
      style={{
        position: "fixed",
        left: "0",
        bottom: "0",
        display: "flex",
        zIndex: "9999999",
        justifyContent: "space-between",
        background: "white",
        width: "100%",
      }}
    >
      <p className="copyright">
        Copyrights 2023 © Flask IT Solutions Private Limited. All Rights Reserved
      </p>
      <p className="credit">
        <a href="https://flaskitsolutions.com" target="_blank">
          {" "}
          Designed & Developed by FIT Solutions{" "}
        </a>
      </p>
    </footer>
  );
}

export default Footer;
