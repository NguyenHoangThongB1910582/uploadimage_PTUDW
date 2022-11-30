<template>
  <div class="container">
      <div class="row">
          <div class="col-md-12">
              <button type="button" class="bg-info" data-bs-toggle="modal" data-bs-target="#createTicketModal"
              >Upload
          </button>
          
          </div>
      </div><br />
      <div class="d-flex justify-content-center" v-if="loading">
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>
<table class="table table-responsive table-bordered" id="tickets-table">
    <thead>
        <tr>
            <th>Title</th>
            <th>Created by</th>
            <th>Status</th>
            <th>Updated at</th>
        </tr>
    </thead>
 
    <tbody>
        <tr v-for="ticket in tickets" v-bind:key="ticket._id">
            <td v-text="ticket.title"></td>
            <td v-text="ticket.createdBy.name"></td>
            <td v-text="ticket.status.toUpperCase()"></td>
            <td v-text="dateTimeInFormat(ticket.updatedAt)"></td>
            
        </tr>
    </tbody>
</table>
<nav v-if="pages > 1">
    <ul class="pagination">
        <li v-for="page in pages" v-bind:class="'page-item ' + (page == pageNumber ? 'active' : '')">
            <router-link class="page-link bg-info" v-bind:to="'/tickets/all/' + page" v-text="page" v-on:click="paginate(page)"></router-link>
        </li>
    </ul>
</nav>
  </div>
  <div class="modal" id="createTicketModal" >
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Upload</h5>
              
          </div>

          <div class="modal-body">
              <form id="form-create-ticket" enctype="multipart/form-data" 
          v-on:submit.prevent="createTicket">
          <div class="form-group">
              <label>Title</label>
              <input type="text" name="title" class="form-control" required />
          </div>
          <br />
          <div class="form-group">
              <label>Description</label>
              <textarea name="description" class="
              form-control" required></textarea>
          </div>
          <br />
          <div class="form-group">
              <label>Attach screenshots</label>
              <input type="file" multiple accept="image/*" name="images" class="form-control" />

          </div>
          <br />
          
          <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">close</button>

              <button type="submit" v-bind:disabled="creatingTicket" form="form-create-ticket" class="btn btn-primary" >Upload

              <i class="fa fa-spinner fa-spin" v-if="creatingTicket"></i>
              </button>
          </div></form>
          </div>

      </div>
  </div>
  </div>
   
          
         
          
         

    

</template>

<script>

  import axios from "axios"
  import swal from "sweetalert2"
  const bootstrap = require('bootstrap')
  export default {
      name: "TicketsComponent",

      data() {
          return {
              creatingTicket: false,
              tickets: [],
              loading: false,
              pageNumber: this.$route.params.page ?? 1,
pages: 0
          }
      },

      methods: {
        paginate: function (page) {
    this.pageNumber = page
    this.getData()
},
        getData: async function () {
    this.loading = true
    if(this.pageNumber == ""){
      this.pageNumber = 1
    }
    const formData = new FormData()
    formData.append("page", this.pageNumber)
 
    const response = await axios.post(
        this.$apiURL + "/tickets",
        formData,
        {
            headers: this.$headers
        }
    )
 
    this.loading = false
 
    if (response.data.status == "success") {
        this.tickets = response.data.tickets
        this.pages = response.data.pages
        this.pageNumber = response.data.pageNumber
    } else {
        swal.fire("Error", response.data.message, "error")
    }
},

          createTicket: async function () {
              this.creatingTicket = true

              const form = event.target
              const formData = new FormData(form)

              const response = await axios.post(
                  this.$apiURL + "/tickets/create",
                  formData,
                  {
                      headers: this.$headers
                  }
              )

              this.creatingTicket = false
              swal.fire("Upload", response.data.message, response.data.status)

              if (response.data.status == "success") {
                  form.reset()
                  this.tickets.unshift(response.data.ticket)
              }
          }
      },
      mounted: function () {
    this.getData()
}

  }
</script>