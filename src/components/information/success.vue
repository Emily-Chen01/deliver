<template>
    <div>
        <div class="success">
            <div>
                <img src="../../assets/img/success.png" alt="">
                <div>投递成功</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        setTimeout(() => {
            this.$router.push({ path: "/" });
        }, 1000);
    },
}
</script>

<style lang="scss">
    .success{
        div{
            width:300px;
            height:400px;
            position:absolute;
            top:50%;
            left:50%;
            margin:-150px 0 0 -150px ;
            img{
                width:180px;
                height: 180px;
            }
            div{
                font-size: 30px;
                color: #211F22;
                margin-top:0px;
            }
        }
    }
</style>