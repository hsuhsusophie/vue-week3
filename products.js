import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = '';  
let delProductModal = '';

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'sophie',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  //若要抓取dom元素 created改成mounted
  //畫面生成後重新擷取dom元素
  mounted() { 
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    getData() {  //取得產品列表
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;  //有分頁
      //all全部的 
      axios.get(url).then((response) => {
        this.products = response.data.products;
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    updateProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;  
      axios.post(url, { data: this.tempProduct } ).then((response) => {
        this.products = response.data.products;
      }).catch((err) => {
        alert(err.response.data.message);
      })

    },
    openModal(isNew, item) {
      if (isNew === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        productModal.show();
      } else if (isNew === 'edit') {
        this.tempProduct = { ...item };
        this.isNew = false;
        productModal.show();
      } else if (isNew === 'delete') {
        this.tempProduct = { ...item };
        delProductModal.show()
      }


    },
    delProduct() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        this.getData();
      }).catch((err) => {
        alert(err.response.data.message);
      })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  },
}).mount('#app');