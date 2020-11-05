import React from "react";
import { Layout, Row, Button, Icon, Card } from "antd";
import PhotoSwipe from "photoswipe";
import PhotoswipeUIDefault from "photoswipe/dist/photoswipe-ui-default";
import "photoswipe/dist/photoswipe.css";
import "photoswipe/dist/default-skin/default-skin.css";
import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import Gallery from "react-photo-gallery";
class GalleryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [
        {
          src: "https://source.unsplash.com/2ShvY8Lf6l0/800x599",
          width: 4,
          height: 3,
        },
        {
          src: "https://source.unsplash.com/Dm-qxdynoEc/800x799",
          width: 1,
          height: 1,
        },
        {
          src: "https://source.unsplash.com/qDkso9nvCg0/600x799",
          width: 3,
          height: 4,
        },
        {
          src: "https://source.unsplash.com/iecJiKe_RNg/600x799",
          width: 3,
          height: 4,
        },
        {
          src: "https://source.unsplash.com/epcsn8Ed8kY/600x799",
          width: 3,
          height: 4,
        },
        {
          src: "https://source.unsplash.com/NQSWvyVRIJk/800x599",
          width: 4,
          height: 3,
        },
        {
          src: "https://source.unsplash.com/zh7GEuORbUw/600x799",
          width: 3,
          height: 4,
        },
        {
          src: "https://source.unsplash.com/PpOHJezOalU/800x599",
          width: 4,
          height: 3,
        },
        {
          src: "https://source.unsplash.com/I1ASdgphUH4/800x599",
          width: 4,
          height: 3,
        },
        {
          src: "https://source.unsplash.com/XiDA78wAZVw/600x799",
          width: 3,
          height: 4,
        },
        {
          src: "https://source.unsplash.com/x8xJpClTvR0/800x599",
          width: 4,
          height: 3,
        },
        {
          src: "https://source.unsplash.com/qGQNmBE7mYw/800x599",
          width: 4,
          height: 3,
        },
        {
          src: "https://source.unsplash.com/NuO6iTBkHxE/800x599",
          width: 4,
          height: 3,
        },
        {
          src: "https://source.unsplash.com/pF1ug8ysTtY/600x400",
          width: 4,
          height: 3,
        },
        {
          src: "https://source.unsplash.com/A-fubu9QJxE/800x533",
          width: 4,
          height: 3,
        },
        {
          src: "https://source.unsplash.com/5P91SF0zNsI/740x494",
          width: 4,
          height: 3,
        },
      ],
    };
  }
  render() {
    const extra = (
      <Button
        type="primary"
        onClick={() => this.props.history.push("/product/addupdate")}
      >
        <Icon type="plus" />
        添加图片
      </Button>
    );
    
    const title = "图片展览";
    return (
      <Layout className="animated fadeIn">
        <div className="gutter-example button-demo">
          <CustomBreadcrumb arr={["商品管理", "商品列表"]}></CustomBreadcrumb>
        </div>
        <Card title={title} extra={extra}>
          <Row>
            <Gallery photos={this.state.photos} direction={"column"} />
          </Row>
        </Card>
      </Layout>
    );
  }
}

export default GalleryView;
