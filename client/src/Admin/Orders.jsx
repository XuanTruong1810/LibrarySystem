import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBInput,
} from "mdb-react-ui-kit";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import debounce from "lodash/debounce";
import FormItem from "antd/es/form/FormItem";
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();
  const getAllOrders = async () => {
    let response = await axios.get(
      "http://localhost:5076/api/Borrowing/GetAllOrder"
    );
    if (response.data) {
      setOrders(response.data);
      setFilteredOrders(response.data);
    }
  };

  const handleAccept = async (id) => {
    try {
      let response = await axios({
        method: "put",
        url: "http://localhost:5076/api/Manager/AcceptOrder",
        params: {
          id,
        },
        withCredentials: true,
      });

      if (response.data) {
        getAllOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcceptBorrow = async (id) => {
    try {
      let response = await axios({
        method: "put",
        url: "http://localhost:5076/api/Manager/AcceptOrderBorrowBook",
        params: {
          id,
        },
        withCredentials: true,
      });

      if (response.data) {
        getAllOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const BookReturned = async (id) => {
    try {
      let response = await axios({
        method: "put",
        url: "http://localhost:5076/api/Manager/BookReturned",
        params: {
          id,
        },
        withCredentials: true,
      });

      if (response.data) {
        getAllOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDefault = (id, statusCode) => {
    navigate(`/Admin/OrderDetail/${id}/${statusCode}`);
  };
  useEffect(() => {
    getAllOrders();
  }, []);
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const [value, setValue] = useState([]);

  let key;
  function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);
    const fetchRef = useRef(0);
    const debounceFetcher = useMemo(() => {
      const loadOptions = (value) => {
        if (value.trim() !== "") {
          key = value;
        }
        fetchRef.current += 1;
        const fetchId = fetchRef.current;
        setOptions([]);
        setFetching(true);
        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            return;
          }
          setOptions(newOptions);
          setFetching(false);
        });
      };
      return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
        options={options}
      />
    );
  }
  async function getProduct() {
    console.log(key);
    try {
      let response = await axios.get(
        "http://localhost:5076/api/Product/SearchProduct",
        {
          params: {
            KeySearch: key,
          },
        }
      );
      return response.data.map((data) => ({
        label: data.Name_Product,
        value: data.ID_Product,
      }));
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error;
    }
  }
  const [detail, setDetail] = useState([]);

  const handleCount = (key, value) => {
    const itemIndex = detail.findIndex((item) => item.ID_Product === key);
    if (itemIndex !== -1) {
      const updatedDetail = [...detail];
      updatedDetail[itemIndex].count = value;
      setDetail(updatedDetail);
    } else {
      const updatedDetail = [
        ...detail,
        {
          count: value,
          ID_Product: key,
        },
      ];
      setDetail(updatedDetail);
    }
  };

  const dataSource = value.map((v) => {
    const itemIndex = detail.findIndex((item) => item.ID_Product === v.key);
    const productCount = itemIndex !== -1 ? detail[itemIndex].count : 1;
    return {
      key: v.key,
      name: v.label,
      count: (
        <InputNumber
          min={1}
          defaultValue={productCount}
          onChange={(value) => handleCount(v.key, value)}
        />
      ),
    };
  });
  useEffect(() => {
    const updatedDetail = detail.filter((item) => {
      return value.find((v) => v.key === item.ID_Product);
    });
    setDetail(updatedDetail);
  }, [value]);

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
    },
  ];
  const [idUser, setIDUser] = useState("");
  const Submit = async () => {
    if (!idUser || idUser === "") {
      message.error("Vui lòng chọn mã người dùng.");
      return;
    }
    if (!value || value.length === 0) {
      message.error("Vui lòng chọn ít nhất một sản phẩm để mượn.");
      return;
    }
    for (const item of detail) {
      if (!item.count || item.count <= 0) {
        message.error("Vui lòng nhập số lượng hợp lệ cho tất cả sản phẩm.");
        return;
      }
    }
    const data = {
      BorrowingDetailsModel: detail.map((item) => ({
        CountBorrowing: item.count,
        ID_Product: item.ID_Product,
      })),
    };
    console.log(data);
    try {
      let response = await axios.post(
        "http://localhost:5076/api/Manager/BorrowBook",
        data,
        {
          params: {
            id: idUser,
          },
          withCredentials: true,
        }
      );
      if (response.data) {
        message.success("Thành công");
        setUser([]);
        setValue([]);
        setDetail([]);
        setOpen(false);
        getAllOrders();
      }
    } catch (error) {
      console.log(error);
      message.error("Lỗi");
      setOpen(false);
    }
  };

  const onChange = (value) => {
    setIDUser(value);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const filterOption = (input, option) => {
    return (option?.label.toString() ?? "").includes(input);
  };
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5076/api/ReqCart/GetCart",
          {
            withCredentials: true,
          }
        );
        if (response.data) {
          console.log(response.data);
          const options = response.data.map((user) => ({
            value: user.Id,
            label: user.UserName,
          }));
          setUser(options);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [open]);

  const handleOnchange = (value) => {
    console.log(value);
    const normalizedKeyword = value.toLowerCase();
    const filtered = orders.filter((order) =>
      order.UserName.toLowerCase().includes(normalizedKeyword)
    );
    setFilteredOrders(filtered);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <MDBBtn onClick={showDrawer}>Thêm mượn sách</MDBBtn>
        <div style={{ width: "400px" }}>
          <MDBInput
            onChange={(e) => handleOnchange(e.target.value)}
            label="Tìm kiếm người dùng"
            type="text"
          />
        </div>
      </div>
      <Drawer
        title="Thêm mượn sách"
        width={720}
        placement="right"
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Thoát</Button>
            <Button onClick={Submit} type="primary">
              Xác nhận
            </Button>
          </Space>
        }
      >
        <Form>
          <Form.Item label="Mã người dùng">
            <Select
              showSearch
              placeholder="Chọn mã người dùng"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={user}
            />
          </Form.Item>
          <Form.Item label="Sản phẩm">
            <DebounceSelect
              mode="multiple"
              value={value}
              placeholder="Chọn sản phẩm"
              fetchOptions={getProduct}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
        </Form>
        <Table dataSource={dataSource} columns={columns} />
      </Drawer>
      <MDBTable align="middle">
        <MDBTableHead>
          <tr>
            <th scope="col">Tên người dùng</th>
            <th scope="col">Ngày đặt</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Chức năng</th>
          </tr>
        </MDBTableHead>

        <MDBTableBody>
          {filteredOrders.map((order) => {
            return (
              <tr key={order.ID_Loans}>
                <td>
                  <p className="fw-normal mb-1">{order.UserName}</p>
                </td>

                <td>
                  <p className="fw-normal mb-1">
                    {moment(order.BorrowingDay).format("DD/MM/YYYY")}
                  </p>
                </td>
                <td>
                  {order.Status === 0 && (
                    <MDBBadge color="warning" pill>
                      Chưa xác nhận
                    </MDBBadge>
                  )}
                  {order.Status === 1 && (
                    <MDBBadge color="primary" pill>
                      Đã xác nhận
                    </MDBBadge>
                  )}
                  {order.Status === 2 && (
                    <MDBBadge color="success" pill>
                      Đang mượn sách
                    </MDBBadge>
                  )}
                  {order.Status === 3 && (
                    <MDBBadge color="info" pill>
                      Đã trả sách
                    </MDBBadge>
                  )}
                  {order.Status === 4 && (
                    <MDBBadge color="danger" pill>
                      Đã quá hạn
                    </MDBBadge>
                  )}
                </td>

                <td>
                  <MDBDropdown>
                    <MDBDropdownToggle>Xác nhận</MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem
                        disabled={order.Status >= 1}
                        aria-disabled={order.Status >= 1}
                        onClick={() =>
                          order.Status < 2 ? handleAccept(order.ID_Loans) : {}
                        }
                        link
                      >
                        Xác nhận mượn sách
                      </MDBDropdownItem>
                      <MDBDropdownItem
                        disabled={order.Status >= 2}
                        aria-disabled={order.Status >= 2}
                        onClick={() =>
                          order.Status < 3
                            ? handleAcceptBorrow(order.ID_Loans)
                            : {}
                        }
                        link
                      >
                        Xác nhận mượn
                      </MDBDropdownItem>
                      <MDBDropdownItem
                        disabled={order.Status >= 3}
                        aria-disabled={order.Status >= 3}
                        onClick={() =>
                          order.Status < 4 ? BookReturned(order.ID_Loans) : {}
                        }
                        link
                      >
                        Xác nhận trả sách
                      </MDBDropdownItem>
                      <MDBDropdownItem
                        disabled={order.Status === 3}
                        aria-disabled={order.Status === 3}
                        onClick={() =>
                          order.Status < 5 ? BookReturned(order.ID_Loans) : {}
                        }
                        link
                      >
                        Xác nhận trả sách quá hạn
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                  <MDBBtn
                    color="link"
                    rounded
                    size="sm"
                    onClick={() => handleDefault(order.ID_Loans, order.Status)}
                  >
                    Chi tiết
                  </MDBBtn>
                </td>
              </tr>
            );
          })}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}
