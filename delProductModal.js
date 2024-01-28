export default {
    template: '#delProductModal',
    props: ['item'],
    data() {
      return {
          api_url: 'https://ec-course-api.hexschool.io',//'https://vue3-course-api.hexschool.io',
          api_path: 'joanhui',
          modal: '',
      };
    },
    mounted() {
        this.modal = new bootstrap.Modal(
            document.getElementById("delProductModal"),{keyboard: false,}
          );
    },
    methods: {
      delProduct() {
        axios.delete(`${this.api_url}/v2/api/${this.api_path}/admin/product/${this.item.id}`).then((response) => {
          alert(response.data.message);
          this.hideModal();
          this.$emit('update');//通知父層要更新products
        }).catch((err) => {
          alert(err.response.data.message);
        });
      },
      
       openModal() {
        this.modal.show();
       },
       hideModal() {
        this.modal.hide();
       },
    },
  }