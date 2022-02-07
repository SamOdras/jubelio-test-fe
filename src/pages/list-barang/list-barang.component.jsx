import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  Button,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import "./list-barang.styles.scss";
import ModalDetailBarang from './list-barang.modal';

const Frame = (props) => {
  // const { isLoading, searchValue, onChangeSearch } = props
  const { setAction, setIsOpen, searchValue, setSearchValue } = props;
  const handleTambah = () => {
    setAction("add")
    setIsOpen({})
  }
  return (
    <div>
      <Navbar
        style={{ boxShadow: "1px 4px 4px -4px", height: "60px" }}
        color="light"
        container
        expand
        fixed="top"
        // full={true}
        light
      >
        <NavbarBrand
          title="brand"
          style={{ cursor: "pointer" }}
          onClick={() => window.location.assign("/")}
        >
          List Barang
        </NavbarBrand>
        <NavbarToggler onClick={function noRefCheck() {}} />
        <Collapse navbar>
          <Nav className="me-auto" navbar>
            <input
              className="form-control"
              title="searchMovie"
              style={{ marginLeft: "20px", width: "500px" }}
              placeholder="Cari Barang"
              type="search"
              onChange={e => setSearchValue(e.target.value)}
              value={searchValue}
            />
          </Nav>
        </Collapse>
        <Button onClick={handleTambah}>Tambah Barang</Button>
      </Navbar>
      {props.children}
    </div>
  );
}

const url = 'http://localhost:8081';
function MoneyFormatter(data, prefix) {
  if (data === null || data === undefined) {
    return;
  }
  // var number_string = data.replace(/[^,\d]/, ",").toString(), // simple regex;
  var number_string = data.toString(), // simple regex;
    split = number_string.split("."),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi data ribuan
  if (ribuan) {
    let separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  return prefix === undefined ? rupiah : rupiah ? `${prefix}. ` + rupiah : "";
}

const ListBarang = (props) => {
  const [listBarang, setListBarang] = useState([])
  const [open, setIsOpen] = useState(false);
  const [action, setAction] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [maxListLength, setMaxListLength] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initData = async () => {
      try {
        const response = await axios.get(`${url}/barang/tarik/1`)
        setListBarang(response.data.data)
        setMaxListLength(response.data.data.length)
      } catch (e) {
        console.log(e)
      }
    }
    initData()
  }, []);

  const getData = async (limit = 1) => {
      try {
        const response = await axios.get(`${url}/barang/tarik/${limit}`);
        setListBarang(response.data.data);
      } catch (e) {
        console.log(e);
      }
  }
  const infiniteSearch = useCallback(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${url}/barang/tarik/${page + 1}`);
        const data = response.data
        if(data.data.length > maxListLength){
          setListBarang(data.data);
          setMaxListLength(data.data.length)
        } else {
          setHasMore(false)
        }
      } catch(e){
        console.log(e)
      }
      setIsLoading(false)
      setPage(npage => npage + 1)
  }, [page, setIsLoading]);
  const observer = useRef();
  const lastBarangRef = useCallback(
    node => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(e => {
        if (e[0].isIntersecting && hasMore) {
          infiniteSearch();
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, isLoading, infiniteSearch]
  );
  
  const renderListBarang = () => {
    let renderList = listBarang
    renderList = renderList.filter(item => item.product_name.includes(searchValue))
    return renderList.map(item => {
      return (
        <div ref={lastBarangRef}>
          <Card
            key={item.product_no}
            onClick={() => setIsOpen(item)}
            className="card-wrapper"
            style={{
              width: "290px",
              marginRight: "10px",
              marginBottom: "10px"
            }}
          >
            <CardImg
              alt="Card image cap"
              src={item.product_image}
              top
              width="100%"
              height="340px"
            />
            <CardBody>
              <CardText style={{ marginBottom: "5px", fontSize: "14.5px" }}>
                {item.product_name}
              </CardText>
              <CardTitle tag="h5">
                {MoneyFormatter(item.product_price, "Rp")}
              </CardTitle>
            </CardBody>
          </Card>
        </div>
      );
    });
  }
  return (
    <Frame setIsOpen={setIsOpen} setAction={setAction} setSearchValue={setSearchValue} searchValue={searchValue}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "80px 30px 30px 30px"
        }}
      >
      {renderListBarang()}
      </div>
      <ModalDetailBarang
        isOpen={open}
        setIsOpen={setIsOpen}
        action={action}
        setAction={setAction}
        getData={getData}
      />
    </Frame>
  );
};

export default ListBarang;