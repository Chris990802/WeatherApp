<template>
    <div>
        <Suspense>
            <AsyncCityView/>

            <template #fallback>
                Loading...
            </template>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
import AsyncCityView from '@/components/AsyncCityView.vue';

</script>
