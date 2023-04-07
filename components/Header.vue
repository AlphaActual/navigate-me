<template>
    <div class="header d-flex justify-content-between align-items-center ps-2 pe-2">
        <div class="fw-bold fs-5">{{pageTitle}}</div>
        <div>Total time: <span class="fw-bold"> {{totalT}}</span> hrs</div>
        <div>Total distance: <span class="fw-bold"> {{totalD.toFixed(2)}}</span> NM</div>
        <div>Username</div>
    </div>
</template>
<script>
export default {
    name:"Header",
    props: {
        pageTitle:{
            type: String,
            required: true
        },
        totalD:{
            type: Number,
            required: true
        },
        totalT:{
            type: String,
            required: true
        }
    }
}
</script>
<style scoped>
    .header {
        height: 40px;
        border-bottom: 1px solid gray;
    }
</style>