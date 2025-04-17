import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Spin,
  Upload,
  Typography,
  List,
  Switch,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

const { Title, Paragraph } = Typography;

function UploadPdf() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchUploads = async () => {
    try {
      const res = await axios.get("getUploads", {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        const fetchedUploads = res.data.results;
        setData(fetchedUploads);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message || "Something went wrong",
      });
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const createOpenLink = (fileId, fileName) => {
    const url = `http://localhost:3001/back/file/${fileId}`;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          e.preventDefault();
          setLoading(true);
          fetch(url)
            .then((response) => {
              if (!response.ok) throw new Error("Failed to fetch the file");
              return response.blob();
            })
            .then((blob) => {
              setLoading(false);
              const blobUrl = window.URL.createObjectURL(blob);
              window.open(blobUrl, "_blank");
            })
            .catch((error) => {
              setLoading(false);
              console.error("Error fetching the file:", error);
              Swal.fire({
                icon: "error",
                title: "Failed",
                text: error.message || "Something went wrong",
              });
            });
        }}
      >
        Open {fileName}
      </a>
    );
  };

  return (
    <>
      <div>
        {" "}
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          Upload your PDF document
        </Title>
        <Card>
          <Upload
            accept="application/pdf"
            customRequest={({ file, onSuccess, onError }) => {
              if (file.type !== "application/pdf") {
                Swal.fire({
                  icon: "warning",
                  title: "Invalid File",
                  text: "Please upload a PDF file only.",
                });
                onError("Invalid file type");
                return;
              }

              const formData = new FormData();
              formData.append("file", file);

              axios
                .post("/uploadFiles", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                })
                .then(() => {
                  onSuccess("ok");
                  Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: `${file.name} uploaded successfully`,
                  });
                  fetchUploads();
                })
                .catch((err) => {
                  onError(err);
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `${file.name} upload failed.`,
                  });
                });
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Card>
        {loading && (
          <Spin
            size="large"
            style={{ display: "block", margin: "40px auto" }}
          />
        )}
        {!loading && data.length > 0 && (
          <div style={{ padding: "30px 20px" }}>
            <Title
              level={2}
              style={{ textAlign: "center", marginBottom: "30px" }}
            >
              Uploaded PDFs
            </Title>
            <List
              grid={{ gutter: 24, column: 1 }}
              dataSource={data}
              renderItem={(pdf, index) => (
                <List.Item key={pdf._id}>
                  <Card
                    title={
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Title level={4} style={{ margin: 0 }}>
                            {index + 1}. {pdf.filename}
                          </Title>
                        </Col>
                        <Col>
                          <span style={{ marginRight: 8 }}>Expand Summary</span>
                          <Switch
                            checked={!!expandedItems[pdf._id]}
                            onChange={() => toggleExpand(pdf._id)}
                          />
                        </Col>
                      </Row>
                    }
                    hoverable
                    style={{ borderRadius: "10px" }}
                  >
                    <Paragraph
                      ellipsis={
                        expandedItems[pdf._id]
                          ? false
                          : { rows: 2, expandable: false }
                      }
                      style={{ marginBottom: 16 }}
                    >
                      {pdf.summary}
                    </Paragraph>
                    <div>{createOpenLink(pdf._id, pdf.filename)}</div>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default UploadPdf;
