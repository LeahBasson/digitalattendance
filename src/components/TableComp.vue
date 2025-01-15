<template>
    <div class="table-container">
      
        <div class="table-heading">
             <div>
                <p>Fullname</p>
             </div>
             <div>
                <p>Status</p>
             </div>
             <div>
                <p>Time</p>
             </div>
        </div>

        <div class="table-border-btm"></div>

        <div class="table-content">
            <div class="table-data-one">
                <p>Leah Basson</p>
             </div>
             <div class="table-data-two">
                <span class="status-icon"></span>
                <p>Onsite</p>
             </div>
             <div class="table-data-three">
                <p>10:12</p>
             </div>
        </div>

        <div class="table-content">
            <div class="table-data-one">
                <p>Leah Basson</p>
             </div>
             <div class="table-data-two">
                <span class="status-icon"></span>
                <p>Onsite</p>
             </div>
             <div class="table-data-three">
                <p>10:12</p>
             </div>
        </div>

        <div class="table-content">
            <div class="table-data-one">
                <p>Leah Basson</p>
             </div>
             <div class="table-data-two">
                <span class="status-icon"></span>
                <p>Onsite</p>
             </div>
             <div class="table-data-three">
                <p>10:12</p>
             </div>
        </div>

    </div>
  </template>
  
  <script>
  export default {
    name: 'StatusTable',
  };
  </script>
  
  <style scoped>
  .table-container{
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .table-heading{
    display: flex;
    justify-content: space-between;
    width: 94%;
    margin: auto;
    margin-top: 1rem;
  }

  .table-content{
    display: flex;
    justify-content: space-between;
    /* gap: 22rem; */
    width: 95%;
    border-radius: 1rem;
    margin: auto;
    margin-top: 1rem;
    background-color: var(--logColor);
    padding: 1rem;
  }

  .table-border-btm{
    width: 94%;
    height: 1px;
    background-color: var(--guestColor);
    margin: auto;
  }

  .status-icon{
    margin-top: 0.4rem;
  }

    .table-data-one{
    word-wrap: break-word;
    width: 38%;
    /* background-color: pink; */
    text-align: start;
  }

  .table-data-two{
    width: 20%;
    /* background-color: pink; */
    text-align: center;
    display: flex;
    justify-content: start;
  }

  .table-data-three{
    width: 20%;
    /* background-color: pink; */
    text-align: end;
  }

  .table-content{
    font-size: 1rem;
  }
  </style>
  