import { makeAutoObservable } from "mobx";
import axios from 'axios';

const url = 'http://localhost:8081';

class Store {
  listBarang = []
  constructor() {
    makeAutoObservable(this)
    this.getData()
  }
  async getData(limit = "1") {
    try {
      const response = await axios.get(`${url}/barang/tarik/${limit}`)
      this.listBarang = [...this.listBarang,...response.data.data]
    } catch (e) {
      console.log(e)
    }
  }
}

const BarangStore = new Store();
export default BarangStore;