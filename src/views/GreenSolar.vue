<template>
    <div class="back-icon">
        <router-link to="/">
            <i class="fi fi-br-angle-small-left"></i>
        </router-link> 
    </div>
    
    <div class="heading">
      <h1>Green Solar</h1>
      <p>Daily Logs</p>
    </div>
</template>
  
<script>
export default {
name: 'LcaClassOne',
}
</script>

<style>
.heading{
    width: 95%;
    height: 220px;
    background-color: var(--alternative);
    margin: auto;
    text-align: center;
    padding-top: 4rem;
    margin-top: 0.5rem;
    border-radius: 2rem;
    color: var(--secondary);
}

.heading p{
    font-size: 1.3rem;
}

.back-icon { 
    display: flex; 
    align-items: center; 
    padding: 1rem;
    margin-left: 1rem;
} 

.back-icon i { 
    color: var(--guestColor); 
    font-size: 2.5rem; 
    cursor: pointer; 
}

.back-icon a {
    text-decoration: none;
}
</style>
  