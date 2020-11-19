<template>
    <div v-if="loading" class="spinner-border text-primary spinner" role="status">
        <span class="sr-only">Loading...</span>
    </div>
</template>

<script>
export default {
    name:'Spinner',
    props:['loading'],
}
</script>>
<style scoped>
    .spinner{
        position:absolute;
        top:50%;
        left:50%;
    }
</style>