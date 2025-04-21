import React, { useState } from "react";
import { useLocation, Link, Outlet } from "react-router-dom";
import { Layout, Menu, FloatButton } from "antd";

const { Header, Content, Footer } = Layout;

function Navbar() {
  const location = useLocation();
  const [current, setCurrent] = useState(location.pathname);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "PDF", path: "/upload-pdf" },
    { label: "ChatBot", path: "/chatbot" },
    { label: "Stream", path: "/stream" },
  ];

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  return (
    <>
      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
        <FloatButton.BackTop title="Back to top" />
      </FloatButton.Group>
      <Layout style={{ minHeight: "100vh" }}>
        <div style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <Header
            style={{
              height: "auto",
              width: "100%",
              background: "#e9e8e6",
              padding: "10px 15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <>
                <h1
                  style={{
                    margin: 0,
                    fontSize: "2rem",
                    letterSpacing: "2px",
                    fontFamily: "Raleway",
                    // zIndex: 10,
                    color: "#3c3b39",
                    fontWeight: "lighter",
                  }}
                >
                  <Link
                    to="/"
                    style={{
                      textDecoration: "none",
                      color: "#3c3b39",
                      borderBottom: "2px solid #2a75d7",
                    }}
                  >
                    2.0
                  </Link>
                </h1>
              </>
            </div>
            <>
              {" "}
              <Menu
                theme="light"
                mode="horizontal"
                selectedKeys={[current]}
                onClick={handleClick}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  fontSize: "15px",
                  fontWeight: "lighter",
                  background: "rgb(0,0,0,0)",
                  borderColor: "rgb(0,0,0,0)",
                  fontFamily: "Raleway",
                }}
              >
                {navItems.map((item) => (
                  <Menu.Item key={item.path}>
                    <Link
                      to={item.path}
                      style={{
                        color: "#3c3b39",
                        textDecoration: "none",
                      }}
                    >
                      {item.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu>
            </>
          </Header>
        </div>
        {/* Main Content */}
        <Content
          style={{
            padding: "10px 10px",
            minHeight: "calc(100vh - 64px - 70px)",
          }}
        >
          <Outlet />
        </Content>
        {/* Footer */}
        <Footer
          style={{
            padding: "0px 0px",
            margin: "0px 0px",
            background: "#eae9e7",
          }}
        ></Footer>
      </Layout>
    </>
  );
}

export default Navbar;
