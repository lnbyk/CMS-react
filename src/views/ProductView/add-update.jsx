import React, { PureComponent } from "react";
import { Card, Icon, Form, Input, Cascader, Button, message, Row, Col, notification} from "antd";

import PicturesWall from "./pictures-wall";
import RichTextEditor from "./rich-text-editor";
import LinkButton from "../../components/link-button";
import { reqCategorys, reqAddOrUpdateProduct } from "../../api";
import memoryUtils from "../../utils/memoryUtils";

const { Item } = Form;
const { TextArea } = Input;

/*
Product的添加和更新的子路由组件
 */
class ProductAddUpdate extends PureComponent {
  state = {
    options: [],
  };

  constructor(props) {
    super(props);

    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef();
    this.editor = React.createRef();
  }

  initOptions = async (categorys) => {
    // 根据categorys生成options数组
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }));

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));

      // 找到当前商品对应的一级option对象
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );

      // 关联对应的一级option上
      targetOption.children = childOptions;
    }

    // 更新options状态
    this.setState({
      options,
    });
  };

  /*
  异步获取一级/二级分类列表, 并显示
  async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
   */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId); // {status: 0, data: categorys}
    if (result.status === 0) {
      const categorys = result.data;
      // 如果是一级分类列表
      if (parentId === "0") {
        this.initOptions(categorys);
      } else {
        // 二级列表
        return categorys; // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  };

  /*
  验证价格的自定义验证函数
   */
  validatePrice = (rule, value, callback) => {
    console.log(value, typeof value);
    if (value * 1 > 0) {
      callback(); // 验证通过
    } else {
      callback("价格必须大于0"); // 验证没通过
    }
  };

  /*
  用加载下一级列表的回调函数
   */
  loadData = async (selectedOptions) => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0];
    // 显示loading
    targetOption.loading = true;

    // 根据选中的分类, 请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    // 隐藏loading
    targetOption.loading = false;
    // 二级分类数组有数据
    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      // 关联到当前option上
      targetOption.children = childOptions;
    } else {
      // 当前选中的分类没有二级分类
      targetOption.isLeaf = true;
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    });
  };


  onDelete = () => {
    notification.open("😭");
  }

  submit = () => {
    // 进行表单验证, 如果通过了, 才发送请求
    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        // 1. 收集数据, 并封装成product对象
        const { name, desc, price, categoryIds } = values;
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
          pCategoryId = "0";
          categoryId = categoryIds[0];
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const imgs = this.pw.current.getImgs();
        const detail = this.editor.current.getDetail();

        const product = {
          name,
          desc,
          price,
          imgs,
          detail,
          pCategoryId,
          categoryId,
        };

        // 如果是更新, 需要添加_id
        if (this.isUpdate) {
          product._id = this.product._id;
        }

        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product);

        // 3. 根据结果提示
        if (result.status === 0) {
          message.success(`${this.isUpdate ? "更新" : "添加"}商品成功!`);
          this.props.history.goBack();
        } else {
          message.error(`${this.isUpdate ? "更新" : "添加"}商品失败!`);
        }
      }
    });
  };

  componentDidMount() {
    this.getCategorys("0");
  }

  componentWillMount() {
    // 取出携带的state
    const product = memoryUtils.product; // 如果是添加没值, 否则有值
    // 保存是否是更新的标识
    this.isUpdate = !!product._id;
    // 保存商品(如果没有, 保存是{})
    this.product = product || {};
  }

  /*
  在卸载之前清除保存的数据
  */
  componentWillUnmount() {
    memoryUtils.product = {};
  }

  render() {
    const { isUpdate, product } = this;
    const { pCategoryId, categoryId, imgs, detail } = product;
    // 用来接收级联分类ID的数组
    const categoryIds = [];
    if (isUpdate) {
      // 商品是一个一级分类的商品
      if (pCategoryId === "0") {
        categoryIds.push(categoryId);
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }

    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 }, // 左侧label的宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
    };

    // 头部左侧标题
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{ fontSize: 20 }} />
        </LinkButton>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );

    const { getFieldDecorator } = this.props.form;

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              initialValue: product.name,
              rules: [{ required: true, message: "必须输入商品名称" }],
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              initialValue: product.desc,
              rules: [{ required: true, message: "必须输入商品描述" }],
            })(
              <TextArea
                placeholder="请输入商品描述"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              initialValue: product.price,
              rules: [
                { required: true, message: "必须输入商品价格" },
                { validator: this.validatePrice },
              ],
            })(
              <Input
                type="number"
                placeholder="请输入商品价格"
                addonAfter="元"
              />
            )}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categoryIds", {
              initialValue: categoryIds,
              rules: [{ required: true, message: "必须指定商品分类" }],
            })(
              <Cascader
                placeholder="请指定商品分类"
                options={this.state.options} /*需要显示的列表数据数组*/
                loadData={
                  this.loadData
                } /*当选择某个列表项, 加载下一级列表的监听回调*/
              />
            )}
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.pw} imgs={imgs} />
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            <RichTextEditor ref={this.editor} detail={detail} />
          </Item>
          <Item>
            <Row>
              <Col xs={24} md={6} offset={6}>
              <Button type="primary" onClick={this.submit}>
                提交
              </Button>
              </Col>
              <Col xs={24} md={12}>
              <Button type="primary" onClick={this.onDelete}>
                删除
              </Button>
              </Col>
            </Row>
          </Item>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(ProductAddUpdate);

/*
1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件, 子组件就可以调用
2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象), 调用其方法
 */

/*
使用ref
1. 创建ref容器: thi.pw = React.createRef()
2. 将ref容器交给需要获取的标签元素: <PictureWall ref={this.pw} />
3. 通过ref容器读取标签元素: this.pw.current
 */
