<template>
    <div id="app">
        <v-app>
            <app-header
                class="app-shell-header"
                @click-menu="handleClickHeaderMenu"
                @click-back="handleClickHeaderBack">
            </app-header>
            <app-sidebar
                @hide-sidebar = "handleHideSidebar"
                @show-sidebar = "handleShowSidebar"
            >
            </app-sidebar>
            <transition
                :name="pageTransitionEffect"
                @before-enter="handleBeforeEnter"
                @after-enter="handleAfterEnter">
                <keep-alive
                    :include="[...keepAlivePages]">
                    <router-view
                        :key="routerViewKey"
                        class="app-view"
                        :class="[{'app-view-with-header': appHeaderShow}, pageTransitionClass]"
                        ></router-view>
                </keep-alive>
            </transition>
            <update-toast></update-toast>
        </v-app>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import UpdateToast from '@/components/UpdateToast';
import {keepAlivePages} from '@/.lavas/router';
import util from '@/api/util';

export default {
    name: 'app',
    components: {
        UpdateToast,
        AppHeader,
        AppSidebar
    },

    mounted() {
        console.log("mounted!!!");

        let this1 = this;
        navigator.serviceWorker.ready.then(function(reg) {
            console.log("ready1!!!");
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                console.log("serviceWorker started!!!");
                // let reg = navigator.serviceWorker.reg;
                // console.log("Yes, it did register service worker.");
                reg.pushManager.getSubscription().then(subscription => {
                    // 如果用户没有订阅
                    if (!subscription) {
                        console.log("You have not subscribed our notification");
                        this1.subscribeUser(reg);
                    } else {
                        localStorage.setItem("subscription", JSON.stringify(subscription));
                        console.log("You have subscribed our notification");
                        console.log(JSON.stringify(subscription));
                    }       
                });     
            }
        });
        
        window.addEventListener('sw.update', function() {
            console.log("sw.update!!!");
        });

        self.addEventListener('push', function (event) {
        console.log(event.data.json())
        if (event.data) {
        var promiseChain = Promise.resolve(event.data.json())
                .then(data => self.registration.showNotification(data.title, {}));
        event.waitUntil(promiseChain);
    }
});
    },

    computed: {
        ...mapState('pageTransition', {
            pageTransitionType: state => state.type,
            pageTransitionEffect: state => state.effect
        }),

        ...mapState('appShell/appHeader', {
            appHeaderShow: state => state.show
        }),

        pageTransitionClass() {
            return `transition-${this.pageTransitionType}`;
        },

        // https://github.com/lavas-project/lavas/issues/119
        routerViewKey() {
            let {name, params} = this.$route;
            let paramKeys = Object.keys(params);
            if (paramKeys.length) {
                return name + paramKeys.reduce((prev, cur) => prev + params[cur], '');
            }
            return null;
        }
    },
    data() {
        return {
            // https://github.com/lavas-project/lavas/issues/112
            keepAlivePages
        };
    },
    methods: {
        ...mapActions('appShell/appSidebar', [
            'showSidebar',
            'hideSidebar'
        ]),
        ...mapActions('appShell/common', [
            'setPageSwitching'
        ]),
        handleBeforeEnter(el) {
            this.setPageSwitching(true);
        },
        handleAfterEnter(el) {
            this.setPageSwitching(false);
        },
        handleClickHeaderBack() {
            this.$router.go(-1);
        },
        handleClickHeaderMenu() {
            this.showSidebar();
        },
        handleHideSidebar() {
            this.hideSidebar();
        },
        handleShowSidebar() {
            this.showSidebar();
        },
        subscribe(serviceWorkerReg) {
            console.info("subscribe1")

            serviceWorkerReg.pushManager.getSubscription().then(subscription => {
              // 3. 发送推送订阅对象到服务器，具体实现中发送请求到后端api
                sendEndpointInSubscription(subscription);
             console.info("sendEndpointInSubscription")
           }).catch(function () {
              console.info("error")
               if (Notification.permission === 'denied') {
                    // 用户拒绝了订阅请求
                }
            });



            // serviceWorkerReg.pushManager.subscribe({ // 2. 订阅
            //     userVisibleOnly: true,
            //     applicationServerKey: thils.urlBase64ToUint8Array('<applicationServerKey>')
            // })
            // .then(function (subscription) {
            //     // 3. 发送推送订阅对象到服务器，具体实现中发送请求到后端api
            //     sendEndpointInSubscription(subscription);
            // })
            // .catch(function () {
            //     if (Notification.permission === 'denied') {
            //         // 用户拒绝了订阅请求
            //     }
            // });
        },
        subscribeUser(swRegistration) {
            const applicationServerPublicKey = "BEshS3W6UWT1GLZSFvErtavHOxlhtwH3NKZqkPS-i1k-MvyUvzxu_ZGwP7SjrdQ7p4MsSSLj6CRVTr_4ogNF7rM";
            const applicationServerKey = util.urlBase64ToUint8Array(applicationServerPublicKey);
            console.log(applicationServerKey);
 
            swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            })
            // 用户同意
            .then(function(subscription) {
                console.log('User is subscribed:', JSON.stringify(subscription));
                localStorage.setItem("subscription", JSON.stringify(subscription));
            })
            // 用户不同意或者生成失败
            .catch(function(err) {
                console.log('Failed to subscribe the user: ', err);
            });
        }
    }
};
</script>

<style lang="stylus">
@import '~@/assets/stylus/variable'
#app
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    text-align center
    color #2c3e50

    .app-view
        position absolute
        top 0
        right 0
        bottom 0
        left 0
        overflow-x hidden
        overflow-y auto

        &::-webkit-scrollbar
            width 0
            background transparent

        &.app-view-with-header
            top $app-header-height

        &.transition-slide
            transition transform 0.4s cubic-bezier(.55, 0, .1, 1)

            &.slide-left-enter
                transform translate(100%, 0)

            &.slide-right-enter
                transform translate(-100%, 0)

            &.slide-right-leave-active
                transform translate(100%, 0)

            &.slide-left-leave-active
                transform translate(-100%, 0)

        &.transition-fade
            opacity 1
            transition opacity 1s ease

            &.fade-enter
                opacity 0

            &.fade-leave-active
                opacity 0

        // &.transition-slide-fade
        //     &.slide-fade-enter-active
        //         transition: all .3s ease
        //
        //     &.slide-fade-leave-active
        //         transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0)
        //
        //     &.slide-fade-enter,
        //     &.slide-fade-leave-to
        //         transform: translateX(10px)
        //         opacity: 0
</style>
