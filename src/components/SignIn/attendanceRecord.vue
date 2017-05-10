<template>
    <div>
      <vue-event-calendar
        :events="demoEvents">
        都是对的
      </vue-event-calendar>
    </div>
</template>
<script>

    export default {
        data(){
            return {
                demoEvents: [{
                  date: '2016/12/15',
                  title: 'Foo',
                  desc: 'longlonglong description'
                },{
                  date: '2016/11/12',
                  title: 'Bar'
                }]
            }
        },
        created: function () {

        },

        methods: {},

        components: {
            //      ManyCompany
        }
    }

</script>

<style scoped>

</style>
