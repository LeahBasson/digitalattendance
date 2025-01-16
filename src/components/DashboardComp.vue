<template>
  <div class="dashboard-comp">
 
     <div class="dash-content-container">

        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/lca-class-one?fullView=false"
        title="Life Choices Academy Class 1"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>

    <router-link to="/lca-class-one?fullView=true">
      <button class="dash-button">Life Choices Academy C1</button>
    </router-link>
        </div>

        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/lca-class-two?fullView=false"
        title="Life Choices Academy Class 2"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/lca-class-two?fullView=true">
        <button class="dash-button">Life Choices Academy C2</button>
      </router-link>
        </div>

        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/green-solar?fullView=false"
        title="Green Solar"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/green-solar?fullView=true">
        <button class="dash-button">Green Solar</button>
      </router-link>
        </div>

        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/green-solar-youth?fullView=false"
        title="Green Solar Youth"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/green-solar-youth?fullView=true">
        <button class="dash-button">Green Solar Youth</button>
      </router-link>
        </div>

        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/lc-studio?fullView=false"
        title="Lc Studio"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/lc-studio?fullView=true">
        <button class="dash-button">LC Studio</button>
      </router-link>
        </div>


        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/youth-force?fullView=false"
        title="Youth Force"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/youth-force?fullView=true">
        <button class="dash-button">Youth Force</button>
      </router-link>
        </div>

     </div>
    
  </div>
</template>

<script>
export default {
  name: "DashboardComp",
};
</script>

<style>
.button-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.iframe-container {
  width: 100%;
  height: 300px;
  margin-top: 2rem;
  /* border: 1px solid #ddd; */
  border-radius: 10px;
  overflow: hidden;
}

.iframe {
  width: 100%;
  height: 100%;
}

.dash-content{
  display: flex;
  justify-content: center;
  width: 28%;
  flex-direction: column;
  margin: auto;
}

.dash-content-container{
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  justify-content: space-between;
  margin: auto;
  margin-top: 6rem;
  margin-bottom: 2rem;
}

.dash-button{
  border-radius: 1.5rem;
  padding: 0.8rem 1rem;
  width: 15rem;
  border: none;
  background-color: var(--alternative);
  color: var(--secondary);
  margin-top: 1rem;
  margin-bottom: 8rem;
}

.dash-button:hover{
  background-color: var(--awesome);
}


</style>
