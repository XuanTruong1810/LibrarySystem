import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MDBBadge,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import axios from "axios";
import moment from "moment";
export default function LibraryCart() {
  const [libraryCarts, setLibraryCarts] = useState([]);
  const getAllLibraryCarts = async () => {
    let response = await axios.get(
      "http://localhost:5076/api/Manager/GetAllCart",
      {
        withCredentials: true,
      }
    );
    if (response.data) {
      setLibraryCarts(response.data);
    }
  };

  const handleAccept = async (id) => {
    try {
      let response = await axios({
        method: "put",
        url: "http://localhost:5076/api/Manager/AcceptLibraryCart",
        params: {
          id,
        },
        withCredentials: true,
      });

      if (response.data) {
        getAllLibraryCarts();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAcceptBorrow = async (id) => {
    try {
      let response = await axios({
        method: "put",
        url: "http://localhost:5076/api/Manager/AcceptGetsLibraryCart",
        params: {
          id,
        },
        withCredentials: true,
      });

      if (response.data) {
        getAllLibraryCarts();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllLibraryCarts();
  }, []);

  return (
    <div>
      <MDBTable align="middle">
        <MDBTableHead>
          <tr>
            <th scope="col">Mã thẻ</th>
            <th scope="col">Tên người dùng</th>
            <th scope="col">Ngày cấp thẻ</th>
            <th scope="col">Ngày hết hạn</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Chức năng</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {libraryCarts.map((libraryCart) => {
            return (
              <tr key={libraryCart.ID_LibraryCart}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="ms-3">
                      <p className="fw-bold mb-1">
                        {libraryCart.ID_LibraryCard}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="fw-normal mb-1">{libraryCart.Username}</p>
                </td>

                <td>
                  <p className="fw-normal mb-1">
                    {moment(libraryCart.ProductionDate).format("DD/MM/YYYY")}
                  </p>
                </td>
                <td>
                  <p className="fw-normal mb-1">
                    {moment(libraryCart.ExpirationDate).format("DD/MM/YYYY")}
                  </p>
                </td>
                <td>
                  {libraryCart.Status === 0 && (
                    <MDBBadge color="warning" pill>
                      Không yêu cầu cấp thẻ
                    </MDBBadge>
                  )}
                  {libraryCart.Status === 1 && (
                    <MDBBadge color="warning" pill>
                      Chưa xác nhận
                    </MDBBadge>
                  )}
                  {libraryCart.Status === 2 && (
                    <MDBBadge color="primary" pill>
                      Đã xác nhận
                    </MDBBadge>
                  )}
                  {libraryCart.Status === 3 && (
                    <MDBBadge color="success" pill>
                      Đã nhận thẻ
                    </MDBBadge>
                  )}
                  {libraryCart.Status === 4 && (
                    <MDBBadge color="info" pill>
                      Đã quá hạn
                    </MDBBadge>
                  )}
                  {libraryCart.Status === 5 && (
                    <MDBBadge color="danger" pill>
                      Đã khóa thẻ
                    </MDBBadge>
                  )}
                </td>

                <td>
                  <MDBDropdown>
                    <MDBDropdownToggle>Xác nhận</MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem
                        disabled={libraryCart.Status >= 2}
                        aria-disabled={libraryCart.Status >= 2}
                        onClick={() =>
                          libraryCart.Status < 3
                            ? handleAccept(libraryCart.ID_LibraryCard)
                            : {}
                        }
                        link
                      >
                        Xác nhận cấp thẻ
                      </MDBDropdownItem>
                      <MDBDropdownItem
                        disabled={libraryCart.Status >= 3}
                        aria-disabled={libraryCart.Status >= 3}
                        onClick={() =>
                          libraryCart.Status < 4
                            ? handleAcceptBorrow(libraryCart.ID_LibraryCard)
                            : {}
                        }
                        link
                      >
                        Xác nhận đã lấy thẻ
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </td>
              </tr>
            );
          })}
        </MDBTableBody>
      </MDBTable>
    </div>
  );
}
