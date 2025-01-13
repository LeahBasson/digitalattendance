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
      <button>Life Choices Academy C1</button>
    </router-link>
        </div>

        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/lca-class-one?fullView=false"
        title="Life Choices Academy Class 1"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/lca-class-two">
        <button>Life Choices Academy C2</button>
      </router-link>
        </div>

        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/lca-class-one?fullView=false"
        title="Life Choices Academy Class 1"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/lca-class-two">
        <button>Life Choices Academy C2</button>
      </router-link>
        </div>

        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/lca-class-one?fullView=false"
        title="Life Choices Academy Class 1"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/lca-class-two">
        <button>Life Choices Academy C2</button>
      </router-link>
        </div>

        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/lca-class-one?fullView=false"
        title="Life Choices Academy Class 1"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/lca-class-two">
        <button>Life Choices Academy C2</button>
      </router-link>
        </div>


        <div class="dash-content">
          <div class="iframe-container">
      <iframe
        src="/lca-class-one?fullView=false"
        title="Life Choices Academy Class 1"
        frameborder="0"
        class="iframe"
      ></iframe>
    </div>
    <router-link to="/lca-class-two">
        <button>Life Choices Academy C2</button>
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
  height: 350px;
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
  width: 30%;
  flex-direction: column;
}

.dash-content-container{
  display: flex;
  flex-wrap: wrap;
  width: 80%;
  margin: auto;
  margin-bottom: 2rem;
}
</style>
