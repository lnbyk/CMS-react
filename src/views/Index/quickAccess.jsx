import React from "react";
import { Icon, Button, Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
export default class QuickAccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row gutter={16} id="quickAccess" style={{backgroundColor: "white"}}>
        {this.props.menu &&
          this.props.menu.map((aa) => {
            return (
              aa.subs &&
              aa.subs.map((val) => {
                return (
                  <Col xs={8} md={4} style={{ marginBottom: "1%",marginTop:'0.5%' }}>
                    <Link to={val.key}>
                      <Card>
                        {val.icon && (
                          <Icon type={val.icon} className="icon-style" />
                        )}
                        <span>{val.title}</span>
                      </Card>
                    </Link>
                  </Col>
                );
              })
            );
          })}
      </Row>
    );
  }
}
