import React, { useState, useEffect } from "react";
import { Button, Modal, ModalFooter, ModalHeader, FormGroup, Label, Input, Spinner } from "reactstrap";
import axios from 'axios';
import Swal from 'sweetalert2'
// import "./main-page.style.scss";

const url = "http://localhost:8081";
const ModalMovie = props => {
  const { isOpen, setIsOpen, action, setAction, getData } = props;

  const [dataPayload, setDataPayload] = useState({});
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if(isOpen) setDataPayload(isOpen)
  }, [isOpen])

  const handleCloseModal = () => {
    setIsOpen("")
    setAction("")
  }
  const handleUpdate = async () => {
    setLoadingUpdate(true)
    let error = "";
    try {
      await axios.put(`${url}/barang/update`, dataPayload)
    } catch(e){
      console.log(e)
      error = e.message
    }
    setTimeout(() => {
      setLoadingUpdate(false);
      if(error) Swal.fire("Gagal", error, "error")
      else Swal.fire("Berhasil", "Berhasil Update Data", "success");
    }, 800);
  }
  const handleDelete = async () => {
    setLoadingDelete(true);
    let error = "";
    try {
      await axios.delete(`${url}/barang/hapus/${dataPayload.product_no}`);
    } catch (e) {
      console.log(e);
      error = e.message;
    }
    setTimeout(() => {
      setLoadingDelete(false);
      getData();
      if (error) Swal.fire("Gagal", error, "error");
      else Swal.fire("Berhasil", "Berhasil Hapus Data", "success");
      handleCloseModal()
    }, 800);
  }
  const handleInsert = async () => {
    setLoadingUpdate(true);
    let error = "";
    dataPayload.product_price = parseInt(dataPayload.product_price);
    dataPayload.product_no = parseInt(dataPayload.product_no);
    try {
      await axios.post(`${url}/barang/tambah`, dataPayload);
    } catch (e) {
      console.log(e);
      error = e.message;
    }
    setTimeout(() => {
      setLoadingUpdate(false);
      getData();
      if (error) Swal.fire("Gagal", error, "error");
      else Swal.fire("Berhasil", "Berhasil Tambah Data", "success");
    }, 800);
  }
  return (
    <>
      <Modal isOpen={!!isOpen} toggle={() => handleCloseModal()}>
        <ModalHeader toggle={() => handleCloseModal()}>
          Detail Barang
        </ModalHeader>
        <div
          style={{
            marginTop: "10px",
            marginBottom: "10px",
            padding: "20px"
          }}
        >
          <FormGroup>
            <Label for="product_name">Nama Produk</Label>
            <Input
              id="product_name"
              name="product_name"
              placeholder="Nama Produk"
              onChange={e =>
                setDataPayload({
                  ...dataPayload,
                  product_name: e.target.value
                })
              }
              value={dataPayload.product_name}
              type="text"
            />
          </FormGroup>
          <FormGroup>
            <Label for="product_image">Gambar Produk</Label>
            <Input
              id="product_image"
              name="product_image"
              placeholder="Link URL Image"
              onChange={e =>
                setDataPayload({
                  ...dataPayload,
                  product_image: e.target.value
                })
              }
              value={dataPayload.product_image}
              type="text"
            />
          </FormGroup>
          <FormGroup>
            <Label for="product_sku">SKU Produk</Label>
            <Input
              id="product_sku"
              name="product_sku"
              onChange={e =>
                setDataPayload({
                  ...dataPayload,
                  product_sku: e.target.value
                })
              }
              value={dataPayload.product_sku}
              placeholder="SKU Produk"
            />
          </FormGroup>
          <FormGroup>
            <Label for="product_no">Nomor Product</Label>
            <Input
              id="product_no"
              name="product_no"
              onChange={e =>
                setDataPayload({
                  ...dataPayload,
                  product_no: e.target.value
                })
              }
              value={dataPayload.product_no}
              placeholder="Nomor Produk"
            />
          </FormGroup>
          <FormGroup>
            <Label for="product_price">Harga Produk</Label>
            <Input
              id="product_price"
              name="product_price"
              placeholder="Harga Produk"
              onChange={e =>
                setDataPayload({
                  ...dataPayload,
                  product_price: e.target.value
                })
              }
              value={dataPayload.product_price}
              type="number"
            />
          </FormGroup>
          <FormGroup>
            <Label for="product_detail">Product Detail</Label>
            <Input
              id="product_detail"
              name="product_detail"
              placeholder="Detail Produk"
              onChange={e =>
                setDataPayload({
                  ...dataPayload,
                  product_detail: e.target.value
                })
              }
              value={dataPayload.product_detail}
              type="textarea"
            />
          </FormGroup>
        </div>
        <ModalFooter>
          {action !== "add" && (
            <>
              <Button
                disabled={loadingUpdate || loadingDelete}
                onClick={handleDelete}
              >
                {loadingDelete ? <Spinner size="sm" /> : "Hapus"}
              </Button>
              <Button
                disabled={loadingUpdate || loadingDelete}
                onClick={handleUpdate}
              >
                {loadingUpdate ? <Spinner size="sm" /> : "Ubah"}
              </Button>
            </>
          )}
          {action === "add" && (
            <Button disabled={loadingUpdate} onClick={handleInsert}>
              {loadingUpdate ? <Spinner size="sm" /> : "Tambah Data"}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </>
  );
};

export default React.memo(ModalMovie);
