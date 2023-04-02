<template>
    <div class="header d-flex justify-content-between align-items-center ps-2 pe-2">
        <div>{{pageTitle}}</div>
        <div>Tu ce biti razni info  podaci</div>
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