


<template>
    <div id="content">
        <div>
            <h2>LAVASs</h2>
            <h4>[ˈlɑ:vəz]</h4>
        </div>
        <yd-button @click.native="doThis" styleSheet='color=red'>xxx</yd-button>
        <!-- <yd-button>
            {{ reversemessage }}
        </yd-button> -->
                <input v-model="message">
        <yd-textarea v-model="message"></yd-textarea>
        <ol>
            <!-- 2.2.0+ 的版本里，当在组件中使用 v-for 时，key 现在是必须的。 -->
            <todoitem v-for="item in items" v-bind:to-do="item" v-bind:key="item.id"></todoitem>
        </ol>
        <img src="/static/img/icons/android-chrome-192x192.png" alt="xxxx">
        <yd-pullrefresh :callback="loadList" ref="pullrefreshDemo">
            <yd-list theme="4">
                <yd-list-item v-for="item, key in list" :key="key">
                    <img slot="img" :src="item.img">
                    <span slot="title">{{item.title}}</span>
                    <yd-list-other slot="other">
                        <div>
                            <span class="demo-list-price"><em>¥</em>{{item.price}}</span>
                            <span class="demo-list-del-price">¥{{item.w_price}}</span>
                        </div>
                        <div>content</div>
                    </yd-list-other>
                </yd-list-item>
            </yd-list>
        </yd-pullrefresh>
    </div>
</template>


<script>
import todoitem from '@/components/todoitem.vue'
import axios from 'axios';

export default {
    data() {
        return {
            message: 'Hello',
            items: [
                'aaa',
                'bbb'
            ],
            list: [
                    {img: "//img1.shikee.com/try/2016/06/23/14381920926024616259.jpg", title: "标题111标题标题标题标题", price: 156.23, w_price: 89.36},
                    {img: "//img1.shikee.com/try/2016/06/21/10172020923917672923.jpg", title: "标题222标题标题标题标题", price: 256.23, w_price: 89.36},
                    {img: "//img1.shikee.com/try/2016/06/23/15395220917905380014.jpg", title: "标题333标题标题标题标题", price: 356.23, w_price: 89.36},
                    {img: "//img1.shikee.com/try/2016/06/25/14244120933639105658.jpg", title: "标题444标题标题标题标题", price: 456.23, w_price: 89.36},
                    {img: "//img1.shikee.com/try/2016/06/26/12365720933909085511.jpg", title: "标题555标题标题标题标题", price: 556.23, w_price: 89.36},
                    {img: "//img1.shikee.com/try/2016/06/19/09430120929215230041.jpg", title: "标题666标题标题标题标题", price: 656.23, w_price: 89.36}
                ]
        }
    },

    components:{
        todoitem
    },

    created() {
    },

    methods:{
        reverse: function(event) {
            //this.message = this.message.split('').reverse().join('')
            console.log(event.name)
        },
        async doThis() {
            var woeid = 2151849
            let url = `https://query.yahooapis.com/v1/public/yql?q=select%20item.condition%20from%20weather.forecast%20where%20woeid%20%3D%20${woeid}&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
            let result = await axios(url);
            let condition = result.data.query.results.channel.item.condition;
            console.log('conditon:', condition)
            this.message = JSON.stringify(condition);    
        },
        handleCacheEvent(e) {
            console.info(e)
        },
        handleCacheEvent(e) {
            console.info(e)
        },
        askPermission() {
            return new Promise(function (resolve, reject) {
            var permissionResult = Notification.requestPermission(function (result) {
                // 旧版本
                resolve(result);
            });
            if (permissionResult) {
                // 新版本
                permissionResult.then(resolve, reject);
            }
            })
            .then(function (permissionResult) {
                if (permissionResult !== 'granted') {
                    // 用户未授权
                }
            });
        }, 
        loadList() {
            let asynThis = this;
            setTimeout(function() {
                asynThis.$refs.pullrefreshDemo.$emit('ydui.pullrefresh.finishLoad');
            }, 2000);
        },
    },

    watch: {
        message(newValue, oldValue) {
            console.log(newValue, oldValue)
        }
    },

    // 计算属性，当源变化时，才会响应，这里的源特指message属性
    computed: {
        reversemessage:function() {
            return this.message.split('').reverse().join('')
        }
    }
}
</script>
